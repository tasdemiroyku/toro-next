'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import ToretBull from '@/components/ToretBull'
import { useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const modeFromUrl = searchParams.get('mode')
  const [mode, setMode] = useState(modeFromUrl === 'signup' ? 'signup' : 'login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleGoogle = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  const handleSubmit = async () => {
    if (!email || !password) return
    setLoading(true)
    setMessage('')

    const supabase = createClient()

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      })
      if (error) setMessage(error.message)
      else setMessage('Check your email to confirm your account.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMessage(error.message)
      } else {
        router.push('/')
        router.refresh()
      }
    }

    setLoading(false)
  }

  return (
    <div className="relative min-h-[calc(100vh-68px)] flex items-center justify-center px-4 py-12 font-sans overflow-hidden">

      {/* Background */}
      <img
        src="/torino.jpeg"
        alt="Torino"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-[#132600]/60 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative z-10 bg-[#FAFAF7] rounded-[2rem] p-8 w-full max-w-[420px] flex flex-col gap-6 shadow-2xl">

        {/* Logo + Title */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 bg-[#132600] rounded-2xl flex items-center justify-center p-2">
            <ToretBull className="w-full h-full text-[#FAFAF7]" />
          </div>
          <h1
            className="text-3xl font-bold text-[#132600]"
            style={{ fontFamily: 'var(--font-cormorant), serif' }}
          >
            {mode === 'login' ? 'Welcome back.' : 'Join Toro.'}
          </h1>
          <p className="text-sm text-[#132600]/50 text-center">
            {mode === 'login'
              ? 'Log in to find or offer services in Torino.'
              : 'Create your account — it\'s free.'}
          </p>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          className="flex items-center justify-center gap-3 border border-[#132600]/15 rounded-full py-3 px-6 text-sm font-medium text-[#132600] hover:bg-[#132600]/5 transition"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#132600]/10" />
          <span className="text-xs text-[#132600]/30">or</span>
          <div className="flex-1 h-px bg-[#132600]/10" />
        </div>

        {/* Form */}
        <div className="flex flex-col gap-3">
          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="border border-[#132600]/15 rounded-full px-5 py-3 text-sm text-[#132600] focus:outline-none focus:border-[#C9963E] transition bg-white"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            className="border border-[#132600]/15 rounded-full px-5 py-3 text-sm text-[#132600] focus:outline-none focus:border-[#C9963E] transition bg-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            className="border border-[#132600]/15 rounded-full px-5 py-3 text-sm text-[#132600] focus:outline-none focus:border-[#C9963E] transition bg-white"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-[#132600] text-[#FAFAF7] rounded-full py-3 text-sm font-semibold hover:bg-[#1f3d00] transition disabled:opacity-60"
        >
          {loading ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Create account'}
        </button>

        {/* Message */}
        {message && (
          <p className="text-xs text-center text-[#132600]/60">{message}</p>
        )}

        {/* Toggle */}
        <p className="text-xs text-center text-[#132600]/40">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage('') }}
            className="text-[#C9963E] font-semibold"
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>

      </div>
    </div>
  )
}