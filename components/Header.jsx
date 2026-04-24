'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import ToretBull from './ToretBull'

function useDropdown(delay = 150) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current)
    setOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false)
    }, delay)
  }

  return { open, setOpen, ref, handleMouseEnter, handleMouseLeave }
}

function LanguageDropdown() {
  const { open, setOpen, ref, handleMouseEnter, handleMouseLeave } = useDropdown()

  return (
    <div 
      className="relative" 
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {open && <div className="absolute top-full left-0 w-full h-3 bg-transparent z-40" />}

      <button
        onClick={() => setOpen(!open)}
        className="text-sm text-[#FAFAF7]/70 hover:text-[#FAFAF7] transition font-medium flex items-center gap-1.5 h-full"
        aria-label="Language selection"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        EN
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 -translate-x-1/2 mt-3 w-32 bg-[#FAFAF7] rounded-2xl shadow-xl border border-[#132600]/10 overflow-hidden z-50 py-1"
          >
            <button
              onClick={() => setOpen(false)}
              className="w-full text-left px-4 py-2.5 text-sm text-[#132600] font-semibold hover:bg-[#132600]/5 transition flex items-center justify-between"
            >
              English
              <div className="w-1.5 h-1.5 rounded-full bg-[#C9963E]"></div>
            </button>
            <button
              onClick={() => setOpen(false)}
              className="w-full text-left px-4 py-2.5 text-sm text-[#132600]/60 hover:text-[#132600] hover:bg-[#132600]/5 transition"
            >
              Italiano
            </button>
            <button
              onClick={() => setOpen(false)}
              className="w-full text-left px-4 py-2.5 text-sm text-[#132600]/60 hover:text-[#132600] hover:bg-[#132600]/5 transition"
            >
              Türkçe
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function UserDropdown({ user, setUser }) {
  const router = useRouter()
  const { open, setOpen, ref, handleMouseEnter, handleMouseLeave } = useDropdown()

  const handleLogout = async () => {
    setUser(null)
    setOpen(false)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div 
      className="relative" 
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {open && <div className="absolute top-full right-0 w-full h-3 bg-transparent z-40" />}

      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-full bg-[#132600] border-2 border-[#FAFAF7]/20 hover:border-[#C9963E] transition flex items-center justify-center shrink-0"
        aria-label="User menu"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FAFAF7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-52 bg-[#FAFAF7] rounded-2xl shadow-xl border border-[#132600]/10 overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-[#132600]/8">
              <p className="text-xs font-semibold text-[#132600] truncate">
                {user?.user_metadata?.full_name || 'My Account'}
              </p>
              <p className="text-xs text-[#132600]/40 truncate mt-0.5">
                {user?.email}
              </p>
            </div>

            <div className="py-1">
              <button
                onClick={() => { setOpen(false); router.push('/profile') }}
                className="w-full text-left px-4 py-2.5 text-sm text-[#132600] hover:bg-[#132600]/5 transition flex items-center gap-2.5"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#132600" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                My Profile
              </button>

              <button
                onClick={() => { setOpen(false); router.push('/listings/my') }}
                className="w-full text-left px-4 py-2.5 text-sm text-[#132600] hover:bg-[#132600]/5 transition flex items-center gap-2.5"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#132600" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
                  <rect x="9" y="3" width="6" height="4" rx="1"/>
                  <line x1="9" y1="12" x2="15" y2="12"/>
                  <line x1="9" y1="16" x2="13" y2="16"/>
                </svg>
                My Listings
              </button>

              <button
                onClick={() => { setOpen(false); router.push('/listings/create') }}
                className="w-full text-left px-4 py-2.5 text-sm text-[#132600] hover:bg-[#132600]/5 transition flex items-center gap-2.5"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#132600" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Post a Service
              </button>
            </div>

            <div className="border-t border-[#132600]/8 py-1">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-50 transition flex items-center gap-2.5"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Log out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Header({ user: initialUser = null }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState(initialUser)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { scrollY } = useScroll()

  const isHome = pathname === '/'

  const clampedScroll = useTransform(scrollY, (value) => Math.max(0, value))
  const animatedHeight = useTransform(clampedScroll, [0, 80], [110, 68])
  const animatedLogo = useTransform(clampedScroll, [0, 80], [64, 36])
  const animatedTitle = useTransform(clampedScroll, [0, 80], [38, 25])

  const searchOpacity = useTransform(clampedScroll, [250, 350], [0, 1])
  const searchY = useTransform(clampedScroll, [250, 350], [10, 0])
  const searchPointerEvents = useTransform(clampedScroll, [0, 349, 350], ["none", "none", "auto"])

  useEffect(() => {
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (mobileOpen) setMobileOpen(false)
  }, [router])

  return (
    <>
      <motion.header
        style={{ height: isHome ? animatedHeight : 68 }}
        className="bg-[#132600] sticky top-0 z-50 w-full"
      >
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between gap-4">

          <Link href="/" className="flex items-center gap-3 shrink-0">
            <motion.div 
              style={{ 
                width: isHome ? animatedLogo : 36, 
                height: isHome ? animatedLogo : 36 
              }}
            >
              <ToretBull className="w-full h-full text-[#FAFAF7]" />
            </motion.div>
            <motion.span
              style={{ 
                fontSize: isHome ? animatedTitle : 25, 
                fontFamily: 'var(--font-cormorant), serif' 
              }}
              className="font-bold text-[#FAFAF7] leading-none"
            >
              Toro
            </motion.span>
          </Link>

          {isHome && (
            <motion.div 
              style={{ opacity: searchOpacity, y: searchY, pointerEvents: searchPointerEvents }}
              className="flex-1 max-w-sm hidden md:flex items-center bg-[#FAFAF7]/10 backdrop-blur-md border border-[#FAFAF7]/20 rounded-full p-1 transition-all hover:bg-[#FAFAF7]/20 mx-auto"
            >
              <input 
                type="text" 
                placeholder="What are you looking for?" 
                className="flex-1 bg-transparent outline-none text-[#FAFAF7] placeholder:text-[#FAFAF7]/60 text-sm py-1.5 px-4 font-medium"
              />
              <button className="bg-[#132600] hover:bg-[#1f3d00] text-[#C9963E] rounded-full p-2 transition-all shadow-md active:scale-95 shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </motion.div>
          )}

          <div className="hidden md:flex items-center gap-5 shrink-0">
            <Link href="/listings" className="text-sm text-[#FAFAF7]/70 hover:text-[#FAFAF7] transition font-medium whitespace-nowrap">
              Find Services
            </Link>
            <button
              onClick={() => router.push(user ? '/listings/create' : '/login')}
              className="text-sm text-[#FAFAF7]/70 hover:text-[#FAFAF7] transition font-medium whitespace-nowrap"
            >
              Offer Skills
            </button>

            <div className="w-px h-4 bg-[#FAFAF7]/15 mx-0.5" />

            <LanguageDropdown />

            <div className="w-px h-4 bg-[#FAFAF7]/15 mx-0.5" />

            {user ? (
              <UserDropdown user={user} setUser={setUser} />
            ) : (
              <div className="flex items-center gap-5">
                <button
                  onClick={() => router.push('/login')}
                  className="text-sm text-[#FAFAF7]/70 hover:text-[#FAFAF7] transition font-medium"
                >
                  Log in
                </button>
                <button
                  onClick={() => router.push('/login?mode=signup')}
                  className="bg-[#C9963E] text-[#FAFAF7] text-sm px-5 py-2 rounded-full font-semibold hover:bg-[#b8852d] transition whitespace-nowrap shadow-sm"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>

          <div className="flex md:hidden items-center gap-3">
            {user && <UserDropdown user={user} setUser={setUser} />}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex flex-col gap-1.5 p-2"
              aria-label="Toggle menu"
            >
              <motion.span animate={mobileOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className="block w-6 h-0.5 bg-[#FAFAF7] origin-center"/>
              <motion.span animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }} className="block w-6 h-0.5 bg-[#FAFAF7]"/>
              <motion.span animate={mobileOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className="block w-6 h-0.5 bg-[#FAFAF7] origin-center"/>
            </button>
          </div>

        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[68px] left-0 right-0 z-40 bg-[#132600] border-t border-[#FAFAF7]/10 px-6 py-6 flex flex-col gap-4 md:hidden"
          >
            <div className="flex items-center gap-4 pb-4 mb-2 border-b border-[#FAFAF7]/10">
              <span className="text-xs text-[#FAFAF7]/40 uppercase tracking-wider font-semibold">Language</span>
              <div className="flex gap-3">
                <button className="text-sm text-[#C9963E] font-bold">EN</button>
                <button className="text-sm text-[#FAFAF7]/50 hover:text-[#FAFAF7] font-medium transition">IT</button>
                <button className="text-sm text-[#FAFAF7]/50 hover:text-[#FAFAF7] font-medium transition">TR</button>
              </div>
            </div>

            <Link href="/listings" onClick={() => setMobileOpen(false)} className="text-base text-[#FAFAF7]/70 hover:text-[#FAFAF7] transition font-medium py-2">
              Find Services
            </Link>
            <button
              onClick={() => { setMobileOpen(false); router.push(user ? '/listings/create' : '/login') }}
              className="text-left text-base text-[#FAFAF7]/70 hover:text-[#FAFAF7] transition font-medium py-2"
            >
              Offer Skills
            </button>
            {!user && (
              <div className="pt-4 border-t border-[#FAFAF7]/10 mt-2 flex flex-col gap-3">
                <button
                  onClick={() => { setMobileOpen(false); router.push('/login') }}
                  className="w-full bg-[#C9963E] text-[#FAFAF7] py-3.5 rounded-full font-semibold hover:bg-[#b8852d] transition"
                >
                  Join Toro
                </button>
                <button
                   onClick={() => { setMobileOpen(false); router.push('/login') }}
                   className="w-full text-center text-sm text-[#FAFAF7]/50 py-2"
                >
                  Already have an account? Log in
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}