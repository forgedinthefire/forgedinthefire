import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

type SavePayload = {
  id?: string
  title: string
  slug: string
  summary?: string | null
  cover_image_url?: string | null
  content_json?: object | null
  content_html?: string | null
  status: 'draft' | 'scheduled' | 'published' | 'archived'
  published_at?: string | null
  scheduled_for?: string | null
  tags?: string[]
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = (await request.json()) as SavePayload
    if (!body.title?.trim() || !body.slug?.trim()) {
      return NextResponse.json({ error: 'Title and slug are required.' }, { status: 400 })
    }

    const payload = {
      title: body.title,
      slug: body.slug,
      summary: body.summary ?? null,
      cover_image_url: body.cover_image_url ?? null,
      content_json: body.content_json ?? null,
      content_html: body.content_html ?? null,
      status: body.status,
      published_at: body.published_at ?? null,
      scheduled_for: body.scheduled_for ?? null,
      published: body.status === 'published',
      tags: body.tags ?? [],
      author_id: user.id,
    }

    type BlogRow = SavePayload & { id?: string; author_id?: string; published?: boolean }
    const table = supabase.from('blog_posts') as ReturnType<typeof supabase.from>

    if (body.id) {
      const { error } = await table.update(payload as Parameters<typeof table.update>[0]).eq('id', body.id)
      if (error) {
        console.error('Blog update error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      return NextResponse.json({ ok: true, id: body.id })
    } else {
      const { data, error } = await table
        .insert(payload as Parameters<typeof table.insert>[0])
        .select('id')
        .single()
      if (error) {
        console.error('Blog insert error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      const row = data as unknown as BlogRow
      return NextResponse.json({ ok: true, id: row.id })
    }
  } catch (err) {
    console.error('Blog API error:', err)
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

    const { error } = await supabase.from('blog_posts').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Blog delete error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
