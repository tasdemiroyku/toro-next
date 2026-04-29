import { createClient } from '@/utils/supabase/server'
import ListingsClient from '@/components/ListingsClient'

export const metadata = {
  title: 'Services in Torino',
  description: 'Browse student services in Torino — tutoring, cleaning, consular docs, elderly care and more.',
}

const PAGE_SIZE = 12

export default async function ListingsPage({ searchParams }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Next.js 15+ requires await on searchParams
  const { q, category, page } = await searchParams
  const searchQuery  = q?.trim() ?? ''
  const activeCategory = category?.trim() ?? ''
  const currentPage  = Math.max(1, parseInt(page ?? '1', 10))
  const from = (currentPage - 1) * PAGE_SIZE
  const to   = from + PAGE_SIZE - 1

  let query = supabase
    .from('listings')
    .select('*, profiles(id, full_name, avatar_url, is_verified)', { count: 'exact' })
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (activeCategory) {
    query = query.eq('category', activeCategory)
  }

  if (searchQuery) {
    query = query.or(
      `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`
    )
  }

  const { data: listings, error, count } = await query

  if (error) {
    console.error('Listings fetch error:', error.message)
  }

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  return (
    <div className="min-h-screen flex flex-col bg-toro-light font-sans">
      <main className="flex-grow max-w-6xl mx-auto px-8 py-12 w-full">
        <ListingsClient
          user={user}
          initialListings={listings ?? []}
          searchQuery={searchQuery}
          activeCategory={activeCategory}
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={count ?? 0}
        />
      </main>
    </div>
  )
}