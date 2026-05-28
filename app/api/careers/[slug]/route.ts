import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/careers/[slug] - Get a specific job position by slug (public)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = await createClient()
    
    const { data: position, error } = await supabase
      .from('job_positions')
      .select('*')
      .eq('slug', slug)
      .eq('active', true)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return NextResponse.json(
          { error: 'Job position not found' },
          { status: 404 }
        )
      }
      console.error('Career detail fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch job position' },
        { status: 500 }
      )
    }
    
    if (!position) {
      return NextResponse.json(
        { error: 'Job position not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ position })
  } catch (err) {
    console.error('Career detail API error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
