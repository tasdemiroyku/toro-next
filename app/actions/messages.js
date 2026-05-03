'use server'
import { createClient } from '@/utils/supabase/server'

export async function sendMessage({ listingId, receiverId, content }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('messages').insert({
    sender_id: user.id,
    receiver_id: receiverId,
    listing_id: listingId,
    content: content.trim().slice(0, 500) // Max 500 chars, trim whitespace
  })
  if (error) throw new Error('Failed to send message.')
  return { success: true }
}