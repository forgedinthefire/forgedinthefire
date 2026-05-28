# Migration Manifest: Thomas Marine Admin Portal → Forged in the Fire Ohio

**Date of Migration:** May 27, 2026  
**Source Platform:** Thomas Marine (https://thomas-marine-preview.netlify.app)  
**Target Platform:** Forged in the Fire Ohio (https://www.forgedinthefireohio.org)  
**Migration Phase:** Source Code Preservation Only (No Adaptation)

---

## Summary

This migration preserves reusable admin portal code from the Thomas Marine platform for later adaptation to the Forged in the Fire Ohio nonprofit website. This is a **PRESERVATION ONLY** phase - no code adaptation has occurred.

### Features Copied
1. Blog Studio (content editor with block-based architecture)
2. SEO Health Checker (site-wide SEO audit and per-page management)
3. Careers Admin (job posting management)
4. Subscriber Management (email subscription handling)
5. Admin Dashboard Structure (sidebar navigation, auth protection)
6. Database/Auth Utilities (Supabase integration patterns)

---

## Complete File List (Copied)

### Blog Studio (`/blog-studio/`)
| File | Purpose | Size | Notes |
|------|---------|------|-------|
| `types.ts` | TypeScript definitions for blog posts, blocks, SEO | 12,448 bytes | Contains marine-specific types |
| `blogStore.ts` | CRUD operations, persistence layer | 4,219 bytes | Uses Supabase API |
| `templates.ts` | Block factory functions, default content | 15,829 bytes | Marine-specific defaults |
| `blockRegistry.ts` | Block type definitions and registry | 16,993 bytes | Contains marine-specific blocks |
| `blogStore.ts` | State management and API calls | 4,219 bytes | Generic store pattern |
| `useAutosave.ts` | Autosave hook | 2,133 bytes | Generic utility |
| `videoUtils.ts` | Video embed utilities | 4,235 bytes | Generic utility |
| `friendlyLabels.ts` | UI label mappings | 1,332 bytes | Generic |
| `sampleData.ts` | Sample blog posts | 24,838 bytes | Thomas Marine content |
| `templates.ts` | Content templates | 15,829 bytes | Marine-specific templates |
| `BlogStudioDashboard.tsx` | Main dashboard UI | 14,075 bytes | Thomas Marine branded |
| `BlogPostEditor.tsx` | Content editor component | 19,386 bytes | Complex block editor |
| `SimpleBlogEditor.tsx` | Simplified editor | 13,649 bytes | Alternative editor |
| `BlogPostPreview.tsx` | Preview component | 670 bytes | Generic |
| `BlogPublishingChecklist.tsx` | Pre-publish checks | 6,945 bytes | Generic |
| `BlogTemplatePicker.tsx` | Template selection UI | 13,555 bytes | Marine-specific templates |
| `ContentBlockCard.tsx` | Block management UI | 5,926 bytes | Generic |
| `DesignPanel.tsx` | Visual design controls | 4,223 bytes | Generic |
| `SEOPanel.tsx` | SEO editing panel | 8,941 bytes | Generic SEO fields |
| `AddSectionMenu.tsx` | Block insertion UI | 6,867 bytes | Generic |
| `MediaLibraryModal.tsx` | Media selection modal | 6,223 bytes | Generic |
| `SnippetLibraryPanel.tsx` | Reusable snippets | 4,899 bytes | Generic |
| `VideoEmbedInput.tsx` | Video URL handler | 3,244 bytes | Generic |
| `FormatSelector.tsx` | Content format picker | 2,254 bytes | Generic |
| `DraftAutosaveStatus.tsx` | Autosave indicator | 877 bytes | Generic |
| `BlogEditorModeToggle.tsx` | Editor mode switcher | 1,088 bytes | Generic |
| `blocks/editors/` | Block editor components | Multiple | Various block editors |
| `blocks/renderers/` | Block render components | Multiple | Various block renderers |

### SEO Health (`/seo-health/`)
| File | Purpose | Size | Notes |
|------|---------|------|-------|
| `seoTypes.ts` | SEO type definitions | 10,961 bytes | Comprehensive SEO framework |
| `seoStore.ts` | localStorage persistence | 2,963 bytes | Client-side storage |
| `seoUtils.ts` | Dashboard calculations | 1,212 bytes | Generic utilities |
| `seoMockData.ts` | Sample SEO data | 33,296 bytes | Thomas Marine page data |
| `SEODashboard.tsx` | Main SEO dashboard | 11,389 bytes | Page listing with scores |
| `admin-pages/SEOAuditPanel.tsx` | SEO audit results UI | 14,052 bytes | Crawler results display |
| `components/SEOPrimitives.tsx` | Reusable UI components | 9,344 bytes | Health lights, badges, inputs |
| `components/SEOPagePanel.tsx` | Per-page SEO editor | 7,469 bytes | Detailed SEO editing |
| `components/BulkSEOTools.tsx` | Bulk operations UI | 8,732 bytes | Mass edit tools |

### Careers (`/careers/`)
| File | Purpose | Size | Notes |
|------|---------|------|-------|
| `admin-pages/` | Career management pages | Directory | Job posting admin UI |

### Subscribers (`/subscribers/`)
| File | Purpose | Size | Notes |
|------|---------|------|-------|
| `admin-pages/` | Subscriber management pages | Directory | Email list management |

### Admin Layout (`/admin-layout/`)
| File | Purpose | Size | Notes |
|------|---------|------|-------|
| `layout.tsx` | Admin sidebar layout | 3,197 bytes | Thomas Marine branded |
| `page.tsx` | Admin dashboard | 24,801 bytes | Thomas Marine specific stats |

### API Routes (`/api-routes/`)
| File | Purpose | Size | Notes |
|------|---------|------|-------|
| `blog-studio/route.ts` | Blog CRUD endpoints | 4,017 bytes | RESTful API |
| `blog-studio/[id]/route.ts` | Individual post API | 2,170 bytes | GET/PATCH/DELETE |
| `blog-studio/[id]/publish/route.ts` | Publish endpoint | Unknown | Post publishing |
| `admin/blog/route.ts` | Legacy blog API | 90 lines | POST/DELETE operations |
| `admin/careers/route.ts` | Careers API | Unknown | Job posting CRUD |
| `admin/reviews/route.ts` | Reviews API | Unknown | Testimonial management |
| `auth/` | Authentication routes | Directory | Login/logout handlers |

### Database/Auth (`/database/`)
| File | Purpose | Size | Notes |
|------|---------|------|-------|
| `server.ts` | Server-side Supabase client | 3,938 bytes | Auth patterns, RLS |
| `client.ts` | Client-side Supabase client | 2,538 bytes | Browser auth |

### Auth (`/auth/`)
| File | Purpose | Size | Notes |
|------|---------|------|-------|
| `middleware.ts` | Route protection pattern | 1,486 bytes | Admin auth guard |

### Utilities (`/utils/`)
| File | Purpose | Size | Notes |
|------|---------|------|-------|
| `utils.ts` | General utilities | 923 bytes | cn() helper, etc. |
| `email.ts` | Email sending utilities | 6,758 bytes | Resend integration |
| `scripts/seo-crawler.mjs` | SEO audit crawler | ~15,000 bytes | Site-wide SEO scan |

---

## Files Intentionally NOT Copied

### Marine/Dealership Specific Features
- `app/admin/inventory/` - Boat inventory management
- `app/admin/leads/` - Sales lead pipeline
- `app/admin/service-requests/` - Marine service scheduling
- `app/admin/part-reservations/` - Parts ordering system
- `app/admin/promotions/` - Sales promotions
- `app/admin/pixel/` - Marketing pixel management
- `app/admin/social/` - Social media publisher
- `app/admin/reviews/` - Google reviews management (optional)
- `app/admin/settings/` - Thomas Marine specific settings
- `src/features/social/` - Social media integration

### Thomas Marine Content
- Public assets (images, logos)
- Content pages (about, services, etc.)
- Brand-specific components

---

## Known Thomas Marine References in Copied Code

### Branding References
- "Thomas Marine" in admin layout header
- "Thomas Marine, LLC" in SEO title templates
- "Georgetown, SC" in local SEO defaults
- "Suzuki outboard" service references
- "Boat Maintenance" default categories

### Marine-Specific Types
```typescript
// In types.ts
BlogPostType: 'service_guide' | 'buying_guide' | 'inventory_spotlight' | ...
BlockType: 'related_inventory' | 'specs_table' | 'service_steps' | 'before_after' | ...
BlogCategory: 'Suzuki Outboards' | 'Boat Maintenance' | 'Pre-Owned Buying Tips' | ...
```

### Business-Specific SEO Templates
```typescript
// In seoTypes.ts
SEO_TITLE_TEMPLATES = [
  { pageType: 'inventory', template: '{year} {brand} {model} for Sale in {city} | Thomas Marine, LLC' },
  { pageType: 'service', template: '{serviceName} in {city}, {state} | Thomas Marine, LLC' },
]
```

### Local SEO Defaults
- Primary city: Georgetown, SC
- Service area: South Carolina coastal region
- Brands: Suzuki Outboards
- Business URL references

---

## Known Dependencies

### Required Packages
```json
{
  "@supabase/ssr": "^0.x",
  "@supabase/supabase-js": "^2.x",
  "nanoid": "^5.x",
  "lucide-react": "^0.x",
  "framer-motion": "^11.x",
  "jsdom": "^24.x" // for crawler script
}
```

### Optional Packages
- `resend` - For email functionality
- `zod` - For validation (if used)

---

## Environment Variables Referenced

### Supabase (Required)
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY= # Admin operations only
SUPABASE_DATABASE_URL= # Alternative connection method
```

### Optional
```env
RESEND_API_KEY= # Email sending
SITE_URL= # For SEO crawler
```

---

## Database Tables Referenced

### Supabase Tables
- `blog_studio_posts` - Blog content storage
- `blog_posts` - Legacy blog table
- `careers` - Job postings
- `subscribers` - Email subscriptions
- `reviews` - Testimonials (optional)

### Table Schema Notes
- All tables use snake_case column names
- JSONB columns for flexible content storage
- RLS policies for security
- Timestamps: created_at, updated_at

---

## API Routes Structure

### Blog Studio API
- `GET /api/blog-studio` - List all posts
- `POST /api/blog-studio` - Create new post
- `GET /api/blog-studio/[id]` - Get single post
- `PATCH /api/blog-studio/[id]` - Update post
- `DELETE /api/blog-studio/[id]` - Delete post
- `POST /api/blog-studio/[id]/publish` - Publish post

### Admin API
- `POST /api/admin/blog` - Legacy blog save
- `DELETE /api/admin/blog` - Legacy blog delete
- `POST /api/admin/careers` - Job posting CRUD
- `POST /api/admin/reviews` - Review management

### Auth API
- `POST /api/auth/callback` - OAuth callback
- `POST /api/auth/logout` - Sign out

---

## Warnings for Adaptation Phase

### High Priority Cleanup Needed
1. **Remove all Thomas Marine branding** from UI components
2. **Replace marine-specific block types** with nonprofit-appropriate blocks
3. **Update SEO templates** for nonprofit context
4. **Replace local SEO defaults** with Cleveland, Ohio focus
5. **Simplify blog editor** - may be too complex for initial needs

### Database Schema Considerations
- Review if `blog_studio_posts` table schema fits nonprofit needs
- May need to simplify block structure
- Consider if localStorage-only storage (seoStore.ts) is sufficient initially

### Authentication
- Supabase auth patterns are reusable
- Middleware protection logic is generic
- Will need to set up new Supabase project for Forged

### Security Notes
- All copied API routes include auth checks
- RLS policies assumed but not copied (database-level)
- Service role key usage is properly gated

---

## Safety Confirmation

✅ **No Thomas Marine files were edited during this migration**  
✅ **No production database connections were copied as active secrets**  
✅ **No API keys or secrets were exposed**  
✅ **All copied code is isolated in `/migrations/forged-admin-source/`**  
✅ **Source platform remains fully intact**

---

## Next Steps

See `NEXT_AUDIT_CHECKLIST.md` for detailed adaptation planning.

**Ready for:** Code audit, adaptation, and integration into Forged in the Fire Ohio website.
