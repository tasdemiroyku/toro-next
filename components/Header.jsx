'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation' // usePathname EKLENDİ
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'

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

function ToretBull({ className = "" }) {
  return (
    <svg viewBox="0 0 454 432" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M34.332 8.934c2.292 1.118 7.993 5.246 12.668 9.174 21.418 17.995 42.806 27.996 63.277 29.588 7.59.59 7.884.527 12.261-2.616C142.581 30.687 185.101 23.097 239 24.291c41.102.911 69.013 5.753 88.096 15.285 3.628 1.812 8.044 4.513 9.814 6.002 3.096 2.604 3.528 2.683 11.404 2.074 20.502-1.585 43.187-12.198 63.186-29.56C419.658 11.01 428.497 6 432.834 6c4.181 0 7.924 3.596 9.016 8.663 1.043 4.836-.634 10.734-6.825 23.995-13.515 28.949-39.181 54.054-66.78 65.321-19.655 8.025-25.098 12.268-27.842 21.705-2.431 8.363-1.256 14.296 3.606 18.203 5.245 4.215 5.579 5.985 2.559 13.535-3.08 7.7-3.21 11.802-.607 19.209 1.079 3.069 2.464 10.142 3.077 15.718 2.047 18.6-.407 32.958-10.675 62.456a11228 11228 0 0 0-12.995 37.559c-6.478 18.879-8.244 22.537-13.239 27.427-3.5 3.426-3.879 4.362-4.971 12.274-1.126 8.167-.79 15.794 1.455 33.002.864 6.617-1.878 16.332-6.471 22.933-8.048 11.566-24.698 21.616-48.2 29.094-12.877 4.097-12.917 4.103-26.169 3.713-12.412-.365-14.059-.658-25.385-4.518-14.579-4.969-25.734-10.442-34.096-16.728-7.425-5.583-11.388-10.383-15.046-18.225-2.533-5.429-2.69-6.533-2.258-15.836.256-5.5.475-17.349.488-26.331l.024-16.33-2.769-2.017c-5.009-3.648-9.001-10.953-13.801-25.256-2.597-7.736-7.946-23.024-11.887-33.972-8.618-23.944-11.793-35.421-12.588-45.516-.328-4.168-.771-8.928-.984-10.578-.647-5.018 1.478-22.08 3.564-28.609 2.637-8.256 2.476-13.003-.683-20.042-3.129-6.971-2.49-9.655 3.075-12.939 3.044-1.795 3.522-2.652 4.111-7.364 1.611-12.897-5.004-22.685-19.281-28.529-14.481-5.927-20.739-9.133-30.453-15.599C48.71 78.377 31.56 57.336 20.931 32.459c-4.843-11.336-5.467-14.304-3.966-18.854 2.52-7.635 8.173-9.155 17.367-4.671Z" fill="none" stroke="#FAFAF7" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round"/>
      <path d="M129 197.395c0 5.095 3.55 15.583 7.078 20.909 4.544 6.861 12.293 13.266 21.458 17.739 9.957 4.858 13.606 5.696 15.399 3.535 3.711-4.471-2.422-14.689-15.312-25.513-8.772-7.366-26.336-20.065-27.752-20.065-.479 0-.871 1.528-.871 3.395" fill="none" stroke="#FAFAF7" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round"/>
      <path d="M325 197.194c-27.911 19.256-41.059 33.169-38.377 40.607 1.384 3.837 5.683 3.365 16.024-1.759 16.142-7.998 26.777-21.599 28.074-35.9.306-3.378.157-6.122-.332-6.097s-2.914 1.441-5.389 3.149" fill="none" stroke="#FAFAF7" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round"/>
      <path d="M188.942 366.948c-4.641 1.408-6.652 2.937-7.934 6.032-2.016 4.868.939 11.394 6.862 15.159 4.204 2.671 14.792 6.538 15.617 5.704.186-.189-.822-3.043-2.241-6.343-1.992-4.632-2.599-7.766-2.663-13.747l-.083-7.748-3.5.084c-1.925.045-4.651.432-6.058.859Z" fill="none" stroke="#FAFAF7" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round"/>
      <path d="M261.834 370.052c.47 4.931-1.211 13.328-3.944 19.704l-1.887 4.402 3.249-.677c5.788-1.206 14.77-5.719 17.25-8.666 2.927-3.478 4.143-9.105 2.667-12.343-1.442-3.164-6.239-5.521-12.569-6.174l-5.175-.534Z" fill="none" stroke="#FAFAF7" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  )
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
    window.location.href = '/'
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
  const animatedHeight = useTransform(clampedScroll, [0, 80], [130, 68])
  const animatedLogo = useTransform(clampedScroll, [0, 80], [86, 36])
  const animatedTitle = useTransform(clampedScroll, [0, 80], [52, 22])

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
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">

          <Link href="/" className="flex items-center gap-3 shrink-0">
            <motion.div 
              style={{ 
                width: isHome ? animatedLogo : 36, 
                height: isHome ? animatedLogo : 36 
              }}
            >
              <ToretBull className="w-full h-full" />
            </motion.div>
            <motion.span
              style={{ 
                fontSize: isHome ? animatedTitle : 22, 
                fontFamily: 'var(--font-cormorant), serif' 
              }}
              className="font-bold text-[#FAFAF7] leading-none"
            >
              Toro
            </motion.span>
          </Link>

          {/* Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/listings" className="text-sm text-[#FAFAF7]/70 hover:text-[#FAFAF7] transition font-medium whitespace-nowrap">
              Find Services
            </Link>
            <button
              onClick={() => router.push(user ? '/listings/create' : '/login')}
              className="text-sm text-[#FAFAF7]/70 hover:text-[#FAFAF7] transition font-medium whitespace-nowrap"
            >
              Offer Skills
            </button>

            <LanguageDropdown />

            {user ? (
              <UserDropdown user={user} setUser={setUser} />
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="bg-[#C9963E] text-[#FAFAF7] text-sm px-5 py-2 rounded-full font-semibold hover:bg-[#b8852d] transition whitespace-nowrap"
              >
                Join Toro
              </button>
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

      {/* Mobile Menu */}
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
              <div className="pt-2 border-t border-[#FAFAF7]/10 mt-2">
                <button
                  onClick={() => { setMobileOpen(false); router.push('/login') }}
                  className="w-full bg-[#C9963E] text-[#FAFAF7] py-3 rounded-full font-semibold hover:bg-[#b8852d] transition"
                >
                  Join Toro
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}