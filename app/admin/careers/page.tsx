export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import CareersClient from './CareersClient'
import type { JobPosition } from '@/src/features/careers/types'

export const metadata = {
  title: 'Careers | Forged in the Fire Admin',
  description: 'Manage job postings for the Join Our Team page',
}

export default async function AdminCareersPage() {
  const supabase = await createClient()

  // Handle missing Supabase configuration
  if (!supabase) {
    return (
      <div className="p-8">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6">
          <h2 className="text-amber-400 font-medium mb-2">Database Not Connected</h2>
          <p className="text-amber-400/80 text-sm">
            Supabase environment variables are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
          </p>
        </div>
      </div>
    )
  }

  const { data, error: selectError } = await supabase
    .from('job_positions')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('title', { ascending: true })

  if (selectError) {
    console.error('[careers] select error:', selectError)
  }

  const positions = (data as JobPosition[]) ?? []

  return <CareersClient initialPositions={positions} />
}
