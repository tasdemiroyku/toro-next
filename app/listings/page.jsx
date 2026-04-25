import { createClient } from '@/utils/supabase/server'
import ListingsClient from '@/components/ListingsClient'

export const metadata = {
  title: 'Services in Torino',
  description: 'Browse student services in Torino — tutoring, cleaning, consular docs, elderly care and more.',
}

export default async function ListingsPage({ searchParams }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Next.js 15+ requires await on searchParams
  const { q } = await searchParams
  const searchQuery = q?.trim() ?? ''

  let query = supabase
    .from('listings')
    .select(`
      *,
      profiles (
        id,
        full_name,
        avatar_url
      )
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (searchQuery) {
    // Search across title, description and location (case-insensitive)
    query = query.or(
      `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`
    )
  }

  const { data: listings, error } = await query

  if (error) {
    console.error('Listings fetch error:', error.message)
  }

  return (
    <div className="min-h-screen flex flex-col bg-toro-light font-sans">
      <main className="flex-grow max-w-6xl mx-auto px-8 py-12 w-full">
        <ListingsClient
          user={user}
          initialListings={listings || []}
          searchQuery={searchQuery}
        />
      </main>
    </div>
  )
}