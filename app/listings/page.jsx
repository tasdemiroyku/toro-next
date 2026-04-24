import { createClient } from '@/utils/supabase/server'
import ListingsClient from '@/components/ListingsClient'

export const metadata = {
  title: 'Services in Torino',
  description: 'Browse student services in Torino — tutoring, cleaning, consular docs, elderly care and more.',
}

export default async function ListingsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: listings, error } = await supabase
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

  if (error) {
    console.error("İlanlar çekilirken hata:", error.message)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7] font-sans">
      <main className="flex-grow max-w-6xl mx-auto px-8 py-12 w-full">
        <ListingsClient user={user} initialListings={listings || []} />
      </main>
    </div>
  )
}