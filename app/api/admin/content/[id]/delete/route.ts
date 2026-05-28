import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.redirect(new URL('/admin/content?error=db_not_configured', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
    }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', id)

    if (error) throw error
    return NextResponse.redirect(new URL('/admin/content', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
  } catch (err) {
    console.error('Content delete error:', err)
    return NextResponse.redirect(new URL('/admin/content?error=delete_failed', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
  }
}
