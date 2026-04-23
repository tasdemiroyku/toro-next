'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import ToretBull from '@/components/ToretBull'

// ─── Constants ───────────────────────────────────────────────────────────────

const STUDENT_DOMAINS = [
  'studenti.polito.it', 'edu.unito.it', 'studenti.unimi.it',
  'studio.unibo.it', 'studenti.uniroma1.it', 'edu', 'ac.uk',
  'student.kuleuven.be', 'etu.u-paris.fr',
]

const LANGUAGE_OPTIONS = [
  'Italian', 'English', 'Turkish', 'French', 'Spanish',
  'German', 'Arabic', 'Chinese', 'Portuguese', 'Russian',
  'Japanese', 'Korean', 'Hindi', 'Dutch', 'Polish',
]

const UNIVERSITIES = [
  { group: 'Turin', options: ['Politecnico di Torino', 'Università di Torino'] },
  { group: 'Northern Italy', options: ['Università di Milano', 'Politecnico di Milano', 'Università di Bologna', 'Università di Padova', 'Università di Pavia', 'Università di Genova', 'Università di Trieste'] },
  { group: 'Central Italy', options: ['Sapienza – Università di Roma', 'Università di Roma Tre', 'Università di Firenze', 'Università di Pisa', 'Università di Perugia'] },
  { group: 'Southern Italy', options: ['Università di Napoli Federico II', 'Università di Bari', 'Università di Palermo', 'Università di Catania'] },
  { group: 'Other', options: ['Other university', 'Not a student'] },
]

const NAV_ITEMS = [
  {
    id: 'personal',
    label: 'Personal Info',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    id: 'academic',
    label: 'Academic Info',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
  },
  {
    id: 'security',
    label: 'Security',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isVerifiedStudent(email) {
  if (!email) return false
  const domain = email.split('@')[1] ?? ''
  return STUDENT_DOMAINS.some(d => domain.endsWith(d))
}

function memberSince(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs"
      style={{ background: '#dcfce7', color: '#15803d' }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5"/>
      </svg>
      Verified Student
    </span>
  )
}

function Field({ label, children, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-[#132600]/50 tracking-wide">{label}</label>
      {children}
      {hint && <p className="text-xs text-[#132600]/30">{hint}</p>}
    </div>
  )
}

const inputClass =
  'w-full bg-white border border-[#132600]/10 rounded-xl px-4 py-3 text-sm text-[#132600] focus:outline-none focus:border-[#C9963E]/60 focus:ring-2 focus:ring-[#C9963E]/10 transition placeholder:text-[#132600]/25'

function LanguageTagSelector({ selected, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggle = lang => {
    onChange(selected.includes(lang)
      ? selected.filter(l => l !== lang)
      : [...selected, lang])
  }

  return (
    <div className="flex flex-col gap-2" ref={ref}>
      {/* Selected tags */}
      <div className="flex flex-wrap gap-1.5 min-h-[2.5rem]">
        <AnimatePresence>
          {selected.map(lang => (
            <motion.span
              key={lang}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.15 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs"
              style={{ background: '#132600', color: '#FAFAF7' }}
            >
              {lang}
              <button
                onClick={() => toggle(lang)}
                className="opacity-60 hover:opacity-100 transition ml-0.5"
                aria-label={`Remove ${lang}`}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        <button
          onClick={() => setOpen(o => !o)}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs border border-dashed border-[#132600]/20 text-[#132600]/40 hover:border-[#C9963E]/60 hover:text-[#C9963E] transition"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add
        </button>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="bg-white border border-[#132600]/10 rounded-2xl p-3 shadow-xl flex flex-wrap gap-1.5 z-20"
          >
            {LANGUAGE_OPTIONS.map(lang => (
              <button
                key={lang}
                onClick={() => toggle(lang)}
                className={`px-3 py-1 rounded-full text-xs transition ${
                  selected.includes(lang)
                    ? 'text-[#FAFAF7]'
                    : 'text-[#132600]/60 hover:text-[#132600] border border-[#132600]/10 hover:border-[#132600]/30'
                }`}
                style={selected.includes(lang) ? { background: '#132600' } : {}}
              >
                {lang}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Toast({ message, type = 'success' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full text-sm shadow-lg"
      style={{
        background: type === 'error' ? '#fee2e2' : '#dcfce7',
        color: type === 'error' ? '#dc2626' : '#15803d',
        border: `1px solid ${type === 'error' ? '#fca5a5' : '#86efac'}`,
      }}
    >
      {message}
    </motion.div>
  )
}

// ─── Section: Personal Info ──────────────────────────────────────────────────

function PersonalSection({ user, profile, setProfile }) {
  const update = (field, value) => setProfile(prev => ({ ...prev, [field]: value }))
  const supabase = createClient()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name:    profile.full_name,
        bio:          profile.bio,
        languages:    profile.languages,
        phone_number: profile.phone_number,
        skills:       profile.skills,
      })
      .eq('id', user.id)

    showToast(error ? 'Something went wrong.' : 'Profile saved.', error ? 'error' : 'success')
    setSaving(false)
  }

  const handleDelete = async () => {
    await supabase.from('profiles').delete().eq('id', user.id)
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Full name">
          <input
            type="text"
            value={profile?.full_name || ''}
            onChange={e => update('full_name', e.target.value)}
            placeholder="Name and surname"
            className={inputClass}
          />
        </Field>
        <Field label="Phone number">
          <input
            type="tel"
            value={profile?.phone_number || ''}
            onChange={e => update('phone_number', e.target.value)}
            placeholder="+39 XXX XXX XXXX"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Bio" hint="Shown on your public profile and listings.">
        <textarea
          value={profile?.bio || ''}
          onChange={e => update('bio', e.target.value)}
          rows={3}
          maxLength={300}
          placeholder="Tell other students what you can offer or what you're looking for..."
          className={`${inputClass} resize-none`}
        />
        <p className="text-xs text-[#132600]/25 text-right -mt-1">
          {(profile?.bio || '').length}/300
        </p>
      </Field>

      <Field label="Languages">
        <LanguageTagSelector
          selected={profile?.languages || []}
          onChange={langs => update('languages', langs)}
        />
      </Field>

      <Field
        label="Skills & specialities"
        hint='Comma-separated — e.g. "MATLAB, Figma, French cooking"'
      >
        <input
          type="text"
          value={profile?.skills || ''}
          onChange={e => update('skills', e.target.value)}
          placeholder="Python, Academic writing, Music theory..."
          className={inputClass}
        />
      </Field>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 sm:flex-none sm:min-w-[160px] bg-[#132600] text-[#FAFAF7] rounded-full px-6 py-3 text-sm transition hover:bg-[#1f3d00] active:scale-95 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="text-xs text-red-400 hover:text-red-600 transition px-4"
        >
          Delete account
        </button>
      </div>

      <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>

      {/* Delete modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#132600]/50 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FAFAF7] rounded-3xl p-8 max-w-sm w-full flex flex-col gap-6 shadow-2xl"
            >
              <div className="flex flex-col gap-2 text-center">
                <h2 className="text-xl text-[#132600]">Delete account?</h2>
                <p className="text-sm text-[#132600]/50 leading-relaxed">
                  This is permanent. All your listings and messages will be removed.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleDelete}
                  className="w-full bg-red-500 text-white rounded-full py-3 text-sm hover:bg-red-600 transition"
                >
                  Yes, delete everything
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full border border-[#132600]/10 text-[#132600] rounded-full py-3 text-sm hover:bg-[#132600]/5 transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Section: Academic Info ──────────────────────────────────────────────────

function AcademicSection({ user, profile, setProfile }) {
  const update = (field, value) => setProfile(prev => ({ ...prev, [field]: value }))
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({ university: profile.university, department: profile.department })
      .eq('id', user.id)
    showToast(error ? 'Something went wrong.' : 'Academic info saved.', error ? 'error' : 'success')
    setSaving(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="University">
          <select
            value={profile?.university || ''}
            onChange={e => update('university', e.target.value)}
            className={`${inputClass} appearance-none cursor-pointer`}
          >
            <option value="">Select university</option>
            {UNIVERSITIES.map(({ group, options }) => (
              <optgroup key={group} label={group}>
                {options.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </Field>
        <Field label="Department / Faculty">
          <input
            type="text"
            value={profile?.department || ''}
            onChange={e => update('department', e.target.value)}
            placeholder="e.g. Computer Engineering"
            className={inputClass}
          />
        </Field>
      </div>

      {/* Email domain verification hint */}
      <div
        className="rounded-2xl p-4 text-sm"
        style={{
          background: isVerifiedStudent(user?.email) ? '#f0fdf4' : '#fafaf7',
          border: `1px solid ${isVerifiedStudent(user?.email) ? '#86efac' : '#132600'}18`,
        }}
      >
        {isVerifiedStudent(user?.email) ? (
          <div className="flex items-center gap-2 text-[#15803d]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
            Your email <span className="font-medium">{user?.email}</span> is automatically verified as a student address.
          </div>
        ) : (
          <div className="flex items-start gap-2 text-[#132600]/50">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>
              Sign up with your university email (e.g. <em>@studenti.polito.it</em>) to receive a Verified Student badge and build trust with other users.
            </span>
          </div>
        )}
      </div>

      <div className="pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#132600] text-[#FAFAF7] rounded-full px-6 py-3 text-sm transition hover:bg-[#1f3d00] active:scale-95 disabled:opacity-50 min-w-[160px]"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>

      <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>
    </div>
  )
}

// ─── Section: Security ───────────────────────────────────────────────────────

function SecuritySection({ user }) {
  const supabase = createClient()
  const [emailForm, setEmailForm] = useState({ email: '', confirm: '' })
  const [passwordForm, setPasswordForm] = useState({ password: '', confirm: '' })
  const [emailLoading, setEmailLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const handleEmailUpdate = async () => {
    if (!emailForm.email) return showToast('Enter a new email.', 'error')
    if (emailForm.email !== emailForm.confirm) return showToast("Emails don't match.", 'error')
    
    setEmailLoading(true)
    const { error } = await supabase.auth.updateUser({ email: emailForm.email })
    showToast(
      error ? error.message : 'Confirmation sent — check both inboxes.',
      error ? 'error' : 'success'
    )
    if (!error) setEmailForm({ email: '', confirm: '' })
    setEmailLoading(false)
  }

  const handlePasswordUpdate = async () => {
      if (passwordForm.password.length < 8) return showToast('Password must be at least 8 characters.', 'error')
      if (passwordForm.password !== passwordForm.confirm) return showToast("Passwords don't match.", 'error')
      
      setPasswordLoading(true)
      const { error } = await supabase.auth.updateUser({ password: passwordForm.password })
      showToast(error ? error.message : 'Password updated successfully.', error ? 'error' : 'success')
      if (!error) setPasswordForm({ password: '', confirm: '' })
      setPasswordLoading(false)
  } 

  return (
    <div className="flex flex-col gap-8">
      {/* Current email info */}
      <div className="rounded-2xl p-4 text-sm flex items-center gap-3"
        style={{ background: '#f8f8f5', border: '1px solid #13260010' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#132600" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="opacity-40 shrink-0">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
        <span className="text-[#132600]/50">Current email: <span className="text-[#132600]">{user?.email}</span></span>
      </div>

      {/* Update email */}
      <div className="flex flex-col gap-5">
        <div>
          <h3 className="text-sm text-[#132600] mb-0.5">Update email</h3>
          <p className="text-xs text-[#132600]/40">You'll receive a confirmation at both your old and new address.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="New email">
            <input
              type="email"
              value={emailForm.email}
              onChange={e => setEmailForm(f => ({ ...f, email: e.target.value }))}
              placeholder="new@email.com"
              className={inputClass}
            />
          </Field>
          <Field label="Confirm new email">
            <input
              type="email"
              value={emailForm.confirm}
              onChange={e => setEmailForm(f => ({ ...f, confirm: e.target.value }))}
              placeholder="new@email.com"
              className={inputClass}
            />
          </Field>
        </div>
        <button
          onClick={handleEmailUpdate}
          disabled={emailLoading}
          className="self-start bg-[#132600] text-[#FAFAF7] rounded-full px-6 py-3 text-sm transition hover:bg-[#1f3d00] active:scale-95 disabled:opacity-50 min-w-[160px]"
        >
          {emailLoading ? 'Sending…' : 'Update email'}
        </button>
      </div>

      <div className="border-t border-[#132600]/8" />

      {/* Update password */}
      <div className="flex flex-col gap-5">
        <div>
          <h3 className="text-sm text-[#132600] mb-0.5">Update password</h3>
          <p className="text-xs text-[#132600]/40">Min 8 characters. Use uppercase, lowercase, a number and a symbol.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="New password">
            <input
              type="password"
              value={passwordForm.password}
              onChange={e => setPasswordForm(f => ({ ...f, password: e.target.value }))}
              placeholder="New password"
              className={inputClass}
            />
          </Field>
          <Field label="Confirm password">
            <input
              type="password"
              value={passwordForm.confirm}
              onChange={e => setPasswordForm(f => ({ ...f, confirm: e.target.value }))}
              placeholder="Confirm password"
              className={inputClass}
            />
          </Field>
        </div>
        {/* Strength bar */}
        {passwordForm.password && (
          <PasswordStrength password={passwordForm.password} />
        )}
        <button
          onClick={handlePasswordUpdate}
          disabled={passwordLoading}
          className="self-start bg-[#132600] text-[#FAFAF7] rounded-full px-6 py-3 text-sm transition hover:bg-[#1f3d00] active:scale-95 disabled:opacity-50 min-w-[160px]"
        >
          {passwordLoading ? 'Updating…' : 'Update password'}
        </button>
      </div>

      <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>
    </div>
  )
}

function PasswordStrength({ password }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ]
  const score = checks.filter(Boolean).length
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e']
  const labels = ['Weak', 'Fair', 'Good', 'Strong']

  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1 flex-1">
        {[0, 1, 2, 3].map(i => (
          <motion.div
            key={i}
            className="h-1 flex-1 rounded-full"
            animate={{ background: i < score ? colors[score - 1] : '#13260015' }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
      <span className="text-xs" style={{ color: score > 0 ? colors[score - 1] : '#132600' + '40' }}>
        {score > 0 ? labels[score - 1] : ''}
      </span>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProfileClient({ user, initialProfile }) {
  const [profile, setProfile] = useState(initialProfile)
  const [activeTab, setActiveTab] = useState('personal')
  const verified = isVerifiedStudent(user?.email)

  const initials = profile?.full_name?.[0]?.toUpperCase()
    || user?.email?.[0]?.toUpperCase()
    || '?'

  const sectionMap = {
    personal: <PersonalSection user={user} profile={profile} setProfile={setProfile} />,
    academic:  <AcademicSection user={user} profile={profile} setProfile={setProfile} />,
    security:  <SecuritySection user={user} />,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24"
    >
      {/* ── Profile header ── */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5 mb-10">
        <div className="relative shrink-0">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-[#FAFAF7] text-2xl shadow-lg"
            style={{ background: '#132600' }}
          >
            {initials}
          </div>
          <div
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full border-2 border-white flex items-center justify-center shadow"
            style={{ background: '#C9963E' }}
          >
            <ToretBull className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex flex-col items-center sm:items-start gap-1.5">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <h1 className="text-2xl text-[#132600]">
              {profile?.full_name || 'My Profile'}
            </h1>
            {verified && <VerifiedBadge />}
          </div>
          <p className="text-sm text-[#132600]/40">{user?.email}</p>
          {user?.created_at && (
            <p className="text-xs text-[#132600]/30">
              Member since {memberSince(user.created_at)}
            </p>
          )}
        </div>
      </div>

      {/* ── Layout: sidebar + content ── */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-10">

        {/* Sidebar — desktop */}
        <nav className="hidden md:flex flex-col gap-1 w-44 shrink-0 pt-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all text-left"
              style={{
                background: activeTab === item.id ? '#132600' : 'transparent',
                color: activeTab === item.id ? '#FAFAF7' : '#13260055',
              }}
            >
              <span style={{ opacity: activeTab === item.id ? 1 : 0.6 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Tab bar — mobile */}
        <div className="flex md:hidden gap-1 overflow-x-auto pb-1 -mx-4 px-4">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs whitespace-nowrap shrink-0 transition-all"
              style={{
                background: activeTab === item.id ? '#132600' : '#13260009',
                color: activeTab === item.id ? '#FAFAF7' : '#13260060',
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* Content panel */}
        <div className="flex-1 min-w-0">
          <div
            className="rounded-3xl p-6 sm:p-8"
            style={{
              background: 'rgba(255,255,255,0.45)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(19,38,0,0.08)',
            }}
          >
            {/* Section header */}
            <h2 className="text-xs text-[#C9963E] uppercase tracking-[0.18em] mb-6">
              {NAV_ITEMS.find(n => n.id === activeTab)?.label}
            </h2>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                {sectionMap[activeTab]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
