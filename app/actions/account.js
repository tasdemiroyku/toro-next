'use server'

import { createClient } from '@/utils/supabase/server'
import supabaseAdmin from '@/utils/supabase/admin' // Using our new admin utility
import { redirect } from 'next/navigation'

/**
 * Permanently deletes the user account from both public.profiles and auth.users
 */
export async function deleteUserAccount() {
  const supabase = await createClient()

  // 1. Authenticate the requester
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    console.error('Authentication failed during account deletion:', authError)
    throw new Error('Authentication required.')
  }

  try {
    // 2. Remove user metadata and profile from public schema
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id)

    if (profileError) {
      console.warn('Profile record could not be deleted:', profileError.message)
    }

    // 3. Delete the user from the core authentication system via Admin API
    const { error: adminDeleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id)

    if (adminDeleteError) {
      throw adminDeleteError
    }

    // 4. Clear the local session and send the user home
    await supabase.auth.signOut()
    
  } catch (error) {
    console.error('Critical error during account deletion process:', error)
    throw new Error('Failed to delete account. Please contact support if the issue persists.')
  }

  redirect('/')
}