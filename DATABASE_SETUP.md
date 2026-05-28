# Database Setup Guide - Forged Blog Studio

This guide walks you through setting up the Supabase database for the Blog Studio feature.

## Prerequisites

- Supabase project created
- `content` table already exists (from initial setup)
- Admin access to Supabase SQL Editor

## Setup Steps

### 1. Apply Schema Migration

Run the schema migration in Supabase SQL Editor:

```sql
-- File: supabase/migrations/20240527_blog_studio_schema.sql
```

This adds:
- New columns to `content` table (template, category, blocks, etc.)
- Indexes for performance
- Row Level Security policies
- Helper functions and triggers

### 2. Apply API Functions Migration

Run the API migration:

```sql
-- File: supabase/migrations/20240527_api_routes.sql
```

This creates:
- Database functions for CRUD operations
- Search functionality
- Statistics aggregation
- Permission grants

### 3. Verify Setup

Run this query to confirm everything is working:

```sql
-- Check columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'content' 
ORDER BY ordinal_position;

-- Should show: template, category, tags, excerpt, blocks, featured_image, 
-- gallery_images, seo, cta, featured, author_name, author_id, published_at, scheduled_for

-- Check functions exist
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%blog%';

-- Check RLS policies
SELECT policyname 
FROM pg_policies 
WHERE tablename = 'content';
```

### 4. Test Data Insertion

Test creating a blog post:

```sql
SELECT create_blog_post(
  'Test Blog Post',
  'test-blog-post',
  'standard',
  'news',
  'This is a test excerpt',
  '[{"type": "hero", "data": {"title": "Test Post"}}, {"type": "text", "data": {"content": "Test content"}}]'::jsonb,
  '{"title": "Test | Forged", "description": "Test description"}'::jsonb,
  '{"type": "donate", "text": "Donate", "url": "/donate"}'::jsonb
);
```

Verify it was created:

```sql
SELECT * FROM content WHERE slug = 'test-blog-post';
```

### 5. API Route Configuration

Your Next.js API routes should now work with the database. The routes are:

| Route | Method | Description |
|-------|--------|-------------|
| `/api/admin/content` | GET | List all content |
| `/api/admin/content` | POST | Create new content |
| `/api/admin/content/[id]` | GET | Get single item |
| `/api/admin/content/[id]` | PATCH | Update content |
| `/api/admin/content/[id]` | DELETE | Delete content |

### 6. Environment Variables

Ensure these are in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Database Schema

### Content Table Structure

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `title` | TEXT | Post title |
| `slug` | TEXT | URL-friendly identifier |
| `type` | TEXT | Content type ('blog', 'page') |
| `template` | TEXT | Post template ('standard', 'event', etc.) |
| `category` | TEXT | Content category ('news', 'events', etc.) |
| `tags` | TEXT[] | Array of tags |
| `excerpt` | TEXT | Short summary |
| `blocks` | JSONB | Block editor content |
| `featured_image` | JSONB | Main image with alt text |
| `gallery_images` | JSONB[] | Array of gallery images |
| `seo` | JSONB | SEO metadata |
| `cta` | JSONB | Call to action |
| `status` | TEXT | 'draft', 'published', 'archived' |
| `featured` | BOOLEAN | Highlight on homepage |
| `author_name` | TEXT | Display name |
| `author_id` | UUID | Reference to auth.users |
| `published_at` | TIMESTAMPTZ | Publication date |
| `created_at` | TIMESTAMPTZ | Creation date |
| `updated_at` | TIMESTAMPTZ | Last modified |

### Available Functions

| Function | Purpose |
|----------|---------|
| `get_blog_posts()` | List posts with filters |
| `get_blog_post_by_slug()` | Get single post |
| `get_related_posts()` | Find related content |
| `create_blog_post()` | Create new post |
| `update_blog_post()` | Update existing |
| `search_blog_posts()` | Full-text search |
| `get_category_counts()` | Category statistics |
| `get_blog_stats()` | Overall statistics |
| `duplicate_post()` | Clone existing post |
| `publish_post()` | Publish a draft |

## Troubleshooting

### Issue: "Column does not exist"
**Solution:** Run the schema migration again, ensure it completes without errors.

### Issue: "Function does not exist"
**Solution:** Run the API routes migration, verify no errors in Supabase logs.

### Issue: "Permission denied"
**Solution:** Check RLS policies are enabled. Verify user is authenticated for admin operations.

### Issue: "Slug already exists"
**Solution:** The slug must be unique. The generate_slug() function handles this automatically.

## Maintenance

### Regular Tasks

1. **Archive Old Posts** (yearly)
```sql
SELECT archive_old_posts(365);  -- Archives posts older than 1 year
```

2. **Update Search Index** (if needed)
```sql
REINDEX INDEX idx_content_search;
```

3. **Check Statistics**
```sql
SELECT * FROM get_blog_stats();
```

## Next Steps

1. ✅ Database schema applied
2. ✅ API functions created
3. ✅ RLS policies configured
4. ✅ Sample data inserted (optional)
5. 🔄 Test admin panel: `/admin/blog`
6. 🔄 Test public blog: `/blog`
7. 🔄 Create first real post

**Database is ready for the Blog Studio!** 🎉
