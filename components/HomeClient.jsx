'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import ToretBull from './ToretBull'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } }
}

export default function HomeClient({ listings }) {
  const router = useRouter()
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
    <div className="bg-[#FAFAF7] font-sans">
      
      {/* Hero */}
      <section className="relative h-[650px] flex items-center overflow-hidden">
        <img
          src="/torino.jpeg"
          alt="Torino"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#132600]/65 backdrop-blur-[2px]" />
        
        <motion.div
          className="relative z-10 w-full max-w-3xl mx-auto px-8 flex flex-col items-center mt-12"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {/* Title */}
          <motion.div variants={fadeUp} className="text-center mb-10 flex flex-col gap-4">
            <h1 
              className="text-4xl md:text-6xl font-bold text-[#FAFAF7] tracking-tight leading-tight"
              style={{ fontFamily: 'var(--font-cormorant), serif' }}
            >
              Torino's Student Marketplace
            </h1>
            <p className="text-lg text-white/80 font-medium max-w-xl mx-auto">
              Find trusted peers for tutoring, cleaning, or bureaucratic help.
            </p>
          </motion.div>

          {/* Merkez Arama Çubuğu */}
          <motion.div variants={fadeUp} className="w-full flex items-center bg-white/30 backdrop-blur-md rounded-full shadow-2xl p-2 border border-white/30 hover:bg-white/40 transition-all">
            <input
              type="text"
              autoFocus
              placeholder="What are you looking for?"
              className="flex-1 bg-transparent outline-none text-white placeholder:text-white/80 text-lg py-4 px-8 font-medium"
            />
            <button className="bg-[#132600] hover:bg-[#1f3d00] text-[#C9963E] rounded-full p-4 transition-all shadow-xl active:scale-95">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Active Listings Showcase */}
      <motion.section
        className="px-8 py-24 max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={stagger}
      >
        <div className="flex justify-between items-end mb-12">
          <motion.h2 variants={fadeUp} className="text-3xl font-bold text-[#132600]" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
            Latest Services
          </motion.h2>
          <motion.button 
            variants={fadeUp} 
            className="text-[#C9963E] font-bold hover:underline text-sm uppercase tracking-widest"
            onClick={() => router.push('/listings')}
          >
            View All &rarr;
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {listings?.length > 0 ? (
            listings.map((item) => (
              <motion.div
                key={item.id}
                variants={fadeUp}
                className="flex flex-col bg-white border border-[#132600]/5 rounded-[2rem] overflow-hidden hover:border-[#C9963E]/30 hover:shadow-2xl transition-all duration-300 cursor-pointer group p-2"
                onClick={() => router.push(`/listings/${item.id}`)}
              >
                <div className="h-32 bg-[#132600]/5 rounded-[1.5rem] relative flex items-center justify-center group-hover:bg-[#132600]/10 transition-colors">
                  <div className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded-full text-[13px] font-black text-[#132600] shadow-sm">
                    €{item.price}<span className="text-[10px] opacity-40 ml-0.5">/{item.price_type === 'hour' ? 'hr' : 'job'}</span>
                  </div>
                  <ToretBull className="w-12 h-12 text-[#132600] opacity-5" />
                </div>
                
                <div className="p-4 flex flex-col gap-3">
                  <h3 className="text-[#132600] text-lg font-bold leading-tight group-hover:text-[#C9963E] transition-colors line-clamp-2 min-h-[50px]">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center justify-between mt-2 pt-4 border-t border-[#132600]/5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#132600]/5 flex items-center justify-center overflow-hidden border border-[#132600]/10">
                        {item.profiles?.avatar_url ? (
                          <img src={item.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] font-bold text-[#132600]/30">{item.profiles?.full_name?.[0] || 'T'}</span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#132600]/50 font-bold uppercase tracking-tight truncate max-w-[100px]">
                        {item.profiles?.full_name || 'Torino Student'}
                      </span>
                    </div>
                    {item.location && (
                      <span className="text-[10px] text-[#C9963E] font-bold bg-[#C9963E]/5 px-2 py-0.5 rounded-md truncate max-w-[80px]">
                        {item.location}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full">
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-center py-20 px-6 flex flex-col items-center gap-6 border border-[#132600]/10 rounded-[3rem] bg-transparent"
              >
                <div className="w-16 h-16 text-[#132600]/15">
                  <ToretBull className="w-full h-full" />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <p className="text-[#132600] text-lg font-bold">No services here yet</p>
                  <p className="text-[#132600]/40 text-sm max-w-xs mx-auto font-medium">
                    Be the first to offer help to the student community in Torino.
                  </p>
                </div>

                <button
                  onClick={() => router.push('/listings/create')}
                  className="bg-[#132600] text-[#FAFAF7] px-8 py-3 rounded-full text-sm font-bold hover:bg-[#1f3d00] transition shadow-lg"
                >
                  Post a service
                </button>
              </motion.div>
            </div>
          )}
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
              { title: 'Built for newcomers', desc: 'Multilingual platform. Whether you speak Italian, English or Turkish — Toro works for you.' },
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
    </div>
  )
}