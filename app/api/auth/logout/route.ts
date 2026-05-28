import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createClient()
    if (supabase) {
      await supabase.auth.signOut()
    }
  } catch (error) {
    console.error('Logout error:', error)
    // Continue to redirect even if signOut fails
  }
  
  return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
}
