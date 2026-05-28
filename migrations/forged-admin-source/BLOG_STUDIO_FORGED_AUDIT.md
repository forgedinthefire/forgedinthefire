# Blog Studio Audit: Cloned Code Analysis for Forged in the Fire

**Audit Date:** May 27, 2026  
**Source:** `/migrations/forged-admin-source/blog-studio/`  
**Total Files:** 85 items  
**Purpose:** Evaluate cloned Thomas Marine Blog Studio for nonprofit adaptation

---

## Executive Summary

The cloned Blog Studio is a comprehensive block-based content management system originally built for a marine dealership (Thomas Marine). It contains **85 files** including 30+ block types, complex template systems, and extensive marine-specific features.

**Verdict:** The architecture is sound but requires significant simplification for Forged's nonprofit needs. The core store patterns, block system, and SEO panels are reusable. Marine-specific blocks, categories, and templates must be removed or replaced.

---

## 1. Blog Studio File Inventory

### Core Type Definitions (1 file)
| File | Lines | Purpose | Status |
|------|-------|---------|--------|
| `types.ts` | 571 | TypeScript definitions for posts, blocks, SEO, design | **Adapt Required** |

**Contents:**
- `BlogPostType`: 8 marine-specific types (standard_article, service_guide, buying_guide, etc.)
- `BlogStatus`: 6 states (draft, needs_review, approved, scheduled, published, archived)
- `BlockType`: 32 block types (many marine-specific)
- `BlogCategory`: 8 marine categories ('Suzuki Outboards', 'Boat Maintenance', etc.)
- `SEOSettings`: Comprehensive SEO fields
- `DesignSettings`: Visual styling system
- `BlogPost`: Full post data model
- `BlogBlock`: Discriminated union of all 32 block types

### Data Store (1 file)
| File | Lines | Purpose | Status |
|------|-------|---------|--------|
| `blogStore.ts` | 122 | CRUD operations, API integration | **Keep** |

**Functions:**
- `getBlogPosts()` - Fetch all posts
- `getBlogPostById()` - Fetch single post
- `createBlogPost(type)` - Create with template
- `updateBlogPost(id, patch)` - Update post
- `deleteBlogPost(id)` - Remove post
- `duplicateBlogPost(id)` - Clone post
- `publishBlogPost(id)` - Publish
- `archiveBlogPost(id)` - Archive

**Notes:** Uses `/api/blog-studio/*` endpoints. Falls back to SAMPLE_POSTS. Hardcoded 'Boat Maintenance' as default category.

### Templates & Factories (2 files)
| File | Lines | Purpose | Status |
|------|-------|---------|--------|
| `templates.ts` | 505 | Block factory functions, format templates | **Rewrite Required** |
| `blockRegistry.ts` | 191 | Block imports and registry mapping | **Simplify** |

**Contents:**
- `createDefaultHeroBlock()` - Marine CTA defaults
- `createDefaultIntroBlock()` - Introduction block
- `createDefaultRichTextBlock()` - Body text
- `FORMAT_TEMPLATES` - 8 post type templates with marine defaults
- `DEFAULT_SEO` - SEO defaults with marine keywords

### Block System (55 files)

**Editors (23 files):**
- HeroBlockEditor.tsx
- IntroBlockEditor.tsx
- RichTextBlockEditor.tsx
- QuickAnswerBlockEditor.tsx
- ChecklistBlockEditor.tsx
- FAQBlockEditor.tsx
- CTABlockEditor.tsx
- GalleryBlockEditor.tsx
- SpecsTableBlockEditor.tsx (marine-specific)
- ComparisonTableBlockEditor.tsx
- RelatedServicesBlockEditor.tsx (marine-specific)
- RelatedInventoryBlockEditor.tsx (marine-specific - **REMOVE**)
- BeforeAfterBlockEditor.tsx
- PlaceholderBlockEditor.tsx
- VideoBlockEditor.tsx
- DividerBlockEditor.tsx
- HeadingBlockEditor.tsx
- ParagraphBlockEditor.tsx
- ButtonCtaBlockEditor.tsx
- ServiceCalloutBlockEditor.tsx (marine-specific)
- YouTubeVideoBlockEditor.tsx
- VimeoVideoBlockEditor.tsx
- ExternalVideoBlockEditor.tsx

**Renderers (32 files):**
- All corresponding renderers for each block type
- Plus: ServiceStepsBlockRenderer, WarningSignsBlockRenderer
- Plus: TrustBadgesBlockRenderer, ImageTextBlockRenderer
- Plus: FullImageBlockRenderer, ContactFormBlockRenderer
- Plus: MapBlockRenderer

### UI Components (11 files)
| File | Lines | Purpose | Status |
|------|-------|---------|--------|
| `BlogStudioDashboard.tsx` | 272 | Main dashboard with post list | **Adapt** |
| `BlogPostEditor.tsx` | 338 | Rich editor component | **Simplify** |
| `SimpleBlogEditor.tsx` | 272 | Alternative simpler editor | **Evaluate** |
| `SEOPanel.tsx` | 160 | Per-post SEO editing | **Adapt** |
| `BlogPublishingChecklist.tsx` | 197 | Pre-publish validation | **Keep** |
| `BlogTemplatePicker.tsx` | 262 | Template selection UI | **Rewrite** |
| `FormatSelector.tsx` | 54 | Post type selector | **Rewrite** |
| `ContentBlockCard.tsx` | 145 | Block management UI | **Keep** |
| `DesignPanel.tsx` | 107 | Visual design controls | **Optional** |
| `MediaLibraryModal.tsx` | 157 | Image/media selection | **Keep** |
| `SnippetLibraryPanel.tsx` | 124 | Reusable snippet library | **Optional** |

### Utilities (5 files)
| File | Lines | Purpose | Status |
|------|-------|---------|--------|
| `useAutosave.ts` | 54 | Autosave hook | **Keep** |
| `videoUtils.ts` | 88 | Video embed utilities | **Keep** |
| `friendlyLabels.ts` | 35 | UI label mappings | **Keep** |
| `sampleData.ts` | 248 | Sample posts with marine content | **Remove** |
| `AddSectionMenu.tsx` | 177 | Block insertion menu | **Keep** |
| `DraftAutosaveStatus.tsx` | 23 | Autosave indicator | **Keep** |
| `BlogEditorModeToggle.tsx` | 29 | Editor mode switcher | **Optional** |
| `BlogPostPreview.tsx` | 22 | Preview component | **Keep** |
| `VideoEmbedInput.tsx` | 82 | Video URL handler | **Keep** |

### Admin Pages (6 files)
- `admin-pages/page.tsx` - Studio entry
- `admin-pages/[postId]/page.tsx` - Edit page
- `admin-pages/blog-list/` - 4 files for listing

---

## 2. Feature Assessment for Forged

### ✅ Keep As-Is (Reusable)

| Feature | Files | Rationale |
|---------|-------|-----------|
| **Store Pattern** | blogStore.ts | Clean CRUD, API abstraction |
| **Autosave** | useAutosave.ts, DraftAutosaveStatus.tsx | Generic utility |
| **Slug Generation** | blogStore.ts slugify() | Standard function |
| **Block Architecture** | types.ts BaseBlock | Good foundation |
| **SEO Panel Framework** | SEOPanel.tsx | Checks are adaptable |
| **Media Handling** | MediaLibraryModal.tsx | Generic image selection |
| **Publishing Checklist** | BlogPublishingChecklist.tsx | Good workflow |
| **Video Utils** | videoUtils.ts, VideoEmbedInput.tsx | YouTube/Vimeo embedding |

### ⚠️ Adapt Required (Modify for Forged)

| Feature | Changes Needed |
|---------|----------------|
| **Post Types** | Replace marine types with nonprofit types |
| **Categories** | Replace 'Suzuki Outboards' etc. with News, Events, Impact Stories |
| **SEO Defaults** | Remove marine keywords, add nonprofit focus |
| **SEO Checks** | Remove service/inventory related checks |
| **Block Registry** | Filter out marine-specific blocks |
| **Template Defaults** | Remove marine CTAs, add nonprofit CTAs |
| **Dashboard** | Update branding, remove marine references |
| **Sample Data** | Remove all Thomas Marine content |

### ❌ Remove (Marine-Specific)

| Feature | Files | Rationale |
|---------|-------|-----------|
| **Related Inventory** | RelatedInventoryBlockEditor.tsx, Renderer | Dealership only |
| **Specs Table** | SpecsTableBlockEditor.tsx, Renderer | Boat specs |
| **Service Steps** | ServiceStepsBlockRenderer.tsx | Marine services |
| **Warning Signs** | WarningSignsBlockRenderer.tsx | Boat maintenance |
| **Service Callout** | ServiceCalloutBlockEditor.tsx, Renderer | Service dept |
| **Related Services** | RelatedServicesBlockEditor.tsx, Renderer | Service cross-sell |
| **Before/After** | BeforeAfterBlockEditor.tsx | Boat restoration |
| **Trust Badges** | TrustBadgesBlockRenderer.tsx | Marine certifications |
| **Trust Badge Types** | types.ts trust badge categories | Suzuki, marine |
| **Comparison Table** | ComparisonTableBlockEditor.tsx | Optional - could keep |
| **Hero Styles** | 'service_page', 'inventory_spotlight' | Marine-specific |
| **Layout Styles** | 'service_guide', 'sales_spotlight' | Marine-specific |
| **Accent Colors** | 'suzuki_blue' | Brand-specific |
| **Local SEO Phrases** | 'Suzuki outboard service in Georgetown' | Location-specific |

---

## 3. Dependencies Analysis

### Required Dependencies
```json
{
  "@supabase/ssr": "^0.x",
  "@supabase/supabase-js": "^2.x",
  "nanoid": "^5.x"
}
```

### Already Present in Forged
- `lucide-react` - Icons
- `framer-motion` - Animations
- `react`, `next` - Core framework

### Optional Enhancements
- TipTap or similar - Rich text editor (current uses plain textarea)
- date-fns - Date formatting

---

## 4. Database Assumptions

### Assumed Table: `blog_studio_posts`
```sql
-- Based on BlogPost type analysis:
- id: uuid (nanoid generated)
- title: text
- slug: text UNIQUE
- subtitle: text (optional)
- excerpt: text
- post_type: text (enum)
- category: text
- tags: text[]
- featured_image: jsonb
- gallery_images: jsonb[]
- blocks: jsonb (array of block objects)
- related_service_ids: text[] (SHOULD REMOVE)
- related_inventory_ids: text[] (SHOULD REMOVE)
- seo: jsonb
- design: jsonb
- status: text (enum)
- featured: boolean
- show_on_homepage: boolean
- show_on_blog_page: boolean
- author_name: text
- created_at: timestamp
- updated_at: timestamp
- published_at: timestamp (optional)
- scheduled_for: timestamp (optional)
```

### Alternative: Simplified `content` Table
The current Forged implementation uses a simpler `content` table which may be preferable.

---

## 5. API Route Assumptions

### Current Endpoints (from blogStore.ts)
```
GET    /api/blog-studio           - List all posts
GET    /api/blog-studio/:id        - Get single post
POST   /api/blog-studio           - Create post
PATCH  /api/blog-studio/:id      - Update post
DELETE /api/blog-studio/:id       - Delete post
POST   /api/blog-studio/:id/publish - Publish post
```

### Forged Current Endpoints
```
GET    /api/admin/content         - List content
POST   /api/admin/content         - Create content
GET    /api/admin/content/:id     - Get content
PATCH  /api/admin/content/:id   - Update content
DELETE /api/admin/content/:id   - Delete content
```

**Decision:** Consolidate on `/api/admin/content/*` pattern already established in Forged.

---

## 6. Auth Assumptions

### Current Implementation
- Supabase auth with email/password
- JWT session management
- Middleware protection on `/admin/*`
- API routes verify `supabase.auth.getUser()`

### Forged Status
- Auth system already implemented in Forged
- Ready for Blog Studio integration

---

## 7. Media/Image Handling Assumptions

### Current System
- `MediaAsset` type with URL, alt, caption, focal point
- `MediaLibraryModal` for selection
- Featured image + gallery images array
- Open Graph image support

### Forged Considerations
- May use Supabase Storage for uploads
- Or external image URLs
- Need image optimization pipeline

---

## 8. SEO Checker Analysis

### SEO Health Files (22 items)
| File | Purpose | Status |
|------|---------|--------|
| `seoTypes.ts` | 326 lines of SEO type definitions | **Adapt** |
| `seoStore.ts` | localStorage persistence | **Replace** |
| `seoUtils.ts` | Dashboard summary calculations | **Keep** |
| `seoMockData.ts` | 33KB of Thomas Marine mock data | **Remove** |
| `SEODashboard.tsx` | Main dashboard UI | **Adapt** |
| `admin-pages/` | SEO admin pages | **Adapt** |
| `components/` | 15 UI components | **Evaluate** |

### SEO Checks (from SEOPanel.tsx)
```typescript
const checks = [
  { ok: titleLen >= 30 && titleLen <= 65, label: 'SEO title (30–65 chars)' },
  { ok: descLen >= 120 && descLen <= 160, label: 'Meta description (120–160 chars)' },
  { ok: !!post.slug, label: 'URL slug set' },
  { ok: !!post.excerpt, label: 'Excerpt / summary set' },
  { ok: !!post.category, label: 'Category assigned' },
  { ok: !!post.featuredImage?.alt, label: 'Featured image has alt text' },
  { ok: (post.relatedServiceIds?.length ?? 0) > 0, label: 'Has related service link' }, // REMOVE
  { ok: !!seo.openGraphImage?.url || !!post.featuredImage?.url, label: 'OG / share image set' },
  { ok: !seo.enableFaqSchema || post.blocks.some((b) => b.type === 'faq'), label: 'FAQ block (for FAQ schema)' },
]
```

---

## 9. Subscriber Integration Analysis

### Files Found
- `subscribers/` folder exists but minimal content
- No direct connection to blog in current code
- Subscriber management is standalone

### Future Integration Points
- Publish notification system (TBD)
- Newsletter generation from blog posts
- Email list segmentation by category

---

## 10. Careers Code Analysis

### Files Found
- `careers/` folder with 2 items
- Job posting admin functionality
- May have useful patterns for "Opportunities" or "Volunteer Positions"

### Shared Patterns to Evaluate
- List/edit form patterns
- Status workflow
- CRUD API structure

---

## 11. Recommended Forged Blog Studio Content Model

### Simplified Post Type
```typescript
type ContentPost = {
  id: string
  title: string
  slug: string
  excerpt: string           // Short description for cards
  content: string           // Markdown or rich text
  contentBlocks?: Block[]   // Optional block array (simplified)
  featuredImage?: {
    url: string
    alt: string
  }
  category: ContentCategory
  tags: string[]
  postType: ContentType     // Template identifier
  status: 'draft' | 'published' | 'archived'
  cta?: {                  // Related call to action
    text: string
    url: string
  }
  seo: {
    title?: string
    description?: string
    keywords?: string[]
    ogImage?: string
    canonicalUrl?: string
    noIndex?: boolean
  }
  author?: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
}
```

### Recommended Categories
```typescript
type ContentCategory =
  | 'news'           // General announcements
  | 'events'         // Upcoming or past events
  | 'impact-stories' // Survivor stories (with consent)
  | 'volunteer'      // Volunteer opportunities
  | 'donor-updates'  // Fundraising and donor news
  | 'resources'      // Helpful articles and guides
  | 'partners'       // Partner spotlights
  | 'fundraising'    // Campaign updates
  | 'newsletter'     // Newsletter archive
```

### Recommended Post Types (Templates)
```typescript
type ContentType =
  | 'standard'       // Default blog post
  | 'event'          // Event announcement or recap
  | 'impact-story'   // Survivor journey (careful consent)
  | 'volunteer-opp'  // Volunteer opportunity
  | 'donor-update'   // Donor/funding update
  | 'partner-spotlight' // Partner organization feature
  | 'resource-guide' // Helpful resource article
  | 'fundraising-campaign' // Campaign announcement
  | 'newsletter'     // Newsletter content
```

---

## 12. Recommended Admin Workflow

### Phase 1: Create
1. Click "New Content"
2. Select post type (determines default template)
3. Enter title (auto-generates slug)
4. Select category

### Phase 2: Compose
5. Add excerpt (for cards/previews)
6. Compose main content (blocks or rich text)
7. Add featured image with alt text
8. Select related CTA

### Phase 3: Optimize
9. Review SEO panel scores
10. Add SEO title and description
11. Verify social sharing preview
12. Add focus keywords

### Phase 4: Publish
13. Save as draft (autosave ongoing)
14. Preview post
15. Publish or schedule
16. (Future) Notify subscribers

---

## 13. Recommended SEO Health Checker Rules

### Per-Post Checks (SEOPanel)
1. ✓ SEO title length (30-65 chars)
2. ✓ Meta description length (120-160 chars)
3. ✓ URL slug present
4. ✓ Excerpt present
5. ✓ Category assigned
6. ✓ Featured image present
7. ✓ Featured image has alt text
8. ✓ OG image set (or fallback to featured)
9. ✓ Focus keyword present
10. ✓ Internal links present (if applicable)
11. ✓ CTA present
12. ⚠ Content length check (flag if < 300 words)

### Site-Wide Checks (SEODashboard)
1. Missing titles across all pages
2. Missing meta descriptions
3. Missing H1 tags
4. Duplicate titles
5. Duplicate meta descriptions
6. Images without alt text
7. Broken internal links
8. Pages with thin content
9. Missing category on blog posts
10. Missing CTAs
11. Social sharing fields incomplete

---

## 14. Risks Before Plumbing into Forged

### Technical Risks
1. **Complexity Overload** - 85 files may be too heavy for Forged's simpler needs
2. **Block System Learning Curve** - Complex discriminated union types
3. **Database Schema Mismatch** - Current `content` table vs `blog_studio_posts` schema
4. **Bundle Size** - Many components may increase JS bundle
5. **TypeScript Complexity** - 32 block types generate complex type checking

### Content Risks
1. **Marine Contamination** - Sample data and defaults still reference Thomas Marine
2. **Over-Engineering** - May be more features than Forged needs initially
3. **Survivor Privacy** - Impact stories need careful consent workflow

### Integration Risks
1. **Route Conflicts** - `/blog-studio` vs `/admin/content`
2. **Auth Inconsistency** - Different auth patterns between systems
3. **Styling Mismatch** - Thomas Marine navy/gold vs Forged charcoal/teal

### Mitigation Strategies
1. Start with simplified version (8-10 blocks max)
2. Remove all sample data before integration
3. Create clear mapping between old and new routes
4. Audit every file for marine references

---

## 15. Step-by-Step Plan for Next Phase

### Phase A: Preparation (Before Integration)
1. ✅ Audit complete (this document)
2. Create adaptation plan (next document)
3. Define final file structure
4. Identify exact files to move
5. Plan database schema
6. Prepare environment variables

### Phase B: Simplification
1. Create reduced block type list
2. Create Forged-specific categories
3. Rewrite templates with nonprofit defaults
4. Remove marine-specific block editors
5. Remove marine-specific block renderers
6. Update SEO checks for nonprofit
7. Remove sample data

### Phase C: Integration
1. Move files to Forged app structure
2. Update imports and paths
3. Connect to Forged auth system
4. Wire to Forged API routes
5. Adapt styling to Forged theme
6. Test all CRUD operations

### Phase D: Polish
1. Add survivor privacy warnings
2. Create impact story consent workflow
3. Test SEO checker
4. Performance optimization
5. Accessibility audit

---

## Appendix: File Size Summary

| Category | Files | Est. Lines | Est. KB |
|----------|-------|------------|---------|
| Core Types | 1 | 571 | 12 KB |
| Store | 1 | 122 | 4 KB |
| Templates | 2 | 696 | 16 KB |
| Block Editors | 23 | ~3000 | 60 KB |
| Block Renderers | 32 | ~4000 | 80 KB |
| UI Components | 11 | ~2000 | 45 KB |
| Utilities | 9 | ~800 | 15 KB |
| Admin Pages | 6 | ~600 | 12 KB |
| **TOTAL** | **85** | **~12,000** | **~244 KB** |

---

**Next Document:** `BLOG_STUDIO_ADAPTATION_PLAN.md`
