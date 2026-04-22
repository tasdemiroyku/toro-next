// app/page.js
import { createClient } from '@/utils/supabase/server'
import HomeClient from '@/components/HomeClient'

export default async function Home() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  // Explicitly selecting with the relationship hint
  const { data: listings, error } = await supabase
    .from('listings')
    .select('*, profiles(full_name, avatar_url)') 
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(4)

  if (error) {
    console.error('Supabase error on Home:', error.message)
  }

  return <HomeClient user={user} listings={listings || []} />
}