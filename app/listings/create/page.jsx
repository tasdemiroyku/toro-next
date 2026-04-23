'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

const CATEGORIES = [
  { value: "tutoring", label: "Tutoring" },
  { value: "cleaning", label: "Cleaning" },
  { value: "consular", label: "Consular Docs" },
  { value: "elderly", label: "Elderly Care" },
  { value: "moving", label: "Moving & Delivery" },
  { value: "tech", label: "Tech Help" },
  { value: "language", label: "Language Exchange" },
  { value: "other", label: "Other" },
]

export default function CreateListing() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    price_type: "hour",
    location: "",
    languages: "",
  })

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.category || !form.price) {
      setError("Please fill in all required fields.")
      return
    }

    setLoading(true)
    setError("")

    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/login'); return }

    const { error } = await supabase.from('listings').insert({
      user_id: session.user.id,
      title: form.title,
      description: form.description,
      category: form.category,
      price: parseFloat(form.price),
      price_type: form.price_type,
      location: form.location,
      languages: form.languages ? form.languages.split(',').map(l => l.trim()) : [],
    })

    if (error) {
      setError("Something went wrong. Try again.")
      setLoading(false)
    } else {
      router.push('/listings')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] font-sans">

      <div className="max-w-2xl mx-auto px-8 py-16 flex flex-col gap-8">

        <div>
          <h1
            className="text-3xl font-bold text-[#132600]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Post a service
          </h1>
          <p className="text-sm text-[#132600]/50 mt-1">
            Tell people what you offer and how to reach you.
          </p>
        </div>

        <div className="flex flex-col gap-5">

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#132600]/50 uppercase tracking-wide">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Math tutoring for university students"
              value={form.title}
              onChange={e => update('title', e.target.value)}
              maxLength={100}
              className="border border-[#132600]/15 rounded-2xl px-5 py-3 text-sm text-[#132600] focus:outline-none focus:border-[#C9963E] transition bg-white"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#132600]/50 uppercase tracking-wide">
              Category <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => update('category', cat.value)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition ${
                    form.category === cat.value
                      ? 'bg-[#132600] text-[#FAFAF7] border-[#132600]'
                      : 'bg-white text-[#132600] border-[#132600]/15 hover:border-[#C9963E]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#132600]/50 uppercase tracking-wide">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Describe your service, your experience, and what people can expect..."
              value={form.description}
              onChange={e => update('description', e.target.value)}
              maxLength={1000}
              className="border border-[#132600]/15 rounded-2xl px-5 py-3 text-sm text-[#132600] focus:outline-none focus:border-[#C9963E] transition bg-white resize-none"
            />
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#132600]/50 uppercase tracking-wide">
              Price <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#132600]/40">€</span>
                <input
                  type="number"
                  min="0"
                  max="10000"
                  placeholder="0"
                  value={form.price}
                  onChange={e => update('price', e.target.value)}
                  className="w-full border border-[#132600]/15 rounded-2xl pl-8 pr-5 py-3 text-sm text-[#132600] focus:outline-none focus:border-[#C9963E] transition bg-white"
                />
              </div>
              <select
                value={form.price_type}
                onChange={e => update('price_type', e.target.value)}
                className="border border-[#132600]/15 rounded-2xl px-4 py-3 text-sm text-[#132600] focus:outline-none focus:border-[#C9963E] transition bg-white"
              >
                <option value="hour">per hour</option>
                <option value="session">per session</option>
                <option value="day">per day</option>
                <option value="fixed">fixed price</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#132600]/50 uppercase tracking-wide">
              Location
            </label>
            <input
              type="text"
              placeholder="e.g. Torino, Crocetta"
              value={form.location}
              onChange={e => update('location', e.target.value)}
              className="border border-[#132600]/15 rounded-2xl px-5 py-3 text-sm text-[#132600] focus:outline-none focus:border-[#C9963E] transition bg-white"
            />
          </div>

          {/* Languages */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#132600]/50 uppercase tracking-wide">
              Languages
            </label>
            <input
              type="text"
              placeholder="e.g. Italian, English, Turkish"
              value={form.languages}
              onChange={e => update('languages', e.target.value)}
              className="border border-[#132600]/15 rounded-2xl px-5 py-3 text-sm text-[#132600] focus:outline-none focus:border-[#C9963E] transition bg-white"
            />
          </div>

        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={() => router.push('/listings')}
            className="flex-1 border border-[#132600]/15 text-[#132600] rounded-full py-3 text-sm font-semibold hover:bg-[#132600]/5 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-[#132600] text-[#FAFAF7] rounded-full py-3 text-sm font-semibold hover:bg-[#1f3d00] transition disabled:opacity-60"
          >
            {loading ? "Publishing..." : "Publish listing"}
          </button>
        </div>

      </div>

    </div>
  )
}