import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

type PositionPayload = {
  id?: string
  title: string
  slug: string
  type: string
  description: string
  duties?: string
  requirements?: string
  pay_range?: string
  location?: string
  active?: boolean
  sort_order?: number
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = (await request.json()) as PositionPayload
    if (!body.title?.trim()) {
      return NextResponse.json({ error: 'Title is required.' }, { status: 400 })
    }

    const payload = {
      title: body.title.trim(),
      slug: body.slug?.trim() ?? body.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      type: body.type?.trim() ?? '',
      description: body.description?.trim() ?? '',
      duties: body.duties?.trim() ?? '',
      requirements: body.requirements?.trim() ?? '',
      pay_range: body.pay_range?.trim() ?? '',
      location: body.location?.trim() ?? 'Georgetown, SC',
      active: body.active ?? true,
      sort_order: body.sort_order ?? 0,
    }

    const table = supabase.from('job_positions') as ReturnType<typeof supabase.from>
    if (body.id) {
      const { error } = await table.update(payload as Parameters<typeof table.update>[0]).eq('id', body.id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true, id: body.id })
    } else {
      const { data, error } = await table.insert(payload as Parameters<typeof table.insert>[0]).select('id').single()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true, id: (data as unknown as { id: string }).id })
    }
  } catch (err) {
    console.error('Careers API error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const { error } = await supabase.from('job_positions').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Careers delete error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
