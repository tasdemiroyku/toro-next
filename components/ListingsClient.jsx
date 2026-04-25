'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import ToretBull from './ToretBull'

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

export default function ListingsClient({ user, initialListings, searchQuery = '' }) {
  const router = useRouter()
  const [category, setCategory] = useState("")

  const listings = category
    ? initialListings.filter(l => l.category === category)
    : initialListings

  const clearSearch = () => router.push('/listings')

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-6 pb-20">

      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-toro-dark">
            Services in Torino
          </h1>
          {searchQuery && (
            <p className="text-sm text-toro-dark/50 mt-1">
              {listings.length} result{listings.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
            </p>
          )}
        </div>
        <button
          onClick={() => router.push(user ? '/listings/create' : '/login')}
          className="bg-toro-gold text-toro-light px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#b8852d] transition shadow-sm shrink-0"
        >
          Post your service
        </button>
      </div>

      {/* Active search chip */}
      {searchQuery && (
        <div className="flex items-center gap-2 mb-6">
          <span className="inline-flex items-center gap-2 pl-4 pr-2 py-1.5 bg-toro-dark text-toro-light rounded-full text-sm font-medium">
            &ldquo;{searchQuery}&rdquo;
            <button
              onClick={clearSearch}
              aria-label="Clear search"
              className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </span>
        </div>
      )}

      {/* Category filters */}
      <div className="flex gap-2.5 flex-wrap mb-10">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`px-5 py-2 rounded-full text-xs font-bold border transition-all duration-200 ${
              category === cat.value
                ? 'bg-toro-dark text-toro-light border-toro-dark shadow-md'
                : 'bg-white text-toro-dark border-toro-dark/10 hover:border-toro-gold hover:bg-toro-gold/5'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Listings grid or empty state */}
      {listings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 px-6 flex flex-col items-center gap-6 border border-toro-dark/10 rounded-[3rem] bg-transparent"
        >
          <div className="w-16 h-16 text-toro-dark/15">
            <ToretBull className="w-full h-full" />
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-toro-dark text-lg font-bold">
              {searchQuery
                ? `No results for "${searchQuery}"`
                : 'No services here yet'}
            </p>
            <p className="text-toro-dark/40 text-sm max-w-xs mx-auto font-medium">
              {searchQuery
                ? 'Try a different keyword or browse all services.'
                : 'Be the first to offer help in this category to the student community.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="border border-toro-dark/15 text-toro-dark px-6 py-3 rounded-full text-sm font-bold hover:bg-toro-dark/5 transition"
              >
                Browse all services
              </button>
            )}
            <button
              onClick={() => router.push(user ? '/listings/create' : '/login')}
              className="bg-toro-dark text-toro-light px-8 py-3 rounded-full text-sm font-bold hover:bg-[#1f3d00] transition shadow-lg"
            >
              Post your service
            </button>
          </div>
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
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                key={listing.id}
                onClick={() => router.push(`/listings/${listing.id}`)}
                className="bg-white/40 backdrop-blur-sm border border-toro-dark/10 rounded-[2rem] p-6 flex flex-col gap-3 hover:border-toro-gold hover:shadow-xl hover:bg-white transition-all cursor-pointer group"
              >
                <span className="text-[10px] font-black text-toro-gold uppercase tracking-[0.1em] bg-toro-gold/10 w-fit px-2.5 py-1 rounded-lg">
                  {CATEGORIES.find(c => c.value === listing.category)?.label || listing.category}
                </span>

                <h2 className="text-lg font-bold text-toro-dark leading-snug group-hover:text-toro-gold transition-colors">
                  {listing.title}
                </h2>

                <p className="text-sm text-toro-dark/50 leading-relaxed line-clamp-2">
                  {listing.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-5 border-t border-toro-dark/5">
                  <div className="flex items-center gap-2.5">
                    {listing.profiles?.avatar_url ? (
                      <img
                        src={listing.profiles.avatar_url}
                        className="w-7 h-7 rounded-full object-cover border border-toro-dark/10"
                        alt=""
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-toro-dark/10 flex items-center justify-center text-toro-dark text-[10px] font-black border border-toro-dark/10">
                        {listing.profiles?.full_name?.[0]?.toUpperCase() || "T"}
                      </div>
                    )}
                    <span className="text-xs font-bold text-toro-dark/60 truncate max-w-[100px]">
                      {listing.profiles?.full_name || "Student"}
                    </span>
                  </div>

                  {listing.price === 0 || listing.price_type === 'free' ? (
                    <span className="text-xs font-black text-[#15803d] bg-[#dcfce7] px-2.5 py-1 rounded-full uppercase">
                      Free
                    </span>
                  ) : (
                    <span className="text-sm font-black text-toro-dark">
                      €{listing.price}
                      {listing.price_type && listing.price_type !== 'fixed' && (
                        <span className="text-[10px] font-bold text-toro-dark/30 ml-0.5">
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
