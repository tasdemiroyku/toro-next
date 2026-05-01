import { createClient } from '@supabase/supabase-js'

/**
 * WARNING: This client uses the secret key.
 * It bypasses Row Level Security (RLS).
 * Use ONLY in Server Actions or API Routes.
 */
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY, // Uses the SECRET key
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export default supabaseAdmin