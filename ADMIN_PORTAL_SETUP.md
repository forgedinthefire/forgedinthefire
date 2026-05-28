# Admin Portal Setup Guide

**Status:** Implementation Complete  
**Date:** May 27, 2026  
**Location:** `/app/admin/`

---

## What Was Implemented

### Admin Portal Structure

```
app/
├── admin/
│   ├── layout.tsx           # Admin sidebar with auth protection
│   ├── page.tsx             # Admin dashboard with stats
│   ├── content/
│   │   ├── page.tsx         # Content listing with filters
│   │   ├── new/
│   │   │   └── page.tsx     # Create new content
│   │   └── [id]/
│   │       └── page.tsx     # Edit content with block editor
│   ├── seo/
│   │   └── page.tsx         # SEO health center
│   └── settings/
│       └── page.tsx         # Site settings
│
├── login/
│   └── page.tsx             # Admin login page
│
├── api/
│   ├── auth/
│   │   └── logout/
│   │       └── route.ts     # Logout handler
│   └── admin/
│       └── content/
│           ├── route.ts     # List/Create content
│           └── [id]/
│               ├── route.ts # Get/Update/Delete content
│               └── delete/
│                   └── route.ts # Delete handler
│
├── lib/
│   └── supabase/
│       ├── server.ts        # Server-side Supabase client
│       └── client.ts        # Browser Supabase client
│
├── src/
│   └── features/
│       └── content/
│           ├── types.ts     # Content type definitions
│           └── store.ts     # Content CRUD operations
│
└── middleware.ts            # Auth route protection
```

---

## Features Implemented

### 1. Admin Dashboard
- Overview stats (total content, published, drafts)
- Quick access to management tools
- Quick tips section

### 2. Content Management
- **Content Types:** Blog, Success Story, News, Resource, Event
- **Status States:** Draft, Published, Archived
- **Block Editor:**
  - Hero block (title, subtitle)
  - Text block (rich content)
  - Quote block (with author/role)
  - Image block (with alt text)
  - CTA block (button with URL)
- **SEO Panel:** Title, meta description, keywords, canonical URL, noindex option

### 3. SEO Health Center
- Site-wide SEO audit visualization
- Per-page SEO scores (0-100)
- Health status indicators (green/yellow/red)
- Issue categorization (critical/high/medium/low)
- Expandable page details with specific issues
- Best practices guide for nonprofits

### 4. Authentication
- Supabase auth integration
- Protected admin routes via middleware
- Login/logout functionality
- Email/password authentication

### 5. Settings
- Organization information
- Contact details
- Service area configuration
- Social media links

---

## Required Environment Variables

Add these to your `.env.local` file:

```env
# Supabase (Required for admin portal)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Site URL (for redirects)
NEXT_PUBLIC_SITE_URL=https://www.forgedinthefireohio.org
```

---

## Database Setup

### Supabase Tables

Execute this SQL in your Supabase SQL editor:

```sql
-- Content table
CREATE TABLE content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('blog', 'success_story', 'news', 'resource', 'event')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  excerpt text,
  featured_image text,
  blocks jsonb DEFAULT '[]'::jsonb,
  seo jsonb DEFAULT '{}'::jsonb,
  author_id uuid REFERENCES auth.users(id),
  author_name text,
  published_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public read of published content"
  ON content FOR SELECT
  USING (status = 'published');

CREATE POLICY "Allow admin full access"
  ON content FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Settings table
CREATE TABLE site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT now()
);

-- Insert default settings
INSERT INTO site_settings (key, value) VALUES
  ('general', '{"siteName": "Forged in the Fire", "siteDescription": "Survivor-centered nonprofit"}'::jsonb),
  ('contact', '{"email": "tracys@forgedinthefireohio.org", "phone": "1 216-202-0786"}'::jsonb),
  ('location', '{"city": "Cleveland", "state": "Ohio", "serviceArea": "Northeast Ohio"}'::jsonb);

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## Admin Access Setup

### 1. Create Admin User

In Supabase Dashboard:
1. Go to Authentication → Users
2. Click "Add User"
3. Enter email and password
4. Or use the invite flow

### 2. First Login
1. Navigate to `/login`
2. Enter admin credentials
3. You'll be redirected to `/admin`

---

## Admin Routes

| Route | Description |
|-------|-------------|
| `/login` | Admin login page |
| `/admin` | Dashboard overview |
| `/admin/content` | Content listing |
| `/admin/content/new` | Create content |
| `/admin/content/[id]` | Edit content |
| `/admin/seo` | SEO health center |
| `/admin/settings` | Site settings |

---

## Dependencies Added

```bash
npm install @supabase/ssr @supabase/supabase-js nanoid
```

Already present:
- `lucide-react` (icons)
- `framer-motion` (animations)

---

## Design Notes

### Color Scheme
The admin portal uses the Forged in the Fire brand colors:
- **Background:** `#1E1714` (deep charcoal)
- **Sidebar:** `#1E1714` with `#3A2A24` borders
- **Primary:** `#1E6B73` (teal)
- **Accent:** `#C8A46B` (gold)
- **Text:** `#F6F0E8` (cream), `#CDBDAF` (muted)

### Responsive Design
- Admin portal is desktop-optimized
- Sidebar collapses on mobile (future enhancement)
- Content editor supports all screen sizes

---

## Security Considerations

1. **Authentication Required** - All `/admin/*` routes require login
2. **Middleware Protection** - Server-side auth checks via middleware.ts
3. **RLS Policies** - Database-level access control
4. **API Route Auth** - All admin API endpoints verify user session

---

## Next Steps

### Immediate
1. Set up Supabase project
2. Add environment variables
3. Run database migrations
4. Create admin user
5. Test login flow

### Future Enhancements
- [ ] Image upload integration (Supabase Storage)
- [ ] Rich text editor (TipTap or similar)
- [ ] Content preview before publish
- [ ] SEO crawler automation (scheduled)
- [ ] Analytics dashboard
- [ ] User roles (editor vs admin)
- [ ] Content scheduling
- [ ] Revision history
- [ ] Bulk operations

---

## Testing Checklist

- [ ] Can access `/login`
- [ ] Login redirects to `/admin`
- [ ] `/admin` shows dashboard stats
- [ ] Can create new content
- [ ] Can edit existing content
- [ ] Can publish/unpublish content
- [ ] SEO panel updates correctly
- [ ] Logout works correctly
- [ ] Unauthenticated users redirected to `/login`
- [ ] API routes reject unauthenticated requests

---

## Troubleshooting

### "Unauthorized" errors
- Check Supabase credentials in `.env.local`
- Verify RLS policies are configured
- Ensure user exists in auth.users

### Database errors
- Run SQL migrations in correct order
- Check table names match code references
- Verify column types

### Build errors
- Ensure `@supabase/ssr` is installed
- Check for missing imports
- Verify TypeScript compilation

---

## Files Modified/Created

### New Files (28)
- All files in `/app/admin/`
- All files in `/app/login/`
- All files in `/app/api/admin/`
- All files in `/app/api/auth/`
- All files in `/lib/supabase/`
- All files in `/src/features/content/`
- `/middleware.ts`

### Dependencies
- Added: `@supabase/ssr`, `@supabase/supabase-js`, `nanoid`

---

**Admin portal is ready for testing!** 🎉
