-- Forged in the Fire - Newsletter Subscribers Schema

-- ============================================
-- 1. CREATE NEWSLETTER SUBSCRIBERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  interest TEXT DEFAULT 'general',
  source TEXT DEFAULT 'website',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraint on email
  CONSTRAINT unique_email UNIQUE (email)
);

-- ============================================
-- 2. CREATE INDEXES
-- ============================================

CREATE INDEX idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_subscribers_status ON newsletter_subscribers(status);
CREATE INDEX idx_newsletter_subscribers_interest ON newsletter_subscribers(interest);
CREATE INDEX idx_newsletter_subscribers_created_at ON newsletter_subscribers(created_at DESC);

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public to create subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow public to check existing" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow admin full access" ON newsletter_subscribers;

-- Allow public to subscribe (create)
CREATE POLICY "Allow public to create subscribers"
  ON newsletter_subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow public to check if email exists (for duplicate prevention)
CREATE POLICY "Allow public to check existing"
  ON newsletter_subscribers FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow admin full access
CREATE POLICY "Allow admin full access"
  ON newsletter_subscribers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 4. AUTO-UPDATE TIMESTAMP
-- ============================================

CREATE OR REPLACE FUNCTION update_subscriber_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_subscriber_timestamp ON newsletter_subscribers;

CREATE TRIGGER update_subscriber_timestamp
  BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_subscriber_updated_at();

-- ============================================
-- 5. COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE newsletter_subscribers IS 'Newsletter subscribers for Forged in the Fire email updates';
COMMENT ON COLUMN newsletter_subscribers.email IS 'Subscriber email address (unique)';
COMMENT ON COLUMN newsletter_subscribers.name IS 'Optional subscriber name';
COMMENT ON COLUMN newsletter_subscribers.phone IS 'Optional phone number';
COMMENT ON COLUMN newsletter_subscribers.interest IS 'Interest category: survivor-support, volunteer, donor-updates, community-events, general';
COMMENT ON COLUMN newsletter_subscribers.source IS 'Where the subscriber came from (website, event, etc.)';
COMMENT ON COLUMN newsletter_subscribers.status IS 'Subscriber status: active, unsubscribed, bounced';

-- ============================================
-- 6. SAMPLE DATA (Optional - remove in production)
-- ============================================

-- Insert a sample subscriber for testing
INSERT INTO newsletter_subscribers (
  id,
  email,
  name,
  phone,
  interest,
  source,
  status,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'sample@example.com',
  'Sample Subscriber',
  '(555) 123-4567',
  'general',
  'website',
  'active',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;
