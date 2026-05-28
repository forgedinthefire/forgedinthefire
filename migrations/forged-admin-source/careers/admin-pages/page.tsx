import { createClient } from '@/lib/supabase/server'
import CareersClient, { type JobPosition } from './CareersClient'
import { fallbackPositions } from '@/src/data/careersData'

export default async function AdminCareersPage() {
  const supabase = await createClient()

  const { data, error: selectError } = await supabase
    .from('job_positions')
    .select('id, title, slug, type, description, duties, requirements, pay_range, location, active, sort_order')
    .order('sort_order', { ascending: true })
    .order('title', { ascending: true })

  if (selectError) console.error('[careers] select error:', selectError)

  let positions = (data as unknown as JobPosition[]) ?? []

  // Seed defaults into Supabase on first visit so admin can edit/delete them
  if (positions.length === 0) {
    const seeds = fallbackPositions.map((p, i) => ({
      title: p.title,
      slug: p.slug,
      type: p.type,
      description: p.description,
      duties: p.duties,
      requirements: p.requirements,
      pay_range: p.pay_range,
      location: p.location,
      active: p.active,
      sort_order: i,
    }))
    const { data: seeded, error: insertError } = await supabase
      .from('job_positions')
      .insert(seeds as never)
      .select('id, title, slug, type, description, duties, requirements, pay_range, location, active, sort_order')
    if (insertError) console.error('[careers] insert error:', insertError)
    if (seeded) positions = seeded as unknown as JobPosition[]
  }

  return <CareersClient initialPositions={positions} />
}
