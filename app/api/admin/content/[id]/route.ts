import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin/auth'
import { NextResponse } from 'next/server'

// GET /api/admin/content/[id] - Get single content item
export async function GET(
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

    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    
    return NextResponse.json(data)
  } catch (err) {
    if (err instanceof Error && err.message === 'Admin access required') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }
    console.error('Content get error:', err)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

// PATCH /api/admin/content/[id] - Update content
export async function PATCH(
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

    const body = await request.json()
    
    const { data, error } = await supabase
      .from('content')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    if (err instanceof Error && err.message === 'Admin access required') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }
    console.error('Content update error:', err)
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 })
  }
}

// DELETE /api/admin/content/[id] - Delete content
export async function DELETE(
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

    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof Error && err.message === 'Admin access required') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }
    console.error('Content delete error:', err)
    return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 })
  }
}
