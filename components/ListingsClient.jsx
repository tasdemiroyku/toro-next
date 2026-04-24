'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import ToretBull from './ToretBull'

// Category keys matching the database schema
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

      {/* Top bar with consistent yellow button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1
          className="text-3xl font-bold text-[#132600]"
          style={{ fontFamily: 'var(--font-cormorant), serif' }}
        >
          Services in Torino
        </h1>
        <button
          onClick={() => router.push(user ? '/listings/create' : '/login')}
          className="bg-[#C9963E] text-[#FAFAF7] px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#b8852d] transition shadow-sm shrink-0"
        >
          Post your service
        </button>
      </div>

      {/* Category filters - pill shapes */}
      <div className="flex gap-2.5 flex-wrap mb-10">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`px-5 py-2 rounded-full text-xs font-bold border transition-all duration-200 ${
              category === cat.value
                ? 'bg-[#132600] text-[#FAFAF7] border-[#132600] shadow-md'
                : 'bg-white text-[#132600] border-[#132600]/10 hover:border-[#C9963E] hover:bg-[#C9963E]/5'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Listings grid or Refined Empty State */}
      {listings.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center py-20 px-6 flex flex-col items-center gap-6 border border-[#132600]/10 rounded-[3rem] bg-transparent"
        >
          {/* Detailed bull icon */}
          <div className="w-16 h-16 text-[#132600]/15">
            <ToretBull className="w-full h-full" />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <p className="text-[#132600] text-lg font-bold">No services here yet</p>
            <p className="text-[#132600]/40 text-sm max-w-xs mx-auto font-medium">
              Be the first to offer help in this category to the student community.
            </p>
          </div>

          {/* YENİ: Empty State butonu da her zaman görünür */}
          <button
            onClick={() => router.push(user ? '/listings/create' : '/login')}
            className="bg-[#132600] text-[#FAFAF7] px-8 py-3 rounded-full text-sm font-bold hover:bg-[#1f3d00] transition shadow-lg"
          >
            Post your service
          </button>
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
                className="bg-white/40 backdrop-blur-sm border border-[#132600]/10 rounded-[2rem] p-6 flex flex-col gap-3 hover:border-[#C9963E] hover:shadow-xl hover:bg-white transition-all cursor-pointer group"
              >
                {/* Visual refinement: Category tag */}
                <span className="text-[10px] font-black text-[#C9963E] uppercase tracking-[0.1em] bg-[#C9963E]/10 w-fit px-2.5 py-1 rounded-lg">
                  {CATEGORIES.find(c => c.value === listing.category)?.label || listing.category}
                </span>

                <h2 className="text-lg font-bold text-[#132600] leading-snug group-hover:text-[#C9963E] transition-colors">
                  {listing.title}
                </h2>

                <p className="text-sm text-[#132600]/50 leading-relaxed line-clamp-2">
                  {listing.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-5 border-t border-[#132600]/5">
                  <div className="flex items-center gap-2.5">
                    {listing.profiles?.avatar_url ? (
                      <img
                        src={listing.profiles.avatar_url}
                        className="w-7 h-7 rounded-full object-cover border border-[#132600]/10"
                        alt=""
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#132600]/10 flex items-center justify-center text-[#132600] text-[10px] font-black border border-[#132600]/10">
                        {listing.profiles?.full_name?.[0]?.toUpperCase() || "T"}
                      </div>
                    )}
                    <span className="text-xs font-bold text-[#132600]/60 truncate max-w-[100px]">
                      {listing.profiles?.full_name || "Student"}
                    </span>
                  </div>
                  
                  {listing.price === 0 || listing.price_type === 'free' ? (
                    <span className="text-xs font-black text-[#15803d] bg-[#dcfce7] px-2.5 py-1 rounded-full uppercase">
                      Free
                    </span>
                  ) : (
                    <span className="text-sm font-black text-[#132600]">
                      €{listing.price}
                      {listing.price_type && listing.price_type !== 'fixed' && (
                        <span className="text-[10px] font-bold text-[#132600]/30 ml-0.5">
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