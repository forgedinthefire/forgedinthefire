// ─────────────────────────────────────────────────────────────────────────────
// Thomas Marine SEO Control Center — TypeScript types
// ─────────────────────────────────────────────────────────────────────────────

export type SEOHealthStatus = 'green' | 'yellow' | 'red'

export type SEOPageType =
  | 'core'
  | 'service'
  | 'inventory'
  | 'blog'
  | 'category'
  | 'landing'
  | 'location'
  | 'system'

export type IndexSetting = 'index' | 'noindex'
export type FollowSetting = 'follow' | 'nofollow'
export type RedirectType = '301' | '302' | 'none'

// ── SEO Settings ──────────────────────────────────────────────────────────────

export type SEOSettings = {
  seoTitle: string
  metaDescription: string
  slug: string
  canonicalUrl: string
  useDefaultCanonical: boolean
  indexSetting: IndexSetting
  followSetting: FollowSetting
  robotsSnippet: boolean
  includeInSitemap: boolean
  ogTitle: string
  ogDescription: string
  ogImageUrl: string
  socialImageUrl: string
  primaryKeyword: string
  secondaryKeywords: string[]
  searchIntent: string
  localPhrase: string
}

// ── Schema ────────────────────────────────────────────────────────────────────

export type SchemaType =
  | 'Organization'
  | 'LocalBusiness'
  | 'WebSite'
  | 'Breadcrumb'
  | 'Service'
  | 'Article'
  | 'FAQ'
  | 'Product'
  | 'Offer'
  | 'ContactPoint'
  | 'Review'
  | 'Video'
  | 'ImageObject'

export type SchemaSettings = {
  enabled: boolean
  types: SchemaType[]
  useBusinessProfile: boolean
  usePageFAQ: boolean
  useInventoryData: boolean
  useServiceData: boolean
  customJson?: string
}

// ── Images ────────────────────────────────────────────────────────────────────

export type ImageSEO = {
  id: string
  src: string
  alt: string
  caption?: string
  fileSizeKb?: number
  isLazyLoaded: boolean
  isDecorative: boolean
  isOgImage: boolean
  isHeroImage: boolean
  health: SEOHealthStatus
  issues: string[]
}

// ── Internal Links ────────────────────────────────────────────────────────────

export type InternalLinkSuggestion = {
  id: string
  label: string
  url: string
  type: 'service' | 'blog' | 'inventory' | 'cta'
  status: 'active' | 'broken' | 'suggested'
}

// ── Local SEO ─────────────────────────────────────────────────────────────────

export type LocalSEOSettings = {
  businessName: string
  primaryCity: string
  serviceArea: string[]
  state: string
  phone: string
  address: string
  hours: string
  googleBusinessUrl: string
  mapUrl: string
  brandsServiced: string[]
  brandsSold: string[]
  primaryLocalPhrase: string
  secondaryLocalPhrases: string[]
  nearbyAreas: string[]
}

// ── Redirects ─────────────────────────────────────────────────────────────────

export type RedirectRule = {
  id: string
  fromUrl: string
  toUrl: string
  type: RedirectType
  createdAt: string
  createdBy: string
  hitCount: number
  status: 'active' | 'inactive'
  notes?: string
}

// ── History ───────────────────────────────────────────────────────────────────

export type SEOHistoryEntry = {
  id: string
  pageId: string
  changedBy: string
  field: string
  oldValue: string
  newValue: string
  changedAt: string
  reason?: string
}

// ── Issues ────────────────────────────────────────────────────────────────────

export type SEOIssueCategory =
  | 'metadata'
  | 'content'
  | 'technical'
  | 'schema'
  | 'images'
  | 'links'
  | 'local'
  | 'performance'
  | 'social'

export type SEOFixType =
  | 'auto_fix'
  | 'admin_edit'
  | 'developer_needed'
  | 'external_tool'

export type SEOIssue = {
  id: string
  severity: SEOHealthStatus
  category: SEOIssueCategory
  title: string
  description: string
  fixType: SEOFixType
  suggestedFix?: string
}

// ── Content SEO ───────────────────────────────────────────────────────────────

export type ContentSEOData = {
  hasH1: boolean
  h1Count: number
  hasH2s: boolean
  wordCount: number
  hasCTA: boolean
  hasInternalLinks: boolean
  hasFAQ: boolean
  suggestedH1?: string
  suggestedH2s?: string[]
  suggestedFAQs?: string[]
  suggestedCTA?: string
  suggestedRelatedServices?: string[]
  suggestedRelatedBlogPosts?: string[]
  suggestedRelatedInventory?: string[]
}

// ── Technical SEO ─────────────────────────────────────────────────────────────

export type TechnicalSEOData = {
  httpStatus: number
  isIndexable: boolean
  robotsBlocked: boolean
  canonicalIsCorrect: boolean
  inSitemap: boolean
  hasDuplicateTitle: boolean
  hasDuplicateMeta: boolean
  hasDuplicateSlug: boolean
  brokenInternalLinks: string[]
  missingRedirects: string[]
  hasStructuredDataErrors: boolean
  mobileWarning: boolean
  imageSizeWarning: boolean
}

// ── Main SEO Page ─────────────────────────────────────────────────────────────

export type SEOPage = {
  id: string
  name: string
  pageType: SEOPageType
  url: string
  score: number
  health: SEOHealthStatus
  indexStatus: IndexSetting
  lastUpdated: string
  lastSEOScan: string
  issues: SEOIssue[]
  settings: SEOSettings
  schema: SchemaSettings
  images: ImageSEO[]
  internalLinks: InternalLinkSuggestion[]
  localSEO: LocalSEOSettings
  technical: TechnicalSEOData
  content: ContentSEOData
  redirects: RedirectRule[]
  history: SEOHistoryEntry[]
}

// ── Dashboard summary ─────────────────────────────────────────────────────────

export type SEODashboardSummary = {
  overallHealth: number
  greenCount: number
  yellowCount: number
  redCount: number
  missingMetadataCount: number
  indexingIssuesCount: number
  brokenLinksCount: number
  needsUpdateCount: number
}

// ── SEO Templates ─────────────────────────────────────────────────────────────

export type SEOTitleTemplate = {
  pageType: SEOPageType
  template: string
  example: string
}

export const SEO_TITLE_TEMPLATES: SEOTitleTemplate[] = [
  { pageType: 'service',   template: '{serviceName} in {city}, {state} | Thomas Marine, LLC', example: 'Outboard Oil Changes in Georgetown, SC | Thomas Marine, LLC' },
  { pageType: 'inventory', template: '{year} {brand} {model} for Sale in {city} | Thomas Marine, LLC', example: '2023 Suzuki DF150 for Sale in Georgetown | Thomas Marine, LLC' },
  { pageType: 'blog',      template: '{postTitle} | Thomas Marine Knowledge Hub', example: 'When to Change Your Outboard Oil | Thomas Marine Knowledge Hub' },
  { pageType: 'core',      template: '{pageTitle} | Thomas Marine, LLC', example: 'Contact Us | Thomas Marine, LLC' },
  { pageType: 'location',  template: 'Marine Service in {city}, {state} | Thomas Marine, LLC', example: 'Marine Service in Myrtle Beach, SC | Thomas Marine, LLC' },
  { pageType: 'landing',   template: '{offer} | Thomas Marine, LLC', example: 'Spring Commissioning Special | Thomas Marine, LLC' },
  { pageType: 'category',  template: '{categoryName} | Thomas Marine, LLC', example: 'Outboard Service | Thomas Marine, LLC' },
  { pageType: 'system',    template: '{pageTitle} | Thomas Marine, LLC', example: '404 Page Not Found | Thomas Marine, LLC' },
]

// ── Score weights ─────────────────────────────────────────────────────────────

export const SCORE_WEIGHTS = {
  metadata:     0.20,
  indexability: 0.20,
  content:      0.15,
  internalLinks:0.10,
  images:       0.10,
  schema:       0.10,
  localSEO:     0.10,
  social:       0.05,
} as const

export function scoreToHealth(score: number, hasCriticalIssue: boolean): SEOHealthStatus {
  if (hasCriticalIssue) return 'red'
  if (score >= 90) return 'green'
  if (score >= 70) return 'yellow'
  return 'red'
}

export const CRITICAL_ISSUE_IDS = [
  'noindex_mistake', 'robots_blocked', 'missing_title', 'missing_meta',
  'missing_h1', 'multiple_h1', 'bad_canonical', 'not_in_sitemap',
  'duplicate_slug', 'broken_url', 'broken_links', 'schema_error',
  'service_no_cta', 'inventory_no_image', 'inventory_no_availability',
]

export const CATEGORY_LABELS: Record<SEOIssueCategory, string> = {
  metadata:    'Metadata',
  content:     'Content',
  technical:   'Technical',
  schema:      'Schema',
  images:      'Images',
  links:       'Links',
  local:       'Local SEO',
  performance: 'Performance',
  social:      'Social',
}

export const PAGE_TYPE_LABELS: Record<SEOPageType, string> = {
  core:      'Core Page',
  service:   'Service Page',
  inventory: 'Inventory Page',
  blog:      'Blog Post',
  category:  'Category Page',
  landing:   'Landing Page',
  location:  'Location Page',
  system:    'System Page',
}

export const LOCAL_PHRASES_SUGGESTIONS = [
  'Suzuki outboard service in Georgetown, SC',
  'Boat repair in Georgetown, South Carolina',
  'Marine service near Myrtle Beach',
  'Pre-owned boats in Georgetown SC',
  'Suzuki repower South Carolina',
  'Outboard diagnostics Georgetown SC',
  'Boat maintenance South Carolina coast',
  'Marine service Pawleys Island',
  'Boat dealer Murrells Inlet',
  'Outboard repair Georgetown County',
]
