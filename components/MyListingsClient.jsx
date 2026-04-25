'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'

const CATEGORY_LABELS = {
  tutoring: 'Tutoring',
  cleaning: 'Cleaning',
  consular: 'Consular Docs',
  elderly_care: 'Elderly Care',
  moving: 'Moving',
  tech_help: 'Tech Help',
  language_exchange: 'Language Exchange',
}

export default function MyListingsClient({ listings: initial }) {
  const supabase = createClient()
  const router = useRouter()
  const [listings, setListings] = useState(initial)
  const [deletingId, setDeletingId] = useState(null)   // id shown in confirm modal
  const [loadingId, setLoadingId] = useState(null)     // id being mutated

  /* ── Toggle active/paused ── */
  async function handleToggle(listing) {
    setLoadingId(listing.id)
    const { error } = await supabase
      .from('listings')
      .update({ is_active: !listing.is_active })
      .eq('id', listing.id)

    if (!error) {
      setListings(prev =>
        prev.map(l => l.id === listing.id ? { ...l, is_active: !l.is_active } : l)
      )
    }
    setLoadingId(null)
  }

  /* ── Delete ── */
  async function handleDelete(id) {
    setLoadingId(id)
    const { error } = await supabase.from('listings').delete().eq('id', id)
    if (!error) {
      setListings(prev => prev.filter(l => l.id !== id))
      router.refresh()
    }
    setDeletingId(null)
    setLoadingId(null)
  }

  return (
    <main className="flex-grow bg-toro-light">
      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* Header row */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-toro-dark">
              My Listings
            </h1>
            <p className="text-sm mt-1 text-gray-500">
              {listings.length} listing{listings.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link
            href="/listings/create"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90 bg-toro-dark"
          >
            + New listing
          </Link>
        </div>

        {/* Empty state */}
        {listings.length === 0 && (
          <div className="text-center py-24 text-gray-400">
            <p className="text-5xl mb-4">🐂</p>
            <p className="text-lg font-medium mb-1 text-toro-dark">No listings yet</p>
            <p className="text-sm mb-6">Offer a service to the Turin community.</p>
            <Link
              href="/listings/create"
              className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-toro-dark"
            >
              Create your first listing
            </Link>
          </div>
        )}

        {/* Listing cards */}
        <motion.div layout className="flex flex-col gap-4">
          <AnimatePresence initial={false} mode="popLayout">
            {listings.map(listing => (
              <motion.div
                key={listing.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  scale: 0.97,
                  transition: { duration: 0.18 },
                }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border p-5 transition-opacity ${
                  listing.is_active 
                    ? 'border-gray-300 bg-white opacity-100' 
                    : 'border-gray-200 bg-gray-50 opacity-75'
                }`}
              >
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Link
                      href={`/listings/${listing.id}`}
                      className="font-semibold text-base truncate hover:underline text-toro-dark"
                    >
                      {listing.title}
                    </Link>
                    <StatusBadge active={listing.is_active} />
                  </div>
                  <p className="text-xs text-gray-400">
                    {CATEGORY_LABELS[listing.category] ?? listing.category}
                    {listing.price != null && (
                      <> · €{listing.price}{listing.price_type ? `/${listing.price_type}` : ''}</>
                    )}
                    {listing.location && <> · {listing.location}</>}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Created {new Date(listing.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Edit */}
                  <Link
                    href={`/listings/${listing.id}/edit`}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Edit
                  </Link>

                  {/* Pause / Resume */}
                  <button
                    onClick={() => handleToggle(listing)}
                    disabled={loadingId === listing.id}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    {loadingId === listing.id
                      ? '…'
                      : listing.is_active ? 'Pause' : 'Resume'}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => setDeletingId(listing.id)}
                    disabled={loadingId === listing.id}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deletingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
            onClick={() => setDeletingId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
            >
              <h2 className="text-lg font-semibold mb-2 text-toro-dark">
                Delete listing?
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                This can't be undone. All messages linked to this listing will also be removed.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeletingId(null)}
                  className="px-4 py-2 rounded-lg text-sm border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deletingId)}
                  disabled={loadingId === deletingId}
                  className="px-4 py-2 rounded-lg text-sm text-white font-medium disabled:opacity-50 bg-red-600 hover:bg-red-700 transition-colors"
                >
                  {loadingId === deletingId ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

function StatusBadge({ active }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
        active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-600' : 'bg-gray-400'}`}
      />
      {active ? 'Active' : 'Paused'}
    </span>
  )
}