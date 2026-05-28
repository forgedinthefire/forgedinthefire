# Next Phase: Audit & Adaptation Checklist

**Phase:** Post-Migration Code Review & Adaptation  
**Target:** Forged in the Fire Ohio (Nonprofit Website)  
**Goal:** Transform Thomas Marine admin code into nonprofit-appropriate CMS

---

## 1. Blog Studio Adaptation

### Architecture Review
- [ ] Evaluate if full block-based editor is needed for MVP
- [ ] Consider simplifying to markdown + basic blocks (hero, text, image, CTA)
- [ ] Assess need for "related inventory", "specs table", "service steps" blocks
- [ ] Decide on keeping or removing video embed capabilities
- [ ] Review template system complexity

### Type Definitions Cleanup
- [ ] Remove marine-specific `BlogPostType` variants:
  - `inventory_spotlight`
  - `service_guide`
  - `buying_guide`
  - `before_after_story`
- [ ] Add nonprofit-appropriate types:
  - `news_article`
  - `success_story`
  - `resource_guide`
  - `event_announcement`
  - `advocacy_update`

### Block Registry Cleanup
- [ ] Remove marine-specific blocks:
  - `related_inventory`
  - `specs_table`
  - `service_steps`
  - `before_after`
  - `service_callout`
  - `comparison_table` (may keep for resource comparisons)
- [ ] Keep and rename useful blocks:
  - `hero` → keep as-is
  - `rich_text` → keep as-is
  - `image_text` → keep as-is
  - `quote` → keep as-is
  - `team_member` → rename to `advocate_profile`
  - `cta` → keep as-is
  - `faq` → keep as-is
  - `gallery` → keep as-is

### Default Content Updates
- [ ] Replace marine categories with nonprofit categories:
  - Remove: 'Suzuki Outboards', 'Boat Maintenance', etc.
  - Add: 'Survivor Stories', 'Advocacy News', 'Resource Guides', 'Events', 'Education'
- [ ] Update default SEO templates:
  - Replace "Thomas Marine, LLC" with "Forged in the Fire"
  - Replace "Georgetown, SC" with "Cleveland, Ohio"
  - Update title patterns for nonprofit context

### UI Component Cleanup
- [ ] Remove "Thomas Marine" branding from:
  - `BlogStudioDashboard.tsx`
  - `BlogPostEditor.tsx`
  - `SimpleBlogEditor.tsx`
  - `BlogPublishingChecklist.tsx`
  - `BlogTemplatePicker.tsx`
- [ ] Update color scheme from navy/gold to Forged brand colors
- [ ] Replace marine imagery references

---

## 2. SEO Health Checker Adaptation

### Type Definitions
- [ ] Update `SEOPageType` to remove marine-specific types:
  - Remove: `inventory`, `service` (as distinct types)
  - Keep: `core`, `blog`, `landing`
  - Add: `resource`, `advocacy`, `event`
- [ ] Update `SEO_TITLE_TEMPLATES`:
  - Remove inventory and service templates
  - Create nonprofit-appropriate templates
  - Update location references to Cleveland/Northeast Ohio

### Local SEO Configuration
- [ ] Replace Georgetown, SC references:
  - Primary city: Cleveland, Ohio
  - Service area: Cuyahoga County, Northeast Ohio
  - State: Ohio
  - Remove marine-specific service phrases
- [ ] Add nonprofit-specific local phrases:
  - "Human trafficking advocacy Cleveland"
  - "Survivor support Northeast Ohio"
  - "Victim advocacy Cuyahoga County"

### Mock Data Replacement
- [ ] Replace `seoMockData.ts` content:
  - Remove all Thomas Marine page references
  - Create Forged in the Fire page structure
  - Update URLs to forgedinthefireohio.org

### UI Updates
- [ ] Remove "Thomas Marine" from `SEODashboard.tsx`
- [ ] Update health score calculations if needed
- [ ] Keep all generic SEO checking logic (titles, meta, headings, alt text)

---

## 3. Careers Adaptation

### Assessment
- [ ] Evaluate if job board functionality is needed for nonprofit
- [ ] May repurpose for:
  - Volunteer opportunities
  - Internship postings
  - Staff positions
  - Board member recruitment
- [ ] Or remove entirely if not needed

### If Keeping
- [ ] Rename "Careers" to "Opportunities" or "Join Our Team"
- [ ] Update job posting fields for nonprofit context
- [ ] Remove marine-specific job categories
- [ ] Add volunteer-specific fields

---

## 4. Subscriber Management Adaptation

### Assessment
- [ ] Determine email subscription needs:
  - Newsletter subscribers
  - Volunteer interest list
  - Donor updates
  - Event notifications
- [ ] May need multiple subscription types

### If Keeping
- [ ] Rename "Subscribers" to "Contacts" or "Supporters"
- [ ] Add segmentation capabilities
- [ ] Update subscription forms for nonprofit context
- [ ] Ensure compliance with nonprofit email regulations

---

## 5. Admin Authentication Review

### Supabase Setup
- [ ] Create new Supabase project for Forged in the Fire
- [ ] Set up authentication tables
- [ ] Configure RLS policies for admin access
- [ ] Set up environment variables:
  ```
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  ```

### Middleware Adaptation
- [ ] Review `middleware.ts` protection logic
- [ ] Confirm `/admin` route protection is sufficient
- [ ] Test redirect behavior (login → admin, admin → login if not auth)

### Admin Layout Updates
- [ ] Remove "Thomas Marine" branding from sidebar
- [ ] Update navigation items for nonprofit needs:
  - Keep: Dashboard, Blog, SEO
  - Remove: Inventory, Service Requests, Part Reservations, Promotions, Pixel
  - Evaluate: Careers, Subscribers, Social, Reviews
  - Add: Resources, Events, Donations (if applicable)

---

## 6. Database Schema Review

### Blog Posts Table
```sql
-- Review if this schema fits nonprofit needs:
CREATE TABLE blog_studio_posts (
  id uuid PRIMARY KEY,
  title text,
  slug text UNIQUE,
  subtitle text,
  excerpt text,
  post_type text, -- Change enum values
  category text,  -- Change enum values
  tags text[],
  featured_image jsonb,
  gallery_images jsonb[],
  blocks jsonb,   -- Simplify if needed
  related_service_ids text[], -- May remove
  related_inventory_ids text[], -- Remove
  seo jsonb,
  design jsonb,
  status text, -- draft, published, archived
  featured boolean,
  show_on_homepage boolean,
  show_on_blog_page boolean,
  author_name text,
  published_at timestamp,
  scheduled_for timestamp,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);
```

### Simplification Options
- [ ] Consider flattening blocks to simpler structure
- [ ] Remove `related_service_ids` and `related_inventory_ids`
- [ ] Simplify `design` JSONB if not needed
- [ ] Add nonprofit-specific fields:
  - `is_success_story` boolean
  - `advocacy_focus` text
  - `survivor_testimonial` boolean (with consent tracking)

### SEO Tables
- [ ] Evaluate if `seo_page_settings` table is needed
- [ ] Or keep using localStorage approach (seoStore.ts)
- [ ] Consider adding `seo_audit_history` table

---

## 7. API Route Cleanup

### Route Structure
```
/api/
  /content/          # Renamed from /blog-studio
    route.ts         # List, create
    /[id]/
      route.ts       # Get, update, delete
      /publish
        route.ts     # Publish post
  /admin/
    /content/        # Legacy support or remove
      route.ts
    /opportunities/  # Renamed from /careers
      route.ts
    /contacts/       # Renamed from /subscribers
      route.ts
```

### Updates Needed
- [ ] Rename `/api/blog-studio` to `/api/content` or `/api/blog`
- [ ] Update all imports in API routes
- [ ] Verify auth checks are working
- [ ] Test all CRUD operations

---

## 8. Branding Cleanup

### Global Search & Replace
Search for and update:
- [ ] "Thomas Marine" → "Forged in the Fire"
- [ ] "Georgetown" → "Cleveland"
- [ ] "South Carolina" → "Ohio"
- [ ] "thomas-marine" → "forged-in-the-fire"
- [ ] "suzuki" → remove or replace
- [ ] "boat" → remove or replace appropriately
- [ ] "marine" → remove or replace appropriately

### Color Scheme Updates
Thomas Marine → Forged in the Fire:
- [ ] Navy `#0d2b55`, `#081d3a` → Deep Charcoal `#111111`
- [ ] Gold `#c9a84c` → Warm Gold `#C8A46B` or Soft Ember `#D97706`
- [ ] Replace with Forged brand colors from main site

### Logo & Imagery
- [ ] Remove Thomas Marine logo references
- [ ] Use Forged in the Fire logo
- [ ] Update all placeholder images

---

## 9. Route Planning

### Admin Routes
```
/admin                    # Dashboard
/admin/content            # Content management (blog + pages)
/admin/content/new        # Create new content
/admin/content/[id]       # Edit content
/admin/seo                # SEO health center
/admin/seo/audit          # Run new audit
/admin/opportunities      # Jobs/volunteers (optional)
/admin/contacts           # Subscribers/supporters (optional)
/admin/settings           # Site settings
```

### Content Display Routes
```
/blog                     # Blog listing
/blog/[slug]              # Individual post
/resources                # Resources hub
/resources/[category]     # Resource categories
```

---

## 10. Smoke Testing

### Pre-Flight Checks
- [ ] All TypeScript compiles without errors
- [ ] No missing imports
- [ ] No Thomas Marine references in user-facing UI
- [ ] Environment variables configured
- [ ] Database tables created

### Authentication Tests
- [ ] Can access /login
- [ ] Redirects to /admin after login
- [ ] /admin redirects to /login if not authenticated
- [ ] Can logout successfully

### Blog Studio Tests
- [ ] Can create new post
- [ ] Can edit existing post
- [ ] Can save draft
- [ ] Can publish post
- [ ] Can delete post
- [ ] Autosave works
- [ ] Preview works
- [ ] All block types render correctly

### SEO Center Tests
- [ ] Dashboard loads with page list
- [ ] Can edit page SEO settings
- [ ] Health scores calculate correctly
- [ ] Can run SEO crawler
- [ ] Audit results display correctly

### API Tests
- [ ] All GET endpoints return data
- [ ] All POST endpoints create data
- [ ] All PATCH endpoints update data
- [ ] All DELETE endpoints remove data
- [ ] Auth rejected without valid session

---

## Implementation Priority

### Phase 1: Foundation (Week 1)
1. Set up Supabase project
2. Update auth/middleware
3. Clean admin layout
4. Basic blog functionality

### Phase 2: Content Management (Week 2)
1. Simplify blog editor
2. Create nonprofit block types
3. Update categories/types
4. Test content CRUD

### Phase 3: SEO Tools (Week 3)
1. Adapt SEO types
2. Update local SEO config
3. Test SEO dashboard
4. Run crawler

### Phase 4: Polish (Week 4)
1. Full branding cleanup
2. Comprehensive testing
3. Documentation
4. Launch

---

## Decision Points

### Keep vs Remove vs Simplify

| Feature | Recommendation | Rationale |
|---------|---------------|-----------|
| Full block editor | **Simplify** | Too complex for MVP, use markdown + basic blocks |
| Careers | **Repurpose** | Convert to volunteer opportunities |
| Subscribers | **Keep** | Useful for newsletter |
| SEO Dashboard | **Keep** | Essential for nonprofit visibility |
| SEO Crawler | **Keep** | Valuable for maintaining site health |
| Social Publisher | **Remove** | Not needed for MVP |
| Reviews | **Remove** | May add later as testimonials |

### Simplification Strategy

**Blog Editor MVP:**
- Hero block (title, subtitle, image)
- Rich text block (markdown)
- Image block
- Quote block
- CTA block
- FAQ block

**Full Editor (Future):**
- All current blocks
- Gallery block
- Video block
- Team/Advocate profiles

---

## Success Criteria

- [ ] Admin portal accessible only to authenticated users
- [ ] Blog posts can be created, edited, published
- [ ] SEO health checker runs and reports issues
- [ ] No Thomas Marine branding visible
- [ ] All routes use forgedinthefireohio.org context
- [ ] Code is maintainable and documented
- [ ] No console errors
- [ ] Mobile-responsive admin interface

---

## Notes for Developer

1. **Preserve architecture patterns** - The store patterns, API patterns, and component structures are well-designed
2. **Don't over-engineer** - Nonprofit needs are simpler than marine dealership
3. **Keep it generic** - Make code reusable for future nonprofits
4. **Test early and often** - Don't wait until end to test auth and API routes
5. **Document changes** - Keep notes on what was adapted for future reference
