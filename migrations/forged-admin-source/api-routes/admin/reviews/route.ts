import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// ─────────────────────────────────────────────────────────────────────────────
// Admin Reviews API
// GET  — fetch all rows from google_reviews table
// POST — insert a single review (manual entry by admin)
// DELETE — remove a review by id (?id=xxx)
//
// Table DDL (run once in Supabase SQL editor):
//
// CREATE TABLE IF NOT EXISTS google_reviews (
//   id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
//   reviewer_name text        NOT NULL,
//   rating        int2        NOT NULL CHECK (rating BETWEEN 1 AND 5),
//   review_date   date        NOT NULL,
//   review_text   text,
//   created_at    timestamptz NOT NULL DEFAULT now()
// );
// ALTER TABLE google_reviews ENABLE ROW LEVEL SECURITY;
// -- Only authenticated (admin) users may read/write
// CREATE POLICY "admin_all" ON google_reviews FOR ALL USING (auth.role() = 'authenticated');
// ─────────────────────────────────────────────────────────────────────────────

export async function GET() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('google_reviews')
    .select('id, reviewer_name, rating, review_date, review_text')
    .order('review_date', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const body = await req.json() as {
    reviewer_name: string
    rating: number
    review_date: string
    review_text?: string
  }

  if (!body.reviewer_name || !body.rating || !body.review_date) {
    return NextResponse.json({ error: 'reviewer_name, rating, review_date required' }, { status: 400 })
  }
  if (body.rating < 1 || body.rating > 5) {
    return NextResponse.json({ error: 'rating must be 1–5' }, { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('google_reviews')
    .insert({
      reviewer_name: body.reviewer_name.trim(),
      rating: body.rating,
      review_date: body.review_date,
      review_text: body.review_text?.trim() || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(req: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from('google_reviews').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
