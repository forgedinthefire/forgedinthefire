import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin/auth'
import { NextResponse } from 'next/server'

// POST /api/admin/content/[id]/duplicate - Duplicate a content item
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }
    
    // Verify admin access
    await requireAdmin()

    // Get the original content
    const { data: original, error: fetchError } = await supabase
      .from('content')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !original) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    // Create duplicate with new slug and title
    const { id: _, slug, title, created_at, updated_at, ...contentData } = original
    
    const newSlug = `${slug}-copy-${Date.now()}`
    const newTitle = `${title} (Copy)`
    
    const { data: duplicated, error: insertError } = await supabase
      .from('content')
      .insert({
        ...contentData,
        title: newTitle,
        slug: newSlug,
        status: 'draft', // Always set duplicate as draft
        featured: false,
        include_in_newsletter: false,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Duplicate content error:', insertError)
      return NextResponse.json({ error: 'Failed to duplicate content' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: duplicated }, { status: 201 })
  } catch (err) {
    if (err instanceof Error && err.message === 'Admin access required') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }
    console.error('Content duplicate error:', err)
    return NextResponse.json({ error: 'Failed to duplicate content' }, { status: 500 })
  }
}
