import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function ProfileRouterPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single()

  // Strict Enforcement: No username? You cannot enter the site.
  if (!profile?.username) {
    redirect('/onboarding')
  }

  // Teleport directly to their public profile view
  redirect(`/u/${profile.username}`)
}