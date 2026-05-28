import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/admin/content - List all content
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const template = searchParams.get('template')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const featured = searchParams.get('featured')

    let query = supabase.from('content').select('*')
    
    if (type) query = query.eq('type', type)
    if (template) query = query.eq('template', template)
    if (category) query = query.eq('category', category)
    if (status) query = query.eq('status', status)
    if (featured) query = query.eq('featured', featured === 'true')
    
    const { data, error } = await query.order('updated_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    console.error('Content list error:', err)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

// POST /api/admin/content - Create new content
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    
    const { data, error } = await supabase
      .from('content')
      .insert({
        ...body,
        author_id: user.id,
        author_name: body.author_name || user.email?.split('@')[0] || 'Admin',
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error('Content create error:', err)
    return NextResponse.json({ error: 'Failed to create content' }, { status: 500 })
  }
}
