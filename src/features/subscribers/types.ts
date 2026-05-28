// Subscriber Types for Forged in the Fire
// Extended with email preferences and newsletter support

// ─────────────────────────────────────────────────────────────────────────────
// SUBSCRIBER STATUS
// ─────────────────────────────────────────────────────────────────────────────

export type SubscriberStatus = 'active' | 'unsubscribed' | 'bounced'

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL PREFERENCES
// ─────────────────────────────────────────────────────────────────────────────

export type EmailPreference = 
  | 'monthly_newsletter'
  | 'blog_notifications'
  | 'volunteer_opportunities'
  | 'donor_updates'
  | 'community_events'
  | 'survivor_support'

export type SubscriberPreferences = {
  monthly_newsletter: boolean      // Default: true
  blog_notifications: boolean       // Default: true
  volunteer_opportunities: boolean
  donor_updates: boolean
  community_events: boolean
  survivor_support: boolean
}

export const PREFERENCE_OPTIONS: { value: EmailPreference; label: string; default: boolean }[] = [
  { value: 'monthly_newsletter', label: 'Monthly Newsletter', default: true },
  { value: 'blog_notifications', label: 'New Blog Post Notifications', default: true },
  { value: 'volunteer_opportunities', label: 'Volunteer Opportunities', default: false },
  { value: 'donor_updates', label: 'Donation and Fundraising Updates', default: false },
  { value: 'community_events', label: 'Community Events', default: false },
  { value: 'survivor_support', label: 'Survivor Support Updates', default: false },
]

export function getPreferenceLabel(preference: EmailPreference): string {
  const option = PREFERENCE_OPTIONS.find(opt => opt.value === preference)
  return option?.label || preference
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBSCRIBER MODEL
// ─────────────────────────────────────────────────────────────────────────────

export type Subscriber = {
  id: string
  email: string
  name?: string
  phone?: string
  interest: EmailPreference | 'general'
  preferences: SubscriberPreferences
  source: string
  status: SubscriberStatus
  unsubscribe_token?: string
  created_at: string
  updated_at?: string
}

export type CreateSubscriberInput = {
  email: string
  name?: string
  phone?: string
  interest?: EmailPreference | 'general'
  preferences?: Partial<SubscriberPreferences>
  source?: string
}

export type SubscriptionFormData = {
  name: string
  email: string
  phone: string
  interest: EmailPreference | 'general'
  preferences: SubscriberPreferences
}

// ─────────────────────────────────────────────────────────────────────────────
// NEWSLETTER TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type NewsletterStatus = 'draft' | 'scheduled' | 'sent'

export type Newsletter = {
  id: string
  title: string
  month: number
  year: number
  intro_message: string
  closing_message: string
  selected_blog_posts: string[]  // Array of blog post IDs
  status: NewsletterStatus
  scheduled_send_at?: string
  sent_at?: string
  recipient_count?: number
  created_at: string
  updated_at: string
}

export type CreateNewsletterInput = {
  title: string
  month: number
  year: number
  intro_message?: string
  closing_message?: string
  selected_blog_posts?: string[]
}

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL LOG TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type EmailType = 'blog_notification' | 'monthly_newsletter' | 'test_email' | 'welcome'

export type EmailStatus = 'pending' | 'sent' | 'failed' | 'skipped'

export type EmailLog = {
  id: string
  email_type: EmailType
  subscriber_id?: string
  recipient_email: string
  related_blog_post_id?: string
  related_newsletter_id?: string
  status: EmailStatus
  provider_response?: string
  error_message?: string
  sent_at?: string
  created_at: string
}

// ─────────────────────────────────────────────────────────────────────────────
// LEGACY SUPPORT (for backwards compatibility)
// ─────────────────────────────────────────────────────────────────────────────

export type SubscriptionInterest = EmailPreference | 'general'

export const INTEREST_OPTIONS: { value: SubscriptionInterest; label: string }[] = [
  { value: 'monthly_newsletter', label: 'Survivor Support Updates' },
  { value: 'blog_notifications', label: 'Volunteer Opportunities' },
  { value: 'volunteer_opportunities', label: 'Donation and Fundraising Updates' },
  { value: 'donor_updates', label: 'Community Events' },
  { value: 'community_events', label: 'General Newsletter' },
  { value: 'survivor_support', label: 'Survivor Support Updates' },
  { value: 'general', label: 'General Updates' },
]

export function getInterestLabel(interest: SubscriptionInterest): string {
  const option = PREFERENCE_OPTIONS.find(opt => opt.value === interest) ||
                 INTEREST_OPTIONS.find(opt => opt.value === interest)
  return option?.label || interest
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT PREFERENCES HELPER
// ─────────────────────────────────────────────────────────────────────────────

export function getDefaultPreferences(): SubscriberPreferences {
  return {
    monthly_newsletter: true,
    blog_notifications: true,
    volunteer_opportunities: false,
    donor_updates: false,
    community_events: false,
    survivor_support: false,
  }
}
