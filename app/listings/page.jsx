import { createClient } from '@/utils/supabase/server'
import ListingsClient from '@/components/ListingsClient'

export const metadata = {
  title: 'Services in Torino',
  description: 'Browse student services in Torino — tutoring, cleaning, consular docs, elderly care and more.',
}

export default async function ListingsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Fetch all active listings
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  // Fetch profiles for each listing
  let listingsWithProfiles = []

  if (listings && listings.length > 0) {
    const userIds = [...new Set(listings.map(l => l.user_id))]
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .in('id', userIds)

    const profileMap = {}
    profiles?.forEach(p => { profileMap[p.id] = p })

    listingsWithProfiles = listings.map(l => ({
      ...l,
      profiles: profileMap[l.user_id] || null
    }))
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7] font-sans">
      <main className="flex-grow max-w-6xl mx-auto px-8 py-12 w-full">
        <ListingsClient user={user} initialListings={listingsWithProfiles} />
      </main>
    </div>
  )
}