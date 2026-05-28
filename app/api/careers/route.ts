import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/careers - Get all active job positions (public)
export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: positions, error } = await supabase
      .from('job_positions')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Careers fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch job positions' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      positions: positions || [],
      count: positions?.length || 0
    })
  } catch (err) {
    console.error('Careers API error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
