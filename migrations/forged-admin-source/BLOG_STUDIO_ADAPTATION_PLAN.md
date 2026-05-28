# Blog Studio Adaptation Plan: Forged in the Fire Integration

**Plan Date:** May 27, 2026  
**Target:** Integrate cloned Blog Studio into live Forged platform  
**Source:** `/migrations/forged-admin-source/blog-studio/`  
**Destination:** `/app/` and `/src/features/content/`

---

## Executive Summary

This plan defines the exact steps to adapt the cloned Thomas Marine Blog Studio for the Forged in the Fire nonprofit website. The strategy is **simplify first, then integrate**.

**Approach:**
1. Use the cloned code as architectural reference
2. Create simplified Forged-specific versions
3. Integrate into existing Forged admin structure
4. Maintain only essential complexity

---

## 1. Files to Move Into Real Forged App

### Tier 1: Essential Files (Move As-Is with Minor Adaptation)

| Source | Destination | Adaptation Needed |
|--------|-------------|-------------------|
| `blog-studio/types.ts` | `src/features/content/blogTypes.ts` | Remove marine types, simplify blocks |
| `blog-studio/blogStore.ts` | `src/features/content/blogStore.ts` | Update API base URL to `/api/admin/blog` |
| `blog-studio/useAutosave.ts` | `src/features/content/useAutosave.ts` | None - generic utility |
| `blog-studio/SEOPanel.tsx` | `src/features/content/SEOPanel.tsx` | Remove service/inventory checks |
| `blog-studio/BlogPublishingChecklist.tsx` | `src/features/content/PublishingChecklist.tsx` | Update checks for nonprofit |
| `blog-studio/MediaLibraryModal.tsx` | `src/features/content/MediaLibrary.tsx` | Adapt styling |
| `blog-studio/friendlyLabels.ts` | `src/features/content/labels.ts` | Update labels |

### Tier 2: Simplify Before Moving

| Source | Destination | Simplification |
|--------|-------------|----------------|
| `BlogStudioDashboard.tsx` | `app/admin/blog/page.tsx` | Simplify filters, update branding |
| `BlogPostEditor.tsx` | `app/admin/blog/[id]/Editor.tsx` | Reduce to 8 core blocks |
| `SimpleBlogEditor.tsx` | `app/admin/blog/[id]/SimpleEditor.tsx` | Evaluate vs main editor |
| `FormatSelector.tsx` | `app/admin/blog/new/TypeSelector.tsx` | 8 nonprofit types |
| `BlogTemplatePicker.tsx` | `app/admin/blog/new/TemplatePicker.tsx` | Nonprofit templates only |
| `ContentBlockCard.tsx` | `src/components/content/BlockCard.tsx` | Adapt styling |
| `AddSectionMenu.tsx` | `src/components/content/AddBlockMenu.tsx` | Filter to 8 blocks |

### Tier 3: Selective Block Components

**Move Only These 8 Block Types:**
1. `HeroBlockEditor.tsx` + `HeroBlockRenderer.tsx`
2. `RichTextBlockEditor.tsx` + `RichTextBlockRenderer.tsx`
3. `ImageTextBlockEditor.tsx` + `ImageTextBlockRenderer.tsx`
4. `QuoteBlockEditor.tsx` + `QuoteBlockRenderer.tsx`
5. `CTABlockEditor.tsx` + `CTABlockRenderer.tsx`
6. `FAQBlockEditor.tsx` + `FAQBlockRenderer.tsx`
7. `GalleryBlockEditor.tsx` + `GalleryBlockRenderer.tsx`
8. `VideoBlockEditor.tsx` + `VideoBlockRenderer.tsx`

**Destination Pattern:**
```
src/features/content/blocks/
├── editors/
│   ├── HeroEditor.tsx
│   ├── RichTextEditor.tsx
│   ├── ImageTextEditor.tsx
│   ├── QuoteEditor.tsx
│   ├── CTAEditor.tsx
│   ├── FAQEditor.tsx
│   ├── GalleryEditor.tsx
│   └── VideoEditor.tsx
└── renderers/
    ├── HeroRenderer.tsx
    ├── RichTextRenderer.tsx
    ├── ImageTextRenderer.tsx
    ├── QuoteRenderer.tsx
    ├── CTARenderer.tsx
    ├── FAQRenderer.tsx
    ├── GalleryRenderer.tsx
    └── VideoRenderer.tsx
```

---

## 2. Files to Rewrite Before Integration

### Must Rewrite Completely

| Original | New Implementation | Reason |
|----------|-------------------|--------|
| `templates.ts` | `src/features/content/templates.ts` | Marine defaults throughout |
| `sampleData.ts` | Delete entirely | Thomas Marine content |
| `blockRegistry.ts` | `src/features/content/blockRegistry.ts` | 32 blocks → 8 blocks |
| `types.ts` BlogCategory | New union type | Marine categories only |
| `types.ts` BlogPostType | New union type | Marine post types only |
| `types.ts` BlockType | New union type | 32 → 8 block types |

### Rewrite Specifications

#### New Block Type Union
```typescript
export type ContentBlockType =
  | 'hero'
  | 'richText'
  | 'imageText'
  | 'quote'
  | 'cta'
  | 'faq'
  | 'gallery'
  | 'video'
```

#### New Category Union
```typescript
export type ContentCategory =
  | 'news'
  | 'events'
  | 'impact-stories'
  | 'volunteer'
  | 'donor-updates'
  | 'resources'
  | 'partners'
  | 'fundraising'
```

#### New Post Type Union
```typescript
export type ContentType =
  | 'standard'
  | 'event'
  | 'impact-story'
  | 'volunteer-opp'
  | 'donor-update'
  | 'resource-guide'
  | 'partner-spotlight'
  | 'fundraising-campaign'
```

#### New Template Defaults
```typescript
// Example: Impact Story Template
export const IMPACT_STORY_TEMPLATE = {
  type: 'impact-story',
  label: 'Impact Story',
  icon: '✨',
  description: 'Share a survivor journey or success story',
  createBlocks: () => [
    createHeroBlock({ 
      title: 'A Story of Hope and Healing',
      primaryCta: { text: 'Support Our Work', url: '/donate' }
    }),
    createRichTextBlock(),
    createQuoteBlock(),
    createCTABlock({ text: 'Learn More', url: '/about' })
  ]
}
```

---

## 3. Files to Discard

### Block Components (Remove 24 files)

**Editors to Discard:**
- `IntroBlockEditor.tsx` (merge with Hero)
- `QuickAnswerBlockEditor.tsx`
- `ChecklistBlockEditor.tsx` (optional)
- `SpecsTableBlockEditor.tsx`
- `ComparisonTableBlockEditor.tsx`
- `RelatedServicesBlockEditor.tsx`
- `RelatedInventoryBlockEditor.tsx`
- `BeforeAfterBlockEditor.tsx`
- `ServiceCalloutBlockEditor.tsx`
- `YouTubeVideoBlockEditor.tsx` (merge with Video)
- `VimeoVideoBlockEditor.tsx` (merge with Video)
- `ExternalVideoBlockEditor.tsx` (merge with Video)
- `PlaceholderBlockEditor.tsx`
- `DividerBlockEditor.tsx`
- `HeadingBlockEditor.tsx` (use RichText)
- `ParagraphBlockEditor.tsx` (use RichText)
- `ButtonCtaBlockEditor.tsx` (merge with CTA)

**Renderers to Discard:**
- All corresponding renderers for above
- `ServiceStepsBlockRenderer.tsx`
- `WarningSignsBlockRenderer.tsx`
- `TrustBadgesBlockRenderer.tsx`
- `FullImageBlockRenderer.tsx`
- `ContactFormBlockRenderer.tsx`
- `MapBlockRenderer.tsx`

### Data Files to Discard
- `sampleData.ts` (entire file - 248 lines of marine content)

### UI Components (Optional Discard)
- `DesignPanel.tsx` (visual styling system - may be overkill)
- `SnippetLibraryPanel.tsx` (reusable snippets)
- `BlogEditorModeToggle.tsx` (if using single editor)
- `DraftAutosaveStatus.tsx` (merge into editor)

### SEO Files from Blog Studio
- `BlogPostPreview.tsx` (may conflict with existing preview)

---

## 4. Proposed New Forged Admin Routes

### Content Management Routes
```
/admin
├── /content              # Redirect to /blog (or show all content)
│
├── /blog                 # Blog dashboard (was BlogStudioDashboard)
│   ├── /new              # Create new post (was format selector)
│   │   └── page.tsx      # Type/Template picker
│   └── /[id]             # Edit post
│       └── page.tsx      # Post editor with blocks
│
├── /blog-categories      # (Future) Category management
└── /blog-tags            # (Future) Tag management
```

### Consolidated Routes Decision

**Option A: Separate Blog vs Content** (Keep current)
- `/admin/content` - Pages and static content
- `/admin/blog` - Blog posts specifically

**Option B: Unified Content Hub** (Recommended)
- `/admin/content` - All content (pages + blog)
- Filter by type: `?type=blog`, `?type=page`

**Decision:** Keep separate for now. Blog Studio complexity warrants its own section.

---

## 5. Proposed New Forged API Routes

### Consolidated API Structure
```
/api/admin
├── /blog
│   ├── route.ts           # GET list, POST create
│   ├── /[id]
│   │   ├── route.ts       # GET, PATCH, DELETE
│   │   └── /publish
│   │       └── route.ts   # POST publish
│   └── /categories
│       └── route.ts       # GET categories
│
└── /content               # Existing Forged content API
    └── ...
```

### Route Specifications

#### GET /api/admin/blog
```typescript
Query params:
  ?status=draft|published|archived
  ?category=news|events|impact-stories|...
  ?type=standard|event|impact-story|...
  ?search=keyword

Response:
  ContentPost[] with SEO scores
```

#### POST /api/admin/blog
```typescript
Body:
  {
    title: string
    type: ContentType
    category: ContentCategory
  }

Response:
  ContentPost (with generated slug and default blocks)
```

#### PATCH /api/admin/blog/[id]
```typescript
Body:
  Partial<ContentPost>

Actions:
  - Update any field
  - Auto-regenerate slug on title change
  - Update updatedAt timestamp
```

---

## 6. Proposed Database Schema

### Option A: Extend Existing `content` Table

Current Forged schema has `content` table. Extend it:

```sql
-- Add columns to existing content table
ALTER TABLE content ADD COLUMN IF NOT EXISTS post_type text;
ALTER TABLE content ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE content ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';
ALTER TABLE content ADD COLUMN IF NOT EXISTS content_blocks jsonb DEFAULT '[]'::jsonb;
ALTER TABLE content ADD COLUMN IF NOT EXISTS seo jsonb DEFAULT '{}'::jsonb;
ALTER TABLE content ADD COLUMN IF NOT EXISTS cta jsonb;
ALTER TABLE content ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;
```

**Pros:**
- Single table for all content
- Simpler queries
- Already exists

**Cons:**
- Schema complexity for simple pages
- Migration needed

### Option B: New `blog_posts` Table

```sql
CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text,              -- Markdown/plain text
  content_blocks jsonb DEFAULT '[]'::jsonb,  -- Block array
  
  -- Metadata
  post_type text NOT NULL DEFAULT 'standard',
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  
  -- Media
  featured_image jsonb,     -- {url, alt}
  gallery_images jsonb[],
  
  -- SEO
  seo jsonb DEFAULT '{}'::jsonb,
  
  -- CTA
  cta jsonb,                  -- {text, url}
  
  -- Workflow
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured boolean DEFAULT false,
  
  -- Author
  author_id uuid REFERENCES auth.users(id),
  author_name text,
  
  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  published_at timestamp with time zone,
  scheduled_for timestamp with time zone
);

-- Indexes
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_type ON blog_posts(post_type);
CREATE INDEX idx_blog_posts_featured ON blog_posts(featured) WHERE featured = true;

-- RLS Policies
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read of published posts"
  ON blog_posts FOR SELECT
  USING (status = 'published');

CREATE POLICY "Allow admin full access"
  ON blog_posts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**Decision:** **Option A** - Extend existing `content` table to maintain simplicity.

---

## 7. Proposed Environment Variables

### Required (Supabase)
```env
# Already present in Forged:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Optional (Future Features)
```env
# Image Storage (if using Supabase Storage)
SUPABASE_STORAGE_BUCKET=content-images

# SEO Crawler (if implementing automated checks)
SEO_CRAWLER_API_KEY=

# Newsletter (future subscriber integration)
RESEND_API_KEY=
NEWSLETTER_FROM_EMAIL=newsletter@forgedinthefireohio.org
```

---

## 8. Smoke Test Checklist

### Authentication Tests
- [ ] Can access `/admin/blog`
- [ ] Redirects to `/login` when not authenticated
- [ ] `/login` redirects to `/admin` when already logged in
- [ ] Logout works correctly

### CRUD Operations
- [ ] Can create new blog post
- [ ] Slug auto-generates from title
- [ ] Can save draft
- [ ] Can edit existing post
- [ ] Can publish post
- [ ] Can unpublish post
- [ ] Can delete post
- [ ] List shows correct status badges

### Block Editor
- [ ] Can add each of 8 block types
- [ ] Can edit block content
- [ ] Can reorder blocks
- [ ] Can delete blocks
- [ ] Blocks render correctly in preview

### SEO Panel
- [ ] Shows correct SEO score
- [ ] Title length validation works
- [ ] Description length validation works
- [ ] Checks update as content changes
- [ ] OG image preview works

### Media
- [ ] Can select featured image
- [ ] Alt text validation works
- [ ] Image appears in preview

### Categories & Types
- [ ] Can select from 8 categories
- [ ] Can select from 8 post types
- [ ] Filter by category works
- [ ] Filter by status works

### Performance
- [ ] Page loads < 2 seconds
- [ ] Autosave doesn't cause lag
- [ ] No console errors
- [ ] Responsive on tablet/desktop

---

## 9. Rollback Plan

### If Integration Fails

**Immediate Rollback (5 minutes):**
1. Revert to pre-integration git commit
2. Restart dev server
3. Admin site restored

**Partial Rollback (15 minutes):**
1. Remove `/admin/blog/*` routes
2. Remove `/api/admin/blog/*` routes
3. Keep `src/features/content/` as reference
4. Restore old `/admin/content` only

**Database Rollback:**
```sql
-- If new table was created
DROP TABLE IF EXISTS blog_posts;

-- If existing table was modified
ALTER TABLE content DROP COLUMN IF EXISTS post_type;
ALTER TABLE content DROP COLUMN IF EXISTS category;
ALTER TABLE content DROP COLUMN IF EXISTS tags;
ALTER TABLE content DROP COLUMN IF EXISTS content_blocks;
ALTER TABLE content DROP COLUMN IF EXISTS cta;
ALTER TABLE content DROP COLUMN IF EXISTS featured;
```

### Backup Points
1. **Pre-integration:** Tag git commit before starting
2. **Post-move:** Commit after files moved
3. **Post-adapt:** Commit after rewrites
4. **Post-test:** Commit after smoke tests pass

---

## 10. Exact Next Prompt Recommendation

### For Integration Phase

**Prompt to send me when ready:**

```
Begin Blog Studio integration into Forged in the Fire.

Start with Phase 1: Move and adapt essential files.

1. Move these files from /migrations/forged-admin-source/blog-studio/:
   - types.ts → src/features/content/types.ts (simplified)
   - blogStore.ts → src/features/content/store.ts
   - useAutosave.ts → src/features/content/useAutosave.ts
   - SEOPanel.tsx → src/features/content/SEOPanel.tsx

2. Create simplified block types (8 blocks only):
   - hero, richText, imageText, quote, cta, faq, gallery, video

3. Create nonprofit categories:
   - news, events, impact-stories, volunteer, donor-updates, resources, partners, fundraising

4. Update existing Forged admin:
   - Add /admin/blog route
   - Link from /admin dashboard
   - Use existing auth system

Do not:
- Add all 32 block types
- Use marine-specific templates
- Modify existing working routes
- Remove existing content table

Deliver:
- Working /admin/blog route
- Can create simple post with title and content
- Can save and view in list
```

---

## Appendix A: Complexity Comparison

| Aspect | Thomas Marine (Cloned) | Forged (Target) |
|--------|------------------------|-----------------|
| Block Types | 32 | 8 |
| Post Types | 8 | 8 |
| Categories | 8 | 8 |
| Status States | 6 | 3 |
| SEO Fields | 12+ | 8 |
| Design System | Complex | Simple |
| Sample Data | 248 lines | 0 lines |
| Total Files | 85 | ~25 |
| Est. Code Lines | 12,000 | ~3,500 |

**Reduction:** ~70% less code, simpler maintenance.

---

## Appendix B: Visual Map

```
Forged Admin (After Integration)
│
├── /admin
│   ├── page.tsx (Dashboard)
│   │   └── Link to Blog
│   │
│   ├── /blog ← NEW
│   │   ├── page.tsx (Blog Dashboard)
│   │   ├── /new
│   │   │   └── page.tsx (Type Selector)
│   │   └── /[id]
│   │       └── page.tsx (Block Editor)
│   │
│   ├── /content (Existing)
│   │   └── (Pages, simpler content)
│   │
│   ├── /seo (Existing)
│   └── /settings (Existing)
│
src/features/
├── content/
│   ├── types.ts ← ADAPTED
│   ├── store.ts ← ADAPTED
│   ├── useAutosave.ts ← COPIED
│   ├── SEOPanel.tsx ← ADAPTED
│   └── blocks/
│       ├── editors/ ← 8 simplified editors
│       └── renderers/ ← 8 simplified renderers
│
app/api/admin/
├── /blog ← NEW
│   ├── route.ts
│   └── /[id]/route.ts
│
└── /content (Existing)
```

---

**Ready for integration phase when you confirm.**
