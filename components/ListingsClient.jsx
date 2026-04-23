'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "tutoring", label: "Tutoring" },
  { value: "cleaning", label: "Cleaning" },
  { value: "consular", label: "Consular Docs" },
  { value: "elderly_care", label: "Elderly Care" },
  { value: "moving", label: "Moving" },
  { value: "tech_help", label: "Tech Help" },
  { value: "language_exchange", label: "Language Exchange" },
]

export default function ListingsClient({ user, initialListings }) {
  const router = useRouter()
  const [category, setCategory] = useState("")

  const listings = category
    ? initialListings.filter(l => l.category === category)
    : initialListings

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-6 pb-20">

      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1
          className="text-3xl font-bold text-[#132600]"
          style={{ fontFamily: 'var(--font-cormorant), serif' }}
        >
          Services in Torino
        </h1>
        {user && (
          <button
            onClick={() => router.push('/listings/create')}
            className="bg-[#C9963E] text-[#FAFAF7] px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#b8852d] transition shrink-0"
          >
            + Post a service
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap mb-10">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 ${
              category === cat.value
                ? 'bg-[#132600] text-[#FAFAF7] border-[#132600] shadow-md'
                : 'bg-white text-[#132600] border-[#132600]/15 hover:border-[#C9963E] hover:bg-[#C9963E]/5'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Listings grid */}
      {listings.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-center py-24 flex flex-col items-center gap-4 bg-white border border-[#132600]/10 rounded-2xl"
        >
          <span className="text-4xl opacity-50 mb-2">🐂</span>
          <p className="text-[#132600]/60 text-sm font-medium">No listings found in this category.</p>
          {user && (
            <button
              onClick={() => router.push('/listings/create')}
              className="mt-2 bg-[#132600] text-[#FAFAF7] px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#1f3d00] transition"
            >
              Be the first to post
            </button>
          )}
        </motion.div>
      ) : (
        <motion.div 
          layout 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {listings.map(listing => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                key={listing.id}
                onClick={() => router.push(`/listings/${listing.id}`)}
                className="bg-white border border-[#132600]/10 rounded-2xl p-5 flex flex-col gap-3 hover:border-[#C9963E] hover:shadow-lg transition-all cursor-pointer group"
              >
                {/* Category tag */}
                <span className="text-[10px] font-bold text-[#C9963E] uppercase tracking-wider bg-[#C9963E]/10 w-fit px-2 py-1 rounded-md">
                  {CATEGORIES.find(c => c.value === listing.category)?.label || listing.category}
                </span>

                {/* Title */}
                <h2 className="text-lg font-bold text-[#132600] leading-snug group-hover:text-[#C9963E] transition-colors">
                  {listing.title}
                </h2>

                {/* Description preview */}
                <p className="text-sm text-[#132600]/60 leading-relaxed line-clamp-2">
                  {listing.description}
                </p>

                {/* Card footer */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#132600]/5">
                  <div className="flex items-center gap-2">
                    {listing.profiles?.avatar_url ? (
                      <img
                        src={listing.profiles.avatar_url}
                        className="w-7 h-7 rounded-full object-cover border border-[#132600]/10"
                        alt=""
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#132600]/10 flex items-center justify-center text-[#132600] text-xs font-bold border border-[#132600]/10">
                        {listing.profiles?.full_name?.[0]?.toUpperCase() || "T"}
                      </div>
                    )}
                    <span className="text-xs font-medium text-[#132600]/70 truncate max-w-[100px]">
                      {listing.profiles?.full_name || "Student"}
                    </span>
                  </div>
                  
                  {/* Smart Price Display */}
                  {listing.price === 0 || listing.price_type === 'free' ? (
                    <span className="text-sm font-bold text-[#15803d] bg-[#dcfce7] px-2 py-0.5 rounded-md">
                      Free
                    </span>
                  ) : (
                    <span className="text-sm font-bold text-[#132600]">
                      €{listing.price}
                      {listing.price_type && listing.price_type !== 'fixed' && (
                        <span className="text-xs font-medium text-[#132600]/50">
                          /{listing.price_type === 'hour' ? 'hr' : listing.price_type}
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}