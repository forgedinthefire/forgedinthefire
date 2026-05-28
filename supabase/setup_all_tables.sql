-- =====================================================
-- FORGED IN THE FIRE - COMPLETE SUPABASE SETUP
-- Run this in the Supabase SQL Editor (New Query)
-- =====================================================

-- ============================================
-- BASE CONTENT TABLE (if not exists)
-- ============================================

CREATE TABLE IF NOT EXISTS content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type TEXT DEFAULT 'blog',
  template TEXT DEFAULT 'standard',
  category TEXT DEFAULT 'news',
  tags TEXT[] DEFAULT '{}',
  excerpt TEXT DEFAULT '',
  blocks JSONB DEFAULT '[]'::jsonb,
  featured_image JSONB,
  gallery_images JSONB[] DEFAULT '{}',
  seo JSONB DEFAULT '{}'::jsonb,
  cta JSONB,
  status TEXT DEFAULT 'draft',
  featured BOOLEAN DEFAULT FALSE,
  author_name TEXT,
  author_id UUID REFERENCES auth.users(id),
  published_at TIMESTAMP WITH TIME ZONE,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  phone TEXT,
  interest TEXT DEFAULT 'general',
  source TEXT DEFAULT 'website',
  status TEXT DEFAULT 'active',
  preferences JSONB DEFAULT '{"monthly_newsletter": true, "blog_notifications": true, "volunteer_opportunities": false, "donor_updates": false, "community_events": false, "survivor_support": false}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- NEWSLETTERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS newsletters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  intro_message TEXT,
  closing_message TEXT,
  status TEXT DEFAULT 'draft',
  sent_at TIMESTAMP WITH TIME ZONE,
  sent_count INTEGER DEFAULT 0,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- NEWSLETTER POSTS JOIN TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS newsletter_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  newsletter_id UUID NOT NULL REFERENCES newsletters(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- JOB POSITIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS job_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type TEXT DEFAULT 'Full-Time',
  description TEXT NOT NULL,
  duties TEXT,
  requirements TEXT,
  pay_range TEXT,
  location TEXT DEFAULT 'Cleveland, OH',
  active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CONTACT SUBMISSIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT DEFAULT 'General Inquiry',
  message TEXT NOT NULL,
  is_survivor BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- VOLUNTEER APPLICATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS volunteer_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================

ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_applications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CONTENT TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Allow public read of published content" ON content;
DROP POLICY IF EXISTS "Allow admin full access on content" ON content;

CREATE POLICY "Allow public read of published content"
  ON content FOR SELECT
  USING (status = 'published');

CREATE POLICY "Allow admin full access on content"
  ON content FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- NEWSLETTER SUBSCRIBERS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Allow public to create subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow public to check existing subscriber" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow admin full access on subscribers" ON newsletter_subscribers;

CREATE POLICY "Allow public to create subscribers"
  ON newsletter_subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public to check existing subscriber"
  ON newsletter_subscribers FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow admin full access on subscribers"
  ON newsletter_subscribers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- NEWSLETTERS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Allow admin full access on newsletters" ON newsletters;

CREATE POLICY "Allow admin full access on newsletters"
  ON newsletters FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- NEWSLETTER POSTS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Allow admin full access on newsletter_posts" ON newsletter_posts;

CREATE POLICY "Allow admin full access on newsletter_posts"
  ON newsletter_posts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- JOB POSITIONS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Allow public read of active positions" ON job_positions;
DROP POLICY IF EXISTS "Allow admin full access on jobs" ON job_positions;

CREATE POLICY "Allow public read of active positions"
  ON job_positions FOR SELECT
  USING (active = TRUE);

CREATE POLICY "Allow admin full access on jobs"
  ON job_positions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- CONTACT SUBMISSIONS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Allow public to create contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Allow admin full access on contacts" ON contact_submissions;

CREATE POLICY "Allow public to create contact submissions"
  ON contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow admin full access on contacts"
  ON contact_submissions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- VOLUNTEER APPLICATIONS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Allow public to create volunteer applications" ON volunteer_applications;
DROP POLICY IF EXISTS "Allow admin full access on volunteers" ON volunteer_applications;

CREATE POLICY "Allow public to create volunteer applications"
  ON volunteer_applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow admin full access on volunteers"
  ON volunteer_applications FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- INDEXES
-- ============================================

-- Content indexes
CREATE INDEX IF NOT EXISTS idx_content_slug ON content(slug);
CREATE INDEX IF NOT EXISTS idx_content_status ON content(status);
CREATE INDEX IF NOT EXISTS idx_content_published ON content(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_template ON content(template);
CREATE INDEX IF NOT EXISTS idx_content_category ON content(category);
CREATE INDEX IF NOT EXISTS idx_content_featured ON content(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_content_published_at ON content(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_tags ON content USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_content_author ON content(author_id);

-- Newsletter subscribers indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_created_at ON newsletter_subscribers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_preferences ON newsletter_subscribers USING GIN(preferences);

-- Newsletters indexes
CREATE INDEX IF NOT EXISTS idx_newsletters_status ON newsletters(status);
CREATE INDEX IF NOT EXISTS idx_newsletters_year_month ON newsletters(year, month);
CREATE INDEX IF NOT EXISTS idx_newsletters_created_at ON newsletters(created_at DESC);

-- Newsletter posts indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_posts_newsletter_id ON newsletter_posts(newsletter_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_posts_post_id ON newsletter_posts(post_id);

-- Job positions indexes
CREATE INDEX IF NOT EXISTS idx_job_positions_slug ON job_positions(slug);
CREATE INDEX IF NOT EXISTS idx_job_positions_active ON job_positions(active) WHERE active = TRUE;
CREATE INDEX IF NOT EXISTS idx_job_positions_sort_order ON job_positions(sort_order);

-- Contact submissions indexes
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);

-- Volunteer applications indexes
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_email ON volunteer_applications(email);
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_status ON volunteer_applications(status);
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_role ON volunteer_applications(role);
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_created_at ON volunteer_applications(created_at DESC);

-- ============================================
-- AUTO-UPDATE FUNCTIONS AND TRIGGERS
-- ============================================

-- Generic updated_at function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables
DROP TRIGGER IF EXISTS update_content_timestamp ON content;
DROP TRIGGER IF EXISTS update_newsletter_subscribers_timestamp ON newsletter_subscribers;
DROP TRIGGER IF EXISTS update_newsletters_timestamp ON newsletters;
DROP TRIGGER IF EXISTS update_job_positions_timestamp ON job_positions;
DROP TRIGGER IF EXISTS update_contact_submissions_timestamp ON contact_submissions;
DROP TRIGGER IF EXISTS update_volunteer_applications_timestamp ON volunteer_applications;

CREATE TRIGGER update_content_timestamp
  BEFORE UPDATE ON content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_subscribers_timestamp
  BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletters_timestamp
  BEFORE UPDATE ON newsletters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_positions_timestamp
  BEFORE UPDATE ON job_positions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_submissions_timestamp
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_volunteer_applications_timestamp
  BEFORE UPDATE ON volunteer_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  base_slug := lower(regexp_replace(title, '[^a-zA-Z0-9\s]', '', 'g'));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  final_slug := base_slug;
  
  WHILE EXISTS (SELECT 1 FROM content WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Generate job slug
CREATE OR REPLACE FUNCTION generate_job_slug(p_title TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  base_slug := lower(regexp_replace(p_title, '[^a-zA-Z0-9\s]', '', 'g'));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  final_slug := base_slug;
  
  WHILE EXISTS (SELECT 1 FROM job_positions WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Publish post function
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

-- ============================================
-- VIEWS
-- ============================================

-- Published posts view
CREATE OR REPLACE VIEW published_posts AS
SELECT 
  id, title, slug, template, category, tags, excerpt, 
  blocks, featured_image, gallery_images, cta, featured,
  author_name, published_at, created_at, updated_at
FROM content
WHERE status = 'published'
ORDER BY published_at DESC;

-- Pending contact submissions
CREATE OR REPLACE VIEW pending_contacts AS
SELECT * FROM contact_submissions
WHERE status = 'new'
ORDER BY created_at DESC;

-- Pending volunteer applications
CREATE OR REPLACE VIEW pending_volunteers AS
SELECT * FROM volunteer_applications
WHERE status = 'new'
ORDER BY created_at DESC;

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Sample blog post
INSERT INTO content (
  id, title, slug, type, template, category, tags, excerpt,
  status, featured, author_name, published_at, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Welcome to Our Blog',
  'welcome-to-our-blog',
  'blog',
  'standard',
  'news',
  ARRAY['welcome', 'news'],
  'Welcome to the Forged in the Fire blog. Here you will find updates on our work, survivor stories, and resources.',
  'published',
  TRUE,
  'Admin',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (slug) DO NOTHING;

-- Sample job position
INSERT INTO job_positions (
  id, title, slug, type, description, duties, requirements, 
  pay_range, location, active, sort_order, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Victim Advocate',
  'victim-advocate',
  'Full-Time',
  'Provide comprehensive support and advocacy services to survivors of human trafficking.',
  '- Conduct intake assessments and develop individual service plans
- Provide crisis intervention and emotional support
- Connect survivors with housing, legal, and healthcare resources',
  '- Bachelor degree in Social Work or related field
- 2+ years experience with trauma-informed care
- Strong communication and organizational skills',
  '$45,000 - $55,000 per year',
  'Cleveland, OH',
  TRUE,
  1,
  NOW(),
  NOW()
) ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

SELECT '✅ All tables created successfully!' as status;
