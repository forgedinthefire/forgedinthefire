# Supabase Database Setup for Forged in the Fire

## Quick Start

### Option 1: Run Complete Setup (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to "SQL Editor" → "New Query"
3. Copy and paste the entire contents of `setup_all_tables.sql`
4. Click "Run"
5. Done! All tables, indexes, RLS policies, and sample data created.

### Option 2: Run Individual Migrations
If you prefer to run migrations one by one in order:

1. `20240527_blog_studio_schema.sql` - Content/blog table
2. `20240527_subscribers_schema.sql` - Newsletter subscribers
3. `20240527_newsletter_system.sql` - Newsletters and posts
4. `20240528_job_positions_schema.sql` - Career/job postings
5. `20240528_forms_schema.sql` - Contact & volunteer forms

## Tables Created

| Table | Purpose | Public Access |
|-------|---------|---------------|
| `content` | Blog posts & pages | Read (published only) |
| `newsletter_subscribers` | Email subscribers | Create only |
| `newsletters` | Newsletter campaigns | Admin only |
| `newsletter_posts` | Newsletter-post relationships | Admin only |
| `job_positions` | Career listings | Read (active only) |
| `contact_submissions` | Contact form entries | Create only |
| `volunteer_applications` | Volunteer applications | Create only |

## Row Level Security (RLS)

All tables have RLS enabled with these policies:

- **Public (anon)**: Can insert to subscribers, contacts, volunteers. Can read published content and active jobs.
- **Authenticated users**: Full access to all tables (for admin portal).

## Required Environment Variables

In your Vercel project settings, add:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Testing the Setup

### 1. Test Contact Form
```bash
curl -X POST https://forgedinthefireohio.org/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test message with enough length."}'
```

### 2. Test Newsletter Signup
```bash
curl -X POST https://forgedinthefireohio.org/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

### 3. Test Blog API
```bash
curl https://forgedinthefireohio.org/api/admin/content
```

## Troubleshooting

### "Database not configured" error
- Check that all 3 environment variables are set in Vercel
- Verify the values match your Supabase project settings

### "permission denied" error
- RLS policies may not be applied. Re-run the setup SQL.
- Ensure you're using the correct Supabase URL and anon key.

### Missing tables
- Check Supabase Table Editor to see if tables exist
- If not, run the setup SQL again

## Schema Updates

When making changes:
1. Update the appropriate migration file
2. Test in Supabase SQL Editor first
3. Update this README with new fields/policies
