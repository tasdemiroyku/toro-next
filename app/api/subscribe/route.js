import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request) {
  try {
    const { email } = await request.json()
    if (!email || !email.includes('@')) return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })

    const supabase = await createClient()
    const { error } = await supabase.from('subscribers').insert({ email })

    if (error && error.code !== '23505') throw error // 23505 = Already exists
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}