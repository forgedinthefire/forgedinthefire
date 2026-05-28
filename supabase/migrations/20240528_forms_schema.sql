-- Forged in the Fire - Contact and Volunteer Forms Schema
-- Migration: Add tables for contact form and volunteer applications

-- ============================================
-- 1. CREATE CONTACT SUBMISSIONS TABLE
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
-- 2. CREATE VOLUNTEER APPLICATIONS TABLE
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
-- 3. CREATE INDEXES
-- ============================================

-- Contact submissions indexes
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_is_survivor ON contact_submissions(is_survivor);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);

-- Volunteer applications indexes
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_email ON volunteer_applications(email);
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_status ON volunteer_applications(status);
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_role ON volunteer_applications(role);
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_created_at ON volunteer_applications(created_at DESC);

-- ============================================
-- 4. ENABLE ROW LEVEL SECURITY
-- ============================================

-- Contact submissions RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public to create contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Allow admin full access on contacts" ON contact_submissions;

-- Allow public to submit contact forms
CREATE POLICY "Allow public to create contact submissions"
  ON contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow admin full access
CREATE POLICY "Allow admin full access on contacts"
  ON contact_submissions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Volunteer applications RLS
ALTER TABLE volunteer_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public to create volunteer applications" ON volunteer_applications;
DROP POLICY IF EXISTS "Allow admin full access on volunteers" ON volunteer_applications;

-- Allow public to submit volunteer applications
CREATE POLICY "Allow public to create volunteer applications"
  ON volunteer_applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow admin full access
CREATE POLICY "Allow admin full access on volunteers"
  ON volunteer_applications FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 5. AUTO-UPDATE TIMESTAMPS
-- ============================================

-- Contact submissions timestamp
CREATE OR REPLACE FUNCTION update_contact_submission_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_contact_timestamp ON contact_submissions;

CREATE TRIGGER update_contact_timestamp
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_contact_submission_updated_at();

-- Volunteer applications timestamp
CREATE OR REPLACE FUNCTION update_volunteer_application_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_volunteer_timestamp ON volunteer_applications;

CREATE TRIGGER update_volunteer_timestamp
  BEFORE UPDATE ON volunteer_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_volunteer_application_updated_at();

-- ============================================
-- 6. UPDATE NEWSLETTER SUBSCRIBERS WITH PREFERENCES
-- ============================================

-- Add preferences JSONB column if it doesn't exist
ALTER TABLE newsletter_subscribers 
  ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'::jsonb;

-- Update existing subscribers to have default preferences
UPDATE newsletter_subscribers 
  SET preferences = '{"monthly_newsletter": true, "blog_notifications": true, "volunteer_opportunities": false, "donor_updates": false, "community_events": false, "survivor_support": false}'
  WHERE preferences = '{}'::jsonb OR preferences IS NULL;

-- Add index for preferences queries
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_preferences 
  ON newsletter_subscribers USING GIN(preferences);

-- ============================================
-- 7. VIEWS FOR ADMIN DASHBOARD
-- ============================================

-- Pending contact submissions view
CREATE OR REPLACE VIEW pending_contact_submissions AS
SELECT 
  id,
  name,
  email,
  phone,
  subject,
  message,
  is_survivor,
  status,
  created_at
FROM contact_submissions
WHERE status = 'new'
ORDER BY created_at DESC;

-- Pending volunteer applications view
CREATE OR REPLACE VIEW pending_volunteer_applications AS
SELECT 
  id,
  name,
  email,
  phone,
  role,
  message,
  status,
  created_at
FROM volunteer_applications
WHERE status = 'new'
ORDER BY created_at DESC;

-- Submission stats by month
CREATE OR REPLACE VIEW form_submissions_stats AS
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) FILTER (WHERE 'contact'::text = 'contact') as contact_count,
  COUNT(*) FILTER (WHERE 'volunteer'::text = 'volunteer') as volunteer_count
FROM (
  SELECT created_at FROM contact_submissions
  UNION ALL
  SELECT created_at FROM volunteer_applications
) submissions
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- ============================================
-- 8. COMMENTS FOR DOCUMENTATION
-- ============================================

-- Contact submissions comments
COMMENT ON TABLE contact_submissions IS 'Contact form submissions from website visitors';
COMMENT ON COLUMN contact_submissions.name IS 'Optional name of the person submitting';
COMMENT ON COLUMN contact_submissions.email IS 'Email address of the submitter (required)';
COMMENT ON COLUMN contact_submissions.phone IS 'Optional phone number';
COMMENT ON COLUMN contact_submissions.subject IS 'Subject or type of inquiry';
COMMENT ON COLUMN contact_submissions.message IS 'The actual message content (required, min 10 chars)';
COMMENT ON COLUMN contact_submissions.is_survivor IS 'Whether the submitter identifies as a survivor';
COMMENT ON COLUMN contact_submissions.status IS 'Status: new, in_progress, resolved, archived';

-- Volunteer applications comments
COMMENT ON TABLE volunteer_applications IS 'Volunteer applications from website visitors';
COMMENT ON COLUMN volunteer_applications.name IS 'Full name of the applicant (required)';
COMMENT ON COLUMN volunteer_applications.email IS 'Email address of the applicant (required)';
COMMENT ON COLUMN volunteer_applications.phone IS 'Optional phone number';
COMMENT ON COLUMN volunteer_applications.role IS 'Volunteer role they are interested in (required)';
COMMENT ON COLUMN volunteer_applications.message IS 'Message/experience from the applicant (required, min 20 chars)';
COMMENT ON COLUMN volunteer_applications.status IS 'Status: new, reviewed, accepted, declined, archived';
