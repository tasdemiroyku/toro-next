import { createClient } from '@/utils/supabase/server'
import HomeClient from '@/components/HomeClient'

export const metadata = {
  title: 'Toro · Torino',
  description: 'Il marketplace degli studenti di Torino. Trova studenti per ripetizioni, pulizie, aiuto con documenti consolari e molto altro.',
}

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return <HomeClient user={user} />
}