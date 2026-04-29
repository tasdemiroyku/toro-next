'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import ToretBull from '@/components/ToretBull'

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Groups a flat list of messages into conversation objects.
 * A conversation = unique (listing_id + sorted pair of user IDs).
 */
function groupConversations(messages, currentUserId) {
  const map = new Map()

  for (const msg of messages) {
    const otherId =
      msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id
    // Sort IDs so A→B and B→A produce the same key
    const key = `${msg.listing_id}::${[currentUserId, otherId].sort().join(':')}`

    if (!map.has(key)) {
      map.set(key, {
        key,
        listingId: msg.listing_id,
        listing: msg.listing,
        otherId,
        otherProfile:
          msg.sender_id === currentUserId ? msg.receiver : msg.sender,
        lastMessage: msg,
        unreadCount: 0,
        messages: [],
      })
    }

    const conv = map.get(key)
    // Messages arrive newest-first; push maintains that order for grouping
    conv.messages.push(msg)

    if (!msg.read && msg.receiver_id === currentUserId) {
      conv.unreadCount++
    }
  }

  return Array.from(map.values()).sort(
    (a, b) =>
      new Date(b.lastMessage.created_at) - new Date(a.lastMessage.created_at)
  )
}

function formatTime(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now - date) / 86400000)

  if (diffDays === 0)
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7)
    return date.toLocaleDateString('en-GB', { weekday: 'short' })
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function Avatar({ profile, size = 'md' }) {
  const dim = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'
  const initial =
    profile?.full_name?.[0]?.toUpperCase() || '?'

  if (profile?.avatar_url) {
    return (
      <img
        src={profile.avatar_url}
        alt=""
        className={`${dim} rounded-full object-cover border border-toro-dark/10 shrink-0`}
      />
    )
  }
  return (
    <div
      className={`${dim} rounded-full bg-toro-dark flex items-center justify-center text-toro-light font-bold shrink-0`}
    >
      {initial}
    </div>
  )
}

// ─── Thread View ──────────────────────────────────────────────────────────────

function ThreadView({ conversation, currentUserId, onBack, onNewMessage }) {
  const supabase = createClient()
  const [messages, setMessages] = useState(
    // Thread messages sorted oldest-first for display
    [...conversation.messages].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    )
  )
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Mark unread messages as read when thread opens
  useEffect(() => {
    const unreadIds = messages
      .filter(m => !m.read && m.receiver_id === currentUserId)
      .map(m => m.id)

    if (unreadIds.length === 0) return

    supabase
      .from('messages')
      .update({ read: true })
      .in('id', unreadIds)
      .then(() => {
        setMessages(prev =>
          prev.map(m =>
            unreadIds.includes(m.id) ? { ...m, read: true } : m
          )
        )
      })
  }, [conversation.key])

  // Real-time subscription for incoming messages in this thread
  useEffect(() => {
    const channel = supabase
      .channel(`thread:${conversation.key}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${currentUserId}`,
        },
        payload => {
          const msg = payload.new
          // Only add if it belongs to this conversation
          if (
            msg.listing_id === conversation.listingId &&
            msg.sender_id === conversation.otherId
          ) {
            const enriched = {
              ...msg,
              // Mark read immediately since thread is open
              read: true,
              sender: conversation.otherProfile,
              receiver: { id: currentUserId },
              listing: conversation.listing,
            }
            setMessages(prev => [...prev, enriched])
            onNewMessage(enriched)
            // Mark as read in DB
            supabase
              .from('messages')
              .update({ read: true })
              .eq('id', msg.id)
          }
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [conversation.key])

  const handleSend = async () => {
    const content = input.trim()
    if (!content || sending) return

    setSending(true)
    setInput('')

    // Optimistic UI
    const optimistic = {
      id: `optimistic-${Date.now()}`,
      listing_id: conversation.listingId,
      sender_id: currentUserId,
      receiver_id: conversation.otherId,
      content,
      read: false,
      created_at: new Date().toISOString(),
      sender: { id: currentUserId },
      receiver: conversation.otherProfile,
      listing: conversation.listing,
      _optimistic: true,
    }
    setMessages(prev => [...prev, optimistic])

    const { data, error } = await supabase
      .from('messages')
      .insert({
        listing_id: conversation.listingId,
        sender_id: currentUserId,
        receiver_id: conversation.otherId,
        content,
      })
      .select()
      .single()

    if (error) {
      // Remove optimistic message on failure
      setMessages(prev => prev.filter(m => m.id !== optimistic.id))
      setInput(content)
    } else {
      // Replace optimistic with real message
      setMessages(prev =>
        prev.map(m => (m.id === optimistic.id ? { ...optimistic, ...data } : m))
      )
      onNewMessage({ ...optimistic, ...data })
    }

    setSending(false)
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Thread header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-toro-dark/10 bg-white shrink-0">
        <button
          onClick={onBack}
          className="md:hidden p-1.5 -ml-1.5 text-toro-dark/40 hover:text-toro-dark transition"
          aria-label="Back to conversations"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <Avatar profile={conversation.otherProfile} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-toro-dark truncate">
            {conversation.otherProfile?.full_name || 'Unknown'}
          </p>
          <p className="text-xs text-toro-dark/40 truncate">
            Re: {conversation.listing?.title || 'Listing'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
        {messages.map((msg, i) => {
          const isMe = msg.sender_id === currentUserId
          const showDate =
            i === 0 ||
            new Date(msg.created_at).toDateString() !==
              new Date(messages[i - 1].created_at).toDateString()

          return (
            <div key={msg.id}>
              {showDate && (
                <div className="flex items-center gap-3 my-3">
                  <div className="flex-1 h-px bg-toro-dark/8" />
                  <span className="text-[10px] font-semibold text-toro-dark/30 uppercase tracking-wide">
                    {new Date(msg.created_at).toLocaleDateString('en-GB', {
                      weekday: 'short', day: 'numeric', month: 'short',
                    })}
                  </span>
                  <div className="flex-1 h-px bg-toro-dark/8" />
                </div>
              )}
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.15 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? 'bg-toro-dark text-toro-light rounded-br-sm'
                      : 'bg-white border border-toro-dark/10 text-toro-dark rounded-bl-sm'
                  } ${msg._optimistic ? 'opacity-70' : ''}`}
                >
                  {msg.content}
                  <div
                    className={`text-[10px] mt-1 ${
                      isMe ? 'text-toro-light/40' : 'text-toro-dark/30'
                    }`}
                  >
                    {formatTime(msg.created_at)}
                    {isMe && (
                      <span className="ml-1.5">
                        {msg._optimistic ? '·' : msg.read ? '✓✓' : '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 px-4 py-3 border-t border-toro-dark/10 bg-white">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Write a message… (Enter to send)"
            rows={1}
            maxLength={500}
            className="toro-input !rounded-2xl resize-none flex-1 max-h-32 overflow-y-auto"
            style={{ minHeight: '44px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="w-11 h-11 rounded-full bg-toro-dark text-toro-gold flex items-center justify-center shrink-0 hover:bg-[#1f3d00] transition disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            aria-label="Send message"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-toro-dark/20 mt-1.5 text-right">
          {input.length}/500
        </p>
      </div>
    </div>
  )
}

// ─── Conversation List Item ───────────────────────────────────────────────────

function ConversationItem({ conv, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-start gap-3 p-4 text-left transition-all ${
        isActive
          ? 'bg-toro-dark/5 border-r-2 border-toro-gold'
          : 'hover:bg-toro-dark/3 border-r-2 border-transparent'
      }`}
    >
      <div className="relative shrink-0">
        <Avatar profile={conv.otherProfile} />
        {conv.unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-toro-gold rounded-full text-[9px] font-black text-white flex items-center justify-center">
            {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-bold text-toro-dark' : 'font-medium text-toro-dark/80'}`}>
            {conv.otherProfile?.full_name || 'Unknown'}
          </p>
          <span className="text-[10px] text-toro-dark/30 shrink-0">
            {formatTime(conv.lastMessage.created_at)}
          </span>
        </div>
        <p className="text-[11px] text-toro-gold/70 font-medium truncate mb-0.5">
          {conv.listing?.title || 'Listing'}
        </p>
        <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'text-toro-dark/70' : 'text-toro-dark/40'}`}>
          {conv.lastMessage.sender_id !== conv.otherId && (
            <span className="mr-1 text-toro-dark/30">You:</span>
          )}
          {conv.lastMessage.content}
        </p>
      </div>
    </button>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function InboxClient({
  initialMessages,
  currentUserId,
  activeListingId,
  activeWithUserId,
}) {
  const router = useRouter()
  const supabase = createClient()

  const [messages, setMessages] = useState(initialMessages)
  const conversations = groupConversations(messages, currentUserId)

  // Find the active conversation from URL params
  const activeConv = conversations.find(
    c =>
      c.listingId === activeListingId &&
      c.otherId === activeWithUserId
  ) ?? null

  // On mobile, when a conversation is active, show only thread
  const [mobileShowThread, setMobileShowThread] = useState(!!activeConv)

  const selectConversation = useCallback(
    conv => {
      setMobileShowThread(true)
      router.replace(
        `/inbox?listing=${conv.listingId}&with=${conv.otherId}`,
        { scroll: false }
      )
    },
    [router]
  )

  const handleBack = useCallback(() => {
    setMobileShowThread(false)
    router.replace('/inbox', { scroll: false })
  }, [router])

  // Real-time: incoming messages from anyone while inbox is open
  useEffect(() => {
    const channel = supabase
      .channel(`inbox-global:${currentUserId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${currentUserId}`,
        },
        payload => {
          // Add to flat message list — ThreadView handles deduplication
          setMessages(prev => [payload.new, ...prev])
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [currentUserId])

  const handleNewMessage = useCallback(msg => {
    setMessages(prev => {
      const exists = prev.some(m => m.id === msg.id)
      return exists ? prev.map(m => (m.id === msg.id ? msg : m)) : [msg, ...prev]
    })
  }, [])

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0)

  return (
    <div className="flex flex-col flex-grow bg-toro-light font-sans">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col px-0 sm:px-4 lg:px-8 py-0 sm:py-6">
        <div className="flex-1 flex bg-white sm:rounded-[2rem] overflow-hidden border border-toro-dark/10 shadow-sm"
          style={{ minHeight: 'calc(100vh - 180px)' }}
        >

          {/* ── Conversation List (left panel) ── */}
          <div
            className={`w-full sm:w-80 lg:w-96 shrink-0 border-r border-toro-dark/10 flex flex-col ${
              mobileShowThread ? 'hidden sm:flex' : 'flex'
            }`}
          >
            {/* List header */}
            <div className="px-5 py-4 border-b border-toro-dark/10 shrink-0">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-toro-dark">Messages</h1>
                {totalUnread > 0 && (
                  <span className="text-xs font-bold bg-toro-gold text-white px-2 py-0.5 rounded-full">
                    {totalUnread} unread
                  </span>
                )}
              </div>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto divide-y divide-toro-dark/5">
              {conversations.length === 0 ? (
                <div className="toro-empty-state !border-0 !rounded-none py-16">
                  <div className="w-14 h-14 text-toro-dark/10">
                    <ToretBull className="w-full h-full" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-toro-dark text-base font-bold">No messages yet</p>
                    <p className="text-toro-dark/40 text-sm max-w-xs mx-auto">
                      When you contact a service provider, your conversations appear here.
                    </p>
                  </div>
                  <button
                    onClick={() => router.push('/listings')}
                    className="toro-btn-primary text-xs !py-2.5 !px-5"
                  >
                    Browse services
                  </button>
                </div>
              ) : (
                conversations.map(conv => (
                  <ConversationItem
                    key={conv.key}
                    conv={conv}
                    isActive={
                      conv.listingId === activeListingId &&
                      conv.otherId === activeWithUserId
                    }
                    onClick={() => selectConversation(conv)}
                  />
                ))
              )}
            </div>
          </div>

          {/* ── Thread View (right panel) ── */}
          <div
            className={`flex-1 flex flex-col min-w-0 ${
              !mobileShowThread ? 'hidden sm:flex' : 'flex'
            }`}
          >
            <AnimatePresence mode="wait">
              {activeConv ? (
                <motion.div
                  key={activeConv.key}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col h-full"
                >
                  <ThreadView
                    conversation={activeConv}
                    currentUserId={currentUserId}
                    onBack={handleBack}
                    onNewMessage={handleNewMessage}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8"
                >
                  <div className="w-16 h-16 text-toro-dark/10">
                    <ToretBull className="w-full h-full" />
                  </div>
                  <div>
                    <p className="text-toro-dark/50 text-sm font-medium">
                      Select a conversation to read messages
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}