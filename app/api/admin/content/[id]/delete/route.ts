import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin/auth'
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
    
    // Verify admin access
    await requireAdmin()

    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', id)

    if (error) throw error
    return NextResponse.redirect(new URL('/admin/content', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
  } catch (err) {
    if (err instanceof Error && err.message === 'Admin access required') {
      return NextResponse.redirect(new URL('/unauthorized', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
    }
    console.error('Content delete error:', err)
    return NextResponse.redirect(new URL('/admin/content?error=delete_failed', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
  }
}
