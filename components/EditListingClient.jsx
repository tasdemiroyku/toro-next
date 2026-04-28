'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { CATEGORIES, PRICE_TYPES } from '@/lib/categories'

export default function EditListingClient({ listing }) {
  const supabase = createClient()
  const router = useRouter()

  const [form, setForm] = useState({
    title:       listing.title       ?? '',
    description: listing.description ?? '',
    category:    listing.category    ?? '',
    price:       listing.price       ?? '',
    price_type:  listing.price_type  ?? 'hour',
    location:    listing.location    ?? '',
    languages:   (listing.languages ?? []).join(', '),
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const langs = form.languages
      .split(',')
      .map(l => l.trim())
      .filter(Boolean)

    const payload = {
      title:       form.title.trim(),
      description: form.description.trim(),
      category:    form.category,
      price:       form.price_type === 'free'
        ? 0
        : form.price === ''
          ? null
          : Number(form.price),
      price_type:  form.price_type,
      location:    form.location.trim(),
      languages:   langs,
    }

    const { error: updateError } = await supabase
      .from('listings')
      .update(payload)
      .eq('id', listing.id)

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    router.push(`/listings/${listing.id}`)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-toro-light font-sans">
      <div className="max-w-2xl mx-auto px-8 py-16 flex flex-col gap-8">

        <div>
          <h1 className="text-3xl font-bold text-toro-dark">Edit listing</h1>
          <p className="text-sm text-toro-dark/50 mt-1 font-medium">
            Changes go live immediately.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Title */}
          <Field label="Title" required>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              maxLength={100}
              required
              placeholder="e.g. Italian grammar for exchange students"
              className="toro-input !rounded-2xl"
            />
          </Field>

          {/* Category */}
          <Field label="Category" required>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, category: cat.value }))}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition ${
                    form.category === cat.value
                      ? 'bg-toro-dark text-toro-light border-toro-dark'
                      : 'bg-white text-toro-dark border-toro-dark/15 hover:border-toro-gold'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </Field>

          {/* Description */}
          <Field label={`Description (${form.description.length}/1000)`} required>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              maxLength={1000}
              required
              rows={5}
              placeholder="Describe what you offer, your experience, availability…"
              className="toro-input !rounded-2xl resize-none"
            />
          </Field>

          {/* Price */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-toro-dark/50 uppercase tracking-wide">
              Price
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-toro-dark/40 font-medium">
                  €
                </span>
                <input
                  name="price"
                  type="number"
                  min={0}
                  max={10000}
                  value={form.price_type === 'free' ? '0' : form.price}
                  onChange={handleChange}
                  disabled={form.price_type === 'free'}
                  placeholder="0"
                  className={`toro-input !rounded-2xl !pl-8 ${
                    form.price_type === 'free' ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                />
              </div>
              <div className="relative w-[150px] shrink-0">
                <select
                  name="price_type"
                  value={form.price_type}
                  onChange={handleChange}
                  className="toro-input !rounded-2xl appearance-none cursor-pointer !pr-10"
                >
                  {PRICE_TYPES.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-toro-dark/40">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <Field label="Location">
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Vanchiglia, Centro, Online"
              className="toro-input !rounded-2xl"
            />
          </Field>

          {/* Languages */}
          <Field label="Languages" hint='Comma-separated — e.g. "English, Italian, Turkish"'>
            <input
              name="languages"
              value={form.languages}
              onChange={handleChange}
              placeholder="English, Italian, Turkish"
              className="toro-input !rounded-2xl"
            />
          </Field>

          {error && (
            <p className="text-sm font-semibold text-red-500 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 toro-btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 toro-btn-primary"
            >
              {loading ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, required, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-toro-dark/50 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-toro-dark/30">{hint}</p>}
    </div>
  )
}