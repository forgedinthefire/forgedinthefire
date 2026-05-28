// Forged in the Fire - Content Management Types
// Adapted from Blog Studio audit - simplified for nonprofit use

// ─────────────────────────────────────────────────────────────────────────────
// STATUS & WORKFLOW
// ─────────────────────────────────────────────────────────────────────────────

export type ContentStatus = 'draft' | 'published' | 'archived'

// ─────────────────────────────────────────────────────────────────────────────
// POST TEMPLATES (Determines default blocks and layout)
// ─────────────────────────────────────────────────────────────────────────────

export type PostTemplate =
  | 'standard'           // Default blog post
  | 'event'              // Event announcement or recap
  | 'impact-story'       // Survivor journey (with consent tracking)
  | 'volunteer-opp'      // Volunteer opportunity
  | 'donor-update'       // Donor/funding update
  | 'resource-guide'     // Helpful resource article
  | 'partner-spotlight'  // Partner organization feature
  | 'fundraising'        // Campaign announcement

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORIES (For filtering and organization)
// ─────────────────────────────────────────────────────────────────────────────

export type ContentCategory =
  | 'news'           // General announcements
  | 'events'         // Upcoming or past events
  | 'impact-stories' // Survivor stories (with consent)
  | 'volunteer'      // Volunteer opportunities
  | 'donor-updates'  // Fundraising and donor news
  | 'resources'      // Helpful articles and guides
  | 'partners'       // Partner spotlights
  | 'fundraising'    // Campaign updates

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT BLOCKS (Simplified from 32 to 8 block types)
// ─────────────────────────────────────────────────────────────────────────────

export type ContentBlockType =
  | 'hero'             // Title, subtitle, background image
  | 'text'             // Rich text content
  | 'imageText'        // Side-by-side image and text
  | 'quote'            // Blockquote with attribution
  | 'cta'              // Call-to-action button
  | 'faq'              // Frequently asked questions
  | 'gallery'          // Image gallery
  | 'video'            // Embedded video

export type ContentBlock =
  | { type: 'hero'; data: { title: string; subtitle?: string; image?: string } }
  | { type: 'text'; data: { content: string } }
  | { type: 'imageText'; data: { image: string; imageAlt: string; imagePosition: 'left' | 'right'; title?: string; content: string } }
  | { type: 'quote'; data: { text: string; author?: string; role?: string } }
  | { type: 'cta'; data: { text: string; url: string; style?: 'primary' | 'secondary' | 'outline' } }
  | { type: 'faq'; data: { items: { question: string; answer: string }[] } }
  | { type: 'gallery'; data: { images: { src: string; alt: string; caption?: string }[] } }
  | { type: 'video'; data: { url: string; title?: string; caption?: string } }

// ─────────────────────────────────────────────────────────────────────────────
// MEDIA
// ─────────────────────────────────────────────────────────────────────────────

export type MediaAsset = {
  id: string
  url: string
  alt: string
  caption?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// SEO
// ─────────────────────────────────────────────────────────────────────────────

export type SEOSettings = {
  title?: string               // SEO title (30-65 chars)
  description?: string         // Meta description (120-160 chars)
  keywords?: string[]          // Focus keywords
  ogTitle?: string             // Open Graph title
  ogDescription?: string       // Open Graph description
  ogImage?: string            // Social sharing image
  canonicalUrl?: string       // Canonical URL
  noIndex?: boolean           // Hide from search engines
}

// ─────────────────────────────────────────────────────────────────────────────
// CALL TO ACTION
// ─────────────────────────────────────────────────────────────────────────────

export type CTAType =
  | 'donate'
  | 'volunteer'
  | 'contact'
  | 'event'
  | 'sponsor'
  | 'partner'
  | 'learn-more'
  | 'subscribe'

export type ContentCTA = {
  type: CTAType
  text: string
  url: string
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN CONTENT ITEM (Blog Post)
// ─────────────────────────────────────────────────────────────────────────────

export type ContentItem = {
  // Identity
  id: string
  title: string
  slug: string
  
  // Classification
  template: PostTemplate
  category: ContentCategory
  tags: string[]
  
  // Content
  excerpt: string              // Short description for cards
  blocks: ContentBlock[]       // Content blocks
  
  // Media
  featuredImage?: MediaAsset
  galleryImages?: MediaAsset[]
  
  // SEO
  seo: SEOSettings
  
  // Engagement
  cta?: ContentCTA             // Related call to action
  
  // Workflow
  status: ContentStatus
  featured: boolean            // Highlight on homepage
  
  // Author
  authorName?: string
  authorId?: string
  
  // Email Notification Fields
  sendBlogNotification: boolean        // Send notification when published
  notificationSentAt?: string            // When notification was sent
  emailSubject?: string                // Custom email subject
  emailExcerpt?: string                // Custom excerpt for email
  
  // Newsletter Fields
  includeInNewsletter: boolean         // Include in monthly newsletter
  featuredInNewsletter: boolean        // Feature prominently in newsletter
  newsletterCategory?: string          // Suggested newsletter section
  
  // Timestamps
  createdAt: string
  updatedAt: string
  publishedAt?: string
  scheduledFor?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// FILTERS & QUERIES
// ─────────────────────────────────────────────────────────────────────────────

export type ContentFilter = {
  template?: PostTemplate
  category?: ContentCategory
  status?: ContentStatus
  search?: string
  featured?: boolean
  includeInNewsletter?: boolean
  featuredInNewsletter?: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// SEO HEALTH CHECK
// ─────────────────────────────────────────────────────────────────────────────

export type SEOCheck = {
  id: string
  label: string
  ok: boolean
  warn?: boolean
  value?: string | number
}

export type SEOHealthScore = {
  score: number      // 0-100
  checks: SEOCheck[]
  passed: number
  total: number
}
