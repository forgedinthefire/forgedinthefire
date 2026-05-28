-- Forged in the Fire - Blog Studio Database Schema
-- Migration: Add Blog Studio support to existing content table

-- ============================================
-- 1. EXTEND CONTENT TABLE
-- ============================================

-- Add new columns for Blog Studio features
ALTER TABLE content 
  ADD COLUMN IF NOT EXISTS template TEXT DEFAULT 'standard',
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'news',
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS excerpt TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS blocks JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS featured_image JSONB,
  ADD COLUMN IF NOT EXISTS gallery_images JSONB[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS cta JSONB,
  ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS author_name TEXT,
  ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMP WITH TIME ZONE;

-- Add SEO fields
ALTER TABLE content
  ADD COLUMN IF NOT EXISTS seo JSONB DEFAULT '{}'::jsonb;

-- ============================================
-- 2. CREATE INDEXES
-- ============================================

-- For filtering and sorting
CREATE INDEX IF NOT EXISTS idx_content_template ON content(template);
CREATE INDEX IF NOT EXISTS idx_content_category ON content(category);
CREATE INDEX IF NOT EXISTS idx_content_featured ON content(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_content_published_at ON content(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_tags ON content USING GIN(tags);

-- For searching
CREATE INDEX IF NOT EXISTS idx_content_search ON content USING gin(to_tsvector('english', title || ' ' || COALESCE(excerpt, '')));

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read of published content" ON content;
DROP POLICY IF EXISTS "Allow admin full access" ON content;
DROP POLICY IF EXISTS "Allow authenticated users to read own drafts" ON content;

-- Public can read published content
CREATE POLICY "Allow public read of published content"
  ON content FOR SELECT
  USING (status = 'published');

-- Authenticated admins have full access
CREATE POLICY "Allow admin full access"
  ON content FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 4. CREATE HELPER FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS update_content_updated_at ON content;

-- Create trigger
CREATE TRIGGER update_content_updated_at
  BEFORE UPDATE ON content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Convert to lowercase, replace spaces with hyphens, remove special chars
  base_slug := lower(regexp_replace(title, '[^a-zA-Z0-9\s]', '', 'g'));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  
  final_slug := base_slug;
  
  -- Check for uniqueness and append number if needed
  WHILE EXISTS (SELECT 1 FROM content WHERE slug = final_slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. CREATE VIEWS
-- ============================================

-- Published posts view with computed fields
CREATE OR REPLACE VIEW published_posts AS
SELECT 
  id,
  title,
  slug,
  template,
  category,
  tags,
  excerpt,
  blocks,
  featured_image,
  gallery_images,
  cta,
  featured,
  author_name,
  published_at,
  created_at,
  updated_at,
  seo->>'title' as seo_title,
  seo->>'description' as seo_description,
  seo->>'keywords' as seo_keywords,
  seo->>'ogImage' as og_image
FROM content
WHERE status = 'published'
ORDER BY published_at DESC;

-- Posts by category view
CREATE OR REPLACE VIEW posts_by_category AS
SELECT 
  category,
  COUNT(*) as post_count,
  MAX(published_at) as last_published
FROM content
WHERE status = 'published'
GROUP BY category;

-- ============================================
-- 6. CREATE STORED PROCEDURES
-- ============================================

-- Procedure to publish a post
CREATE OR REPLACE FUNCTION publish_post(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE content 
  SET 
    status = 'published',
    published_at = NOW()
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Procedure to duplicate a post
CREATE OR REPLACE FUNCTION duplicate_post(source_id UUID, new_author_id UUID)
RETURNS UUID AS $$
DECLARE
  new_id UUID;
  source_record content%ROWTYPE;
BEGIN
  -- Get source record
  SELECT * INTO source_record FROM content WHERE id = source_id;
  
  -- Create new id
  new_id := gen_random_uuid();
  
  -- Insert duplicate
  INSERT INTO content (
    id, title, slug, type, template, category, tags, 
    excerpt, blocks, featured_image, gallery_images, seo, cta,
    status, featured, author_id, author_name,
    created_at, updated_at
  ) VALUES (
    new_id,
    source_record.title || ' (Copy)',
    source_record.slug || '-copy-' || extract(epoch from now()),
    source_record.type,
    source_record.template,
    source_record.category,
    source_record.tags,
    source_record.excerpt,
    source_record.blocks,
    source_record.featured_image,
    source_record.gallery_images,
    source_record.seo,
    source_record.cta,
    'draft',
    FALSE,
    new_author_id,
    source_record.author_name,
    NOW(),
    NOW()
  );
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. SAMPLE DATA (Optional - remove in production)
-- ============================================

-- Insert a sample blog post for testing
INSERT INTO content (
  id,
  title,
  slug,
  type,
  template,
  category,
  tags,
  excerpt,
  blocks,
  seo,
  cta,
  status,
  featured,
  author_name,
  created_at,
  updated_at,
  published_at
) VALUES (
  gen_random_uuid(),
  'Welcome to Our New Blog',
  'welcome-to-our-new-blog',
  'blog',
  'standard',
  'news',
  ARRAY['announcement', 'blog'],
  'We are excited to launch our new blog to share stories of hope, survivor journeys, and updates from our work.',
  '[
    {"type": "hero", "data": {"title": "Welcome to Our New Blog", "subtitle": "Stories of hope, healing, and transformation"}},
    {"type": "text", "data": {"content": "We are thrilled to launch our new blog as a space to share the incredible stories of survivors, volunteers, and advocates who make our mission possible. Here you will find updates on our work, educational resources, and inspiring journeys of hope and healing."}},
    {"type": "cta", "data": {"text": "Support Our Mission", "url": "/donate", "style": "primary"}}
  ]'::jsonb,
  '{"title": "Welcome to Our New Blog | Forged in the Fire", "description": "Launching our blog to share stories of hope and healing from survivors of human trafficking."}'::jsonb,
  '{"type": "donate", "text": "Support Our Mission", "url": "/donate"}'::jsonb,
  'published',
  TRUE,
  'Forged Team',
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

-- ============================================
-- 8. COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE content IS 'Blog posts and content pages for Forged in the Fire website';
COMMENT ON COLUMN content.template IS 'Post template type: standard, event, impact-story, volunteer-opp, donor-update, resource-guide, partner-spotlight, fundraising';
COMMENT ON COLUMN content.category IS 'Content category: news, events, impact-stories, volunteer, donor-updates, resources, partners, fundraising';
COMMENT ON COLUMN content.blocks IS 'JSON array of content blocks for block-based editor';
COMMENT ON COLUMN content.seo IS 'SEO metadata: title, description, keywords, ogImage, canonicalUrl, noIndex';
COMMENT ON COLUMN content.cta IS 'Call to action: type, text, url';
COMMENT ON COLUMN content.featured IS 'Whether post should be featured on homepage/blog index';
