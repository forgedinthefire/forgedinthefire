import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { CreateJobPositionInput, UpdateJobPositionInput } from '@/src/features/careers/types'

// POST /api/admin/careers - Create or update a job position
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = (await request.json()) as CreateJobPositionInput & { id?: string }
    
    if (!body.title?.trim()) {
      return NextResponse.json({ error: 'Title is required.' }, { status: 400 })
    }

    // Generate slug if not provided
    const slug = body.slug?.trim() || body.title.trim().toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const payload = {
      title: body.title.trim(),
      slug,
      type: body.type?.trim() || 'Full-Time',
      description: body.description?.trim() || '',
      duties: body.duties?.trim() || '',
      requirements: body.requirements?.trim() || '',
      pay_range: body.pay_range?.trim() || '',
      location: body.location?.trim() || 'Cleveland, OH',
      active: body.active ?? true,
      sort_order: body.sort_order ?? 0,
    }

    if (body.id) {
      // Update existing position
      const { error } = await supabase
        .from('job_positions')
        .update(payload)
        .eq('id', body.id)
      
      if (error) {
        console.error('Careers update error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json({ ok: true, id: body.id })
    } else {
      // Create new position
      const { data, error } = await supabase
        .from('job_positions')
        .insert(payload)
        .select('id')
        .single()
      
      if (error) {
        console.error('Careers insert error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json({ ok: true, id: data.id })
    }
  } catch (err) {
    console.error('Careers API error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

// DELETE /api/admin/careers?id={id} - Delete a job position
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const { error } = await supabase
      .from('job_positions')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Careers delete error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Careers delete error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
