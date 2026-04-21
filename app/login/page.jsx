'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Header from '@/components/Header'

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

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState('login')
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
    <div className="min-h-screen font-sans">
      <Header />

      <div className="relative min-h-[calc(100vh-68px)] flex items-center justify-center px-4 py-12">

        {/* Background */}
        <img
          src="/torino.jpeg"
          alt="Torino"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#132600]/80 backdrop-blur-sm" />

        {/* Card */}
        <div className="relative z-10 bg-[#FAFAF7] rounded-[2rem] p-8 w-full max-w-[420px] flex flex-col gap-6 shadow-2xl">

          {/* Logo + Title */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-[#132600] rounded-2xl flex items-center justify-center p-2">
              <ToretBull className="w-full h-full" />
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
    </div>
  )
}