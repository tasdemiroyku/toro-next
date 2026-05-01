import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import EditProfileClient from '@/components/EditProfileClient'

export const metadata = {
  title: 'Edit Profile',
}

export default async function ProfileSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex-grow bg-toro-light">
      <main className="w-full">
        <EditProfileClient user={user} initialProfile={profile} />
      </main>
    </div>
  )
}