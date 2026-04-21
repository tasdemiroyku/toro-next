'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "tutoring", label: "Tutoring" },
  { value: "cleaning", label: "Cleaning" },
  { value: "consular", label: "Consular Docs" },
  { value: "elderly", label: "Elderly Care" },
  { value: "moving", label: "Moving & Delivery" },
  { value: "tech", label: "Tech Help" },
  { value: "language", label: "Language Exchange" },
  { value: "other", label: "Other" },
]

export default function ListingsClient({ user, initialListings }) {
  const router = useRouter()
  const [category, setCategory] = useState("")

  const listings = category
    ? initialListings.filter(l => l.category === category)
    : initialListings

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">

      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-3xl font-bold text-[#132600]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Services in Torino
        </h1>
        {user && (
          <button
            onClick={() => router.push('/listings/create')}
            className="bg-[#C9963E] text-[#FAFAF7] px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#b8852d] transition"
          >
            + Post a service
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`px-4 py-2 rounded-full text-xs font-semibold border transition ${
              category === cat.value
                ? 'bg-[#132600] text-[#FAFAF7] border-[#132600]'
                : 'bg-white text-[#132600] border-[#132600]/15 hover:border-[#C9963E]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Listings grid */}
      {listings.length === 0 ? (
        <div className="text-center py-24 flex flex-col items-center gap-4">
          <p className="text-[#132600]/40 text-sm">No listings yet in this category.</p>
          {user && (
            <button
              onClick={() => router.push('/listings/create')}
              className="bg-[#132600] text-[#FAFAF7] px-5 py-2.5 rounded-full text-sm font-semibold"
            >
              Be the first to post
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map(listing => (
            <div
              key={listing.id}
              onClick={() => router.push(`/listings/${listing.id}`)}
              className="bg-white border border-[#132600]/10 rounded-2xl p-5 flex flex-col gap-3 hover:border-[#C9963E] hover:shadow-sm transition cursor-pointer"
            >
              {/* Category tag */}
              <span className="text-xs font-semibold text-[#C9963E] uppercase tracking-wide">
                {listing.category}
              </span>

              {/* Title */}
              <h2 className="text-base font-bold text-[#132600] leading-snug">
                {listing.title}
              </h2>

              {/* Description preview */}
              <p className="text-xs text-[#132600]/50 leading-relaxed line-clamp-2">
                {listing.description}
              </p>

              {/* Card footer */}
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#132600]/5">
                <div className="flex items-center gap-2">
                  {listing.profiles?.avatar_url ? (
                    <img
                      src={listing.profiles.avatar_url}
                      className="w-6 h-6 rounded-full object-cover"
                      alt=""
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#132600] flex items-center justify-center text-[#FAFAF7] text-xs font-bold">
                      {listing.profiles?.full_name?.[0] || "?"}
                    </div>
                  )}
                  <span className="text-xs text-[#132600]/50">
                    {listing.profiles?.full_name || "Anonymous"}
                  </span>
                </div>
                <span className="text-sm font-bold text-[#132600]">
                  €{listing.price}
                  <span className="text-xs font-normal text-[#132600]/40">/{listing.price_type}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}