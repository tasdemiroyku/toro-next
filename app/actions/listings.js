'use server'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteListing(listingId) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: listing } = await supabase.from('listings').select('user_id').eq('id', listingId).single()
  if (!listing || listing.user_id !== user.id) throw new Error('Forbidden')

  const { error } = await supabase.from('listings').delete().eq('id', listingId)
  if (error) throw new Error(error.message)
  revalidatePath('/listings')
}

export async function toggleListingActive(listingId, currentState) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: listing } = await supabase.from('listings').select('user_id').eq('id', listingId).single()
  if (!listing || listing.user_id !== user.id) throw new Error('Forbidden')

  const { data, error } = await supabase
    .from('listings')
    .update({ is_active: !currentState })
    .eq('id', listingId).select().single()
    
  if (error) throw new Error(error.message)
  revalidatePath('/listings')
  return data
}