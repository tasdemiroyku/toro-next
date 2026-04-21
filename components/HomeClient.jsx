'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } }
}

const categories = [
  {
    label: 'Tutoring',
    desc: 'Uni subjects, language, exam prep',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#132600" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    )
  },
  {
    label: 'Cleaning',
    desc: 'Home, studio, end of tenancy',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#132600" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    )
  },
  {
    label: 'Consular Docs',
    desc: 'Permits, translations, bureaucracy',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#132600" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    )
  },
  {
    label: 'Elderly Care',
    desc: 'Companionship, errands, support',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#132600" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    )
  },
]

export default function HomeClient({ user }) {
  const router = useRouter()
  const { scrollY } = useScroll()
  const headerHeight = useTransform(scrollY, [0, 140], [140, 68])
  const logoSize = useTransform(scrollY, [0, 140], [90, 40])
  const titleSize = useTransform(scrollY, [0, 140], [58, 26])

  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  const handleSignup = async () => {
    if (!email || !email.includes('@')) return
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] font-sans">
      <Header shrink={true} user={user} />

      {/* Hero */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <img
          src="/torino.jpeg"
          alt="Torino"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#132600]/65" />
        <motion.div
          className="relative z-10 max-w-6xl mx-auto px-8 flex flex-col gap-6"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.span variants={fadeUp} className="text-xs font-semibold tracking-widest uppercase text-[#C9963E]">
            Il marketplace degli studenti di Torino
          </motion.span>
          <motion.h1 variants={fadeUp} className="text-5xl font-bold text-[#FAFAF7] max-w-2xl leading-tight">
            Skills, services and help — by students, for Torino.
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-[#FAFAF7]/70 max-w-xl">
            Find trusted students for tutoring, cleaning, bureaucracy help and more.
            Or offer your own skills and start earning — no experience needed.
          </motion.p>
          <motion.div variants={fadeUp} className="flex gap-4 mt-2">
            <button
              onClick={() => router.push('/listings')}
              className="bg-[#C9963E] text-[#FAFAF7] px-6 py-3 rounded-full font-semibold hover:bg-[#b8852d] transition"
            >
              Find a Service
            </button>
            <button
              onClick={() => user ? router.push('/listings/create') : router.push('/login')}
              className="border border-[#FAFAF7]/50 text-[#FAFAF7] px-6 py-3 rounded-full font-semibold hover:bg-[#FAFAF7]/10 transition"
            >
              Offer Your Skills
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Categories */}
      <motion.section
        className="px-8 py-20 max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
      >
        <motion.h2 variants={fadeUp} className="text-2xl font-bold text-[#132600] mb-10">
          What you can find on Toro
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <motion.div
              key={cat.label}
              variants={fadeUp}
              className="flex flex-col gap-3 bg-white border border-[#132600]/10 rounded-2xl py-8 px-5 hover:border-[#C9963E] hover:shadow-sm transition cursor-pointer"
              onClick={() => router.push('/listings')}
            >
              <div className="w-10 h-10 rounded-xl bg-[#132600]/5 flex items-center justify-center">
                {cat.icon}
              </div>
              <span className="text-sm font-bold text-[#132600]">{cat.label}</span>
              <span className="text-xs text-[#132600]/50">{cat.desc}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Why Toro */}
      <motion.section
        className="bg-[#132600] py-24 px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 variants={fadeUp} className="text-2xl font-bold text-[#FAFAF7] mb-12">
            Why Toro is different
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Student verified', desc: 'Every listing is linked to a real university email from UniTO or Politecnico. No anonymity, just trust.' },
              { title: 'Built for newcomers', desc: 'Multilingual platform. Whether you speak Italian, English, Turkish or Arabic — Toro works for you.' },
              { title: 'Your first step', desc: 'Never worked before? No problem. Toro is designed to help students take their first professional step with confidence.' },
            ].map((item) => (
              <motion.div key={item.title} variants={fadeUp} className="flex flex-col gap-3">
                <div className="w-8 h-1 bg-[#C9963E] rounded-full" />
                <h3 className="text-lg font-bold text-[#FAFAF7]">{item.title}</h3>
                <p className="text-sm text-[#FAFAF7]/60 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Email Signup */}
      <motion.section
        className="px-8 py-24 max-w-6xl mx-auto flex flex-col items-center text-center gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
      >
        <motion.h2
          variants={fadeUp}
          className="text-3xl font-bold text-[#132600]"
          style={{ fontFamily: 'var(--font-cormorant), serif' }}
        >
          Be the first in Torino
        </motion.h2>
        <motion.p variants={fadeUp} className="text-[#132600]/60 max-w-md">
          We are launching soon. Sign up to get early access and be notified the moment Toro goes live.
        </motion.p>
        <motion.div variants={fadeUp} className="flex flex-col gap-3 w-full max-w-md">
          <div className="flex gap-3">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSignup()}
              className="flex-1 border border-[#132600]/20 rounded-full px-5 py-3 text-sm text-[#132600] bg-white focus:outline-none focus:border-[#C9963E] transition"
            />
            <button
              onClick={handleSignup}
              disabled={status === 'loading'}
              className="bg-[#C9963E] text-[#FAFAF7] px-6 py-3 rounded-full font-semibold hover:bg-[#b8852d] transition text-sm whitespace-nowrap disabled:opacity-60"
            >
              {status === 'loading' ? 'Saving...' : 'Notify me'}
            </button>
          </div>
          {status === 'success' && (
            <p className="text-sm text-[#132600] font-medium">You're in — check your email.</p>
          )}
          {status === 'error' && (
            <p className="text-sm text-red-500">Something went wrong. Try again.</p>
          )}
        </motion.div>
      </motion.section>

      <Footer />
    </div>
  )
}