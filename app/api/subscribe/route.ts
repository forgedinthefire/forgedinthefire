import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { CreateSubscriberInput, SubscriberPreferences } from '@/src/features/subscribers/types'
import { sendWelcomeEmail, isEmailConfigured } from '@/src/lib/email/service'

// Default preferences
const getDefaultPreferences = (): SubscriberPreferences => ({
  monthly_newsletter: true,
  blog_notifications: true,
  volunteer_opportunities: false,
  donor_updates: false,
  community_events: false,
  survivor_support: false,
})

// POST /api/subscribe - Create new subscriber
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body: CreateSubscriberInput = await request.json()
    
    // Validation
    if (!body.email || !body.email.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }
    
    // Merge preferences with defaults
    const preferences = { ...getDefaultPreferences(), ...body.preferences }
    
    // Generate unsubscribe token
    const { data: tokenData } = await supabase.rpc('gen_random_uuid')
    const unsubscribeToken = tokenData || crypto.randomUUID()
    
    // Check for existing subscriber
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, status, unsubscribe_token')
      .eq('email', body.email.toLowerCase().trim())
      .single()
    
    if (existing) {
      // If already active, update preferences
      if (existing.status === 'active') {
        const { error: updateError } = await supabase
          .from('newsletter_subscribers')
          .update({ 
            preferences,
            name: body.name || null,
            phone: body.phone || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
        
        if (updateError) throw updateError
        
        return NextResponse.json({ 
          success: true, 
          message: 'You are already subscribed. Your preferences have been updated.',
          existing: true 
        })
      }
      
      // If unsubscribed, reactivate with new preferences
      const { error: updateError } = await supabase
        .from('newsletter_subscribers')
        .update({ 
          status: 'active',
          preferences,
          name: body.name || null,
          phone: body.phone || null,
          unsubscribe_token: unsubscribeToken,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
      
      if (updateError) throw updateError
      
      // Send welcome back email if email is configured
      if (isEmailConfigured()) {
        await sendWelcomeEmail(
          body.name || '',
          body.email.toLowerCase().trim(),
          existing.id,
          unsubscribeToken
        )
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Welcome back! Your subscription has been reactivated with your new preferences.'
      })
    }
    
    // Create new subscriber
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: body.email.toLowerCase().trim(),
        name: body.name?.trim() || null,
        phone: body.phone?.trim() || null,
        preferences,
        interest: 'general',
        source: body.source || 'website',
        status: 'active',
        unsubscribe_token: unsubscribeToken
      })
      .select()
      .single()
    
    if (error) {
      console.error('Subscriber insert error:', error)
      return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 })
    }
    
    // Send welcome email if email is configured
    if (isEmailConfigured()) {
      await sendWelcomeEmail(
        body.name || '',
        body.email.toLowerCase().trim(),
        data.id,
        unsubscribeToken
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Thank you for subscribing. You are now connected to Forged in the Fire updates.',
      data 
    })
    
  } catch (err) {
    console.error('Subscribe error:', err)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
