'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { CATEGORIES, PRICE_TYPES } from '@/lib/categories'

const PRICE_TYPES = [
  { value: 'hour',    label: 'per hour' },
  { value: 'session', label: 'per session' },
  { value: 'fixed',   label: 'fixed price' },
  { value: 'free',    label: 'free' },
]

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
  const [error, setError]     = useState(null)

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
    <main className="flex-grow bg-toro-light">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-semibold mb-2 text-toro-dark">Edit listing</h1>
        <p className="text-sm text-gray-500 mb-8">Changes go live immediately.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <Field label="Title">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              maxLength={100}
              required
              placeholder="e.g. Italian grammar for exchange students"
              className={inputClass}
            />
          </Field>

          <Field label="Category">
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="" disabled>Select a category</option>
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </Field>

          <Field label={`Description (${form.description.length}/1000)`}>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              maxLength={1000}
              required
              rows={5}
              placeholder="Describe what you offer, your experience, availability…"
              className={inputClass}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Price (€)">
              <input
                name="price"
                type="number"
                min={0}
                max={10000}
                value={form.price_type === 'free' ? '0' : form.price}
                onChange={handleChange}
                disabled={form.price_type === 'free'}
                placeholder="0"
                className={`${inputClass} ${
                  form.price_type === 'free' ? 'opacity-40 cursor-not-allowed bg-gray-50' : ''
                }`}
              />
            </Field>
            <Field label="Price type">
              <select
                name="price_type"
                value={form.price_type}
                onChange={handleChange}
                className={inputClass}
              >
                {PRICE_TYPES.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Location">
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Vanchiglia, Centro, Online"
              className={inputClass}
            />
          </Field>

          <Field label="Languages (comma-separated)">
            <input
              name="languages"
              value={form.languages}
              onChange={handleChange}
              placeholder="English, Italian, Turkish"
              className={inputClass}
            />
          </Field>

          {error && (
            <p className="text-sm text-red-600 rounded-lg bg-red-50 px-4 py-3">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-medium text-toro-light bg-toro-dark disabled:opacity-60 transition hover:bg-[#1f3d00]"
            >
              {loading ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

const inputClass =
  'w-full rounded-lg border border-toro-dark/20 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-toro-dark/20 focus:border-toro-dark transition-colors bg-white'

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  )
}