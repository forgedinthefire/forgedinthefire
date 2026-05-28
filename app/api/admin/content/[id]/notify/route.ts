import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { sendBlogPostNotification, isEmailConfigured } from '@/src/lib/email/service'
import type { ContentItem } from '@/src/features/content/types'

// POST /api/admin/content/[id]/notify - Send blog notification to subscribers
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
    
    // Check auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Check if email is configured
    if (!isEmailConfigured()) {
      return NextResponse.json({ 
        error: 'Email delivery not configured. Add RESEND_API_KEY to send notifications.',
        configured: false 
      }, { status: 400 })
    }
    
    // Get the blog post
    const { data: post } = await supabase
      .from('content')
      .select('*')
      .eq('id', id)
      .single()
    
    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }
    
    // Only send for published posts
    if (post.status !== 'published') {
      return NextResponse.json({ 
        error: 'Can only send notifications for published posts' 
      }, { status: 400 })
    }
    
    // Check if notification was already sent
    if (post.notification_sent_at) {
      return NextResponse.json({ 
        error: 'Notification already sent for this post',
        sent_at: post.notification_sent_at 
      }, { status: 400 })
    }
    
    // Get subscribers who want blog notifications
    const { data: subscribers } = await supabase
      .from('newsletter_subscribers')
      .select('id, email, name, unsubscribe_token, preferences')
      .eq('status', 'active')
      .filter('preferences->blog_notifications', 'eq', 'true')
    
    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ 
        error: 'No subscribers opted into blog notifications' 
      }, { status: 400 })
    }
    
    // Send notifications
    const results = {
      sent: 0,
      failed: 0,
      skipped: 0,
      errors: [] as string[],
    }
    
    for (const subscriber of subscribers) {
      try {
        const result = await sendBlogPostNotification(
          post as ContentItem,
          subscriber.email,
          subscriber.id,
          subscriber.unsubscribe_token
        )
        
        if (result.success) {
          results.sent++
        } else {
          results.failed++
          results.errors.push(`${subscriber.email}: ${result.error}`)
        }
      } catch (err) {
        results.failed++
        results.errors.push(`${subscriber.email}: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
    
    // Mark notification as sent if at least one email was sent
    if (results.sent > 0) {
      await supabase
        .from('content')
        .update({ notification_sent_at: new Date().toISOString() })
        .eq('id', id)
    }
    
    return NextResponse.json({
      success: results.failed === 0,
      message: `Sent to ${results.sent} subscribers. ${results.failed} failed.`,
      results,
    })
    
  } catch (err) {
    console.error('Blog notification error:', err)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
