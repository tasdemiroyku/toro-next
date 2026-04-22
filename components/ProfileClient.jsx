'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function ProfileClient({ user, initialProfile }) {
  const router = useRouter()
  const [profile, setProfile] = useState(initialProfile)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const update = (field, value) => setProfile(prev => ({ ...prev, [field]: value }))

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        bio: profile.bio,
        location: profile.location,
        languages: profile.languages,
        phone_number: profile.phone_number,
        university: profile.university,
        department: profile.department,
      })
      .eq('id', user.id)

    setMessage(error ? 'Something went wrong.' : 'Profile saved.')
    setSaving(false)
  }

  const handleDelete = async () => {
    const supabase = createClient()
    await supabase.from('profiles').delete().eq('id', user.id)
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const initials = profile?.full_name?.[0]?.toUpperCase()
    || user?.email?.[0]?.toUpperCase()
    || '?'

  return (
    <div className="max-w-2xl mx-auto px-8 py-16 flex flex-col gap-8">

      {/* Avatar + info */}
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-[#132600] flex items-center justify-center text-[#FAFAF7] text-xl font-bold shrink-0">
          {initials}
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#132600]">
            {profile?.full_name || 'Your profile'}
          </h1>
          <p className="text-sm text-[#132600]/50">{user?.email}</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-4">

        {/* Full name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#132600]/50 uppercase tracking-wide">Full name</label>
          <input
            type="text"
            value={profile?.full_name || ''}
            onChange={e => update('full_name', e.target.value)}
            className="border border-[#132600]/15 rounded-2xl px-5 py-3 text-sm text-[#132600] focus:outline-none focus:border-[#C9963E] transition bg-white"
          />
        </div>

        {/* Bio */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#132600]/50 uppercase tracking-wide">Bio</label>
          <textarea
            value={profile?.bio || ''}
            onChange={e => update('bio', e.target.value)}
            rows={3}
            placeholder="Tell people a bit about yourself..."
            className="border border-[#132600]/15 rounded-2xl px-5 py-3 text-sm text-[#132600] focus:outline-none focus:border-[#C9963E] transition bg-white resize-none"
          />
        </div>

        {/* Location */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#132600]/50 uppercase tracking-wide">Location</label>
          <input
            type="text"
            value={profile?.location || ''}
            onChange={e => update('location', e.target.value)}
            placeholder="e.g. Torino, Crocetta"
            className="border border-[#132600]/15 rounded-2xl px-5 py-3 text-sm text-[#132600] focus:outline-none focus:border-[#C9963E] transition bg-white"
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#132600]/50 uppercase tracking-wide">Phone number</label>
          <input
            type="tel"
            value={profile?.phone_number || ''}
            onChange={e => update('phone_number', e.target.value)}
            placeholder="e.g. +39 333 123 4567"
            className="border border-[#132600]/15 rounded-2xl px-5 py-3 text-sm text-[#132600] focus:outline-none focus:border-[#C9963E] transition bg-white"
          />
        </div>

        {/* University + Department side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#132600]/50 uppercase tracking-wide">University</label>
            <select
              value={profile?.university || ''}
              onChange={e => update('university', e.target.value)}
              className="border border-[#132600]/15 rounded-2xl px-5 py-3 text-sm text-[#132600] focus:outline-none focus:border-[#C9963E] transition bg-white"
            >
              <option value="">Select university</option>
              <option value="Università di Torino">Università di Torino</option>
              <option value="Politecnico di Torino">Politecnico di Torino</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#132600]/50 uppercase tracking-wide">Department</label>
            <input
              type="text"
              value={profile?.department || ''}
              onChange={e => update('department', e.target.value)}
              placeholder="e.g. Computer Engineering"
              className="border border-[#132600]/15 rounded-2xl px-5 py-3 text-sm text-[#132600] focus:outline-none focus:border-[#C9963E] transition bg-white"
            />
          </div>
        </div>

        {/* Languages */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#132600]/50 uppercase tracking-wide">Languages</label>
          <input
            type="text"
            value={profile?.languages?.join(', ') || ''}
            onChange={e => update('languages', e.target.value.split(',').map(l => l.trim()))}
            placeholder="e.g. Italian, English, Turkish"
            className="border border-[#132600]/15 rounded-2xl px-5 py-3 text-sm text-[#132600] focus:outline-none focus:border-[#C9963E] transition bg-white"
          />
        </div>

      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-[#132600] text-[#FAFAF7] rounded-full py-3 text-sm font-semibold hover:bg-[#1f3d00] transition disabled:opacity-60"
      >
        {saving ? 'Saving...' : 'Save profile'}
      </button>

      {message && (
        <p className="text-xs text-center text-[#132600]/50">{message}</p>
      )}

      <button
        onClick={() => setShowDeleteModal(true)}
        className="text-xs text-red-400 hover:text-red-600 transition text-center"
      >
        Delete my account
      </button>

      {/* Delete modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-[#FAFAF7] rounded-3xl p-8 max-w-sm w-full flex flex-col gap-5 shadow-xl">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-bold text-[#132600]">Delete your account?</h2>
              <p className="text-sm text-[#132600]/60 leading-relaxed">
                This will permanently delete your profile and all your data. This cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 border border-[#132600]/15 text-[#132600] rounded-full py-2.5 text-sm font-semibold hover:bg-[#132600]/5 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 text-white rounded-full py-2.5 text-sm font-semibold hover:bg-red-600 transition"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}