import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin/auth'
import { NextResponse } from 'next/server'
import { sendMonthlyNewsletter } from '@/src/lib/email/service'
import type { ContentItem } from '@/src/features/content/types'
import type { Newsletter } from '@/src/features/subscribers/types'

// POST /api/admin/newsletters/[id]/send - Send newsletter to all subscribers
export async function POST(
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
    const { introMessage, closingMessage, selectedPosts } = body

    // Get newsletter details
    const { data: newsletter, error: newsletterError } = await supabase
      .from('newsletters')
      .select('*')
      .eq('id', id)
      .single()

    if (newsletterError || !newsletter) {
      return NextResponse.json({ error: 'Newsletter not found' }, { status: 404 })
    }

    // Check if already sent
    if (newsletter.status === 'sent') {
      return NextResponse.json({ error: 'Newsletter already sent' }, { status: 400 })
    }

    // Get all active subscribers who want monthly newsletters
    const { data: subscribers, error: subscribersError } = await supabase
      .from('newsletter_subscribers')
      .select('id, email, name, unsubscribe_token')
      .eq('status', 'active')
      .or('interest.eq.general,interest.eq.donor-updates')

    if (subscribersError) {
      console.error('Failed to fetch subscribers:', subscribersError)
      return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 })
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ error: 'No active subscribers found' }, { status: 400 })
    }

    // Send to each subscriber
    const posts = selectedPosts as ContentItem[]
    let successCount = 0
    let failCount = 0
    const results = []

    for (const subscriber of subscribers) {
      try {
        const result = await sendMonthlyNewsletter(
          newsletter as Newsletter,
          posts,
          subscriber.email,
          subscriber.id,
          subscriber.unsubscribe_token
        )

        if (result.success) {
          successCount++
        } else {
          failCount++
          results.push({ email: subscriber.email, error: result.error })
        }
      } catch (err) {
        failCount++
        console.error(`Failed to send to ${subscriber.email}:`, err)
      }
    }

    // Update newsletter status to sent
    const { error: updateError } = await supabase
      .from('newsletters')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
        recipient_count: successCount,
        intro_message: introMessage,
        closing_message: closingMessage,
      })
      .eq('id', id)

    if (updateError) {
      console.error('Failed to update newsletter status:', updateError)
    }

    // Log email sends (batch insert)
    if (successCount > 0) {
      const { error: logError } = await supabase
        .from('email_logs')
        .insert(
          subscribers.slice(0, successCount).map(sub => ({
            subscriber_id: sub.id,
            email_type: 'newsletter',
            newsletter_id: id,
            status: 'sent',
            sent_at: new Date().toISOString(),
          }))
        )

      if (logError) {
        console.error('Failed to log email sends:', logError)
      }
    }

    return NextResponse.json({
      success: true,
      recipientCount: successCount,
      failedCount: failCount,
      message: `Sent to ${successCount} subscribers${failCount > 0 ? `, ${failCount} failed` : ''}`
    })
  } catch (err) {
    if (err instanceof Error && err.message === 'Admin access required') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }
    console.error('Newsletter send error:', err)
    return NextResponse.json({ error: 'Failed to send newsletter' }, { status: 500 })
  }
}
