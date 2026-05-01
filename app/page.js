import { createClient } from '@/utils/supabase/server'
import HomeClient from '@/components/HomeClient'

export default async function Home() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // FIX: Added id, username, and is_verified to the profiles selection
  const { data: listings, error } = await supabase
    .from('listings')
    .select('*, profiles(id, full_name, avatar_url, username, is_verified)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(12)

  if (error) {
    console.error('Supabase error on Home:', error.message)
  }

  return <HomeClient user={user} listings={listings || []} />
}