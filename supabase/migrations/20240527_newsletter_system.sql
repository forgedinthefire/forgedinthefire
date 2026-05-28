-- Forged in the Fire - Extended Newsletter and Subscriber System
-- Migration: Add newsletter support, subscriber preferences, and email logging

-- ============================================
-- 1. EXTEND NEWSLETTER_SUBSCRIBERS TABLE
-- ============================================

-- Add preferences JSON column and unsubscribe token
ALTER TABLE newsletter_subscribers 
  ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{"monthly_newsletter": true, "blog_notifications": true, "volunteer_opportunities": false, "donor_updates": false, "community_events": false, "survivor_support": false}'::jsonb,
  ADD COLUMN IF NOT EXISTS unsubscribe_token UUID DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create index on unsubscribe token for quick lookup
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_token ON newsletter_subscribers(unsubscribe_token);

-- ============================================
-- 2. EXTEND CONTENT TABLE (Blog Posts)
-- ============================================

-- Add newsletter and notification fields
ALTER TABLE content 
  ADD COLUMN IF NOT EXISTS send_blog_notification BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS notification_sent_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS email_subject TEXT,
  ADD COLUMN IF NOT EXISTS email_excerpt TEXT,
  ADD COLUMN IF NOT EXISTS include_in_newsletter BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS featured_in_newsletter BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS newsletter_category TEXT;

-- Create indexes for newsletter queries
CREATE INDEX IF NOT EXISTS idx_content_include_in_newsletter ON content(include_in_newsletter) WHERE include_in_newsletter = TRUE;
CREATE INDEX IF NOT EXISTS idx_content_featured_in_newsletter ON content(featured_in_newsletter) WHERE featured_in_newsletter = TRUE;
CREATE INDEX IF NOT EXISTS idx_content_notification_sent ON content(notification_sent_at);

-- ============================================
-- 3. CREATE NEWSLETTERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS newsletters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  intro_message TEXT,
  closing_message TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent')),
  scheduled_send_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  recipient_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_newsletters_status ON newsletters(status);
CREATE INDEX IF NOT EXISTS idx_newsletters_month_year ON newsletters(month, year);
CREATE INDEX IF NOT EXISTS idx_newsletters_scheduled ON newsletters(scheduled_send_at) WHERE status = 'scheduled';

-- ============================================
-- 4. CREATE NEWSLETTER_POSTS TABLE (Junction)
-- ============================================

CREATE TABLE IF NOT EXISTS newsletter_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  newsletter_id UUID NOT NULL REFERENCES newsletters(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique combinations
  CONSTRAINT unique_newsletter_post UNIQUE (newsletter_id, post_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_posts_newsletter_id ON newsletter_posts(newsletter_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_posts_post_id ON newsletter_posts(post_id);

-- ============================================
-- 5. CREATE EMAIL_LOGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_type TEXT NOT NULL CHECK (email_type IN ('blog_notification', 'monthly_newsletter', 'test_email', 'welcome')),
  subscriber_id UUID REFERENCES newsletter_subscribers(id) ON DELETE SET NULL,
  recipient_email TEXT NOT NULL,
  related_blog_post_id UUID REFERENCES content(id) ON DELETE SET NULL,
  related_newsletter_id UUID REFERENCES newsletters(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'failed', 'skipped')),
  provider_response TEXT,
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_email_logs_type ON email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_subscriber ON email_logs(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_blog_post ON email_logs(related_blog_post_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_newsletter ON email_logs(related_newsletter_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_created ON email_logs(created_at DESC);

-- ============================================
-- 6. ENABLE ROW LEVEL SECURITY
-- ============================================

-- Newsletters table
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow admin full access newsletters" ON newsletters;
DROP POLICY IF EXISTS "Allow admin full access newsletter_posts" ON newsletter_posts;
DROP POLICY IF EXISTS "Allow admin full access email_logs" ON email_logs;

-- Admin policies
CREATE POLICY "Allow admin full access newsletters"
  ON newsletters FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow admin full access newsletter_posts"
  ON newsletter_posts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow admin full access email_logs"
  ON email_logs FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 7. CREATE TRIGGERS FOR UPDATED_AT
-- ============================================

-- Trigger for newsletters
DROP TRIGGER IF EXISTS update_newsletters_timestamp ON newsletters;
CREATE TRIGGER update_newsletters_timestamp
  BEFORE UPDATE ON newsletters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for newsletter_subscribers (preferences updates)
DROP TRIGGER IF EXISTS update_subscribers_timestamp ON newsletter_subscribers;
CREATE TRIGGER update_subscribers_timestamp
  BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 8. CREATE HELPER FUNCTIONS
-- ============================================

-- Function to get subscribers by preference
CREATE OR REPLACE FUNCTION get_subscribers_by_preference(p_preference TEXT)
RETURNS TABLE (
  id UUID,
  email TEXT,
  name TEXT,
  unsubscribe_token UUID
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.email,
    s.name,
    s.unsubscribe_token
  FROM newsletter_subscribers s
  WHERE s.status = 'active'
    AND (s.preferences->>p_preference)::boolean = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get posts for newsletter
CREATE OR REPLACE FUNCTION get_posts_for_newsletter(p_newsletter_id UUID)
RETURNS TABLE (
  post_id UUID,
  title TEXT,
  slug TEXT,
  excerpt TEXT,
  featured_image JSONB,
  featured_in_newsletter BOOLEAN,
  newsletter_category TEXT,
  sort_order INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id as post_id,
    c.title,
    c.slug,
    c.excerpt,
    c.featured_image,
    c.featured_in_newsletter,
    c.newsletter_category,
    np.sort_order
  FROM newsletter_posts np
  JOIN content c ON c.id = np.post_id
  WHERE np.newsletter_id = p_newsletter_id
  ORDER BY np.sort_order, c.featured_in_newsletter DESC, c.published_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if email was already sent for blog post
CREATE OR REPLACE FUNCTION was_blog_notification_sent(p_post_id UUID, p_subscriber_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM email_logs
  WHERE related_blog_post_id = p_post_id
    AND subscriber_id = p_subscriber_id
    AND email_type = 'blog_notification'
    AND status = 'sent';
  
  RETURN v_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark blog notification as sent
CREATE OR REPLACE FUNCTION mark_blog_notification_sent(p_post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE content 
  SET notification_sent_at = NOW()
  WHERE id = p_post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 9. GRANT PERMISSIONS
-- ============================================

GRANT EXECUTE ON FUNCTION get_subscribers_by_preference TO authenticated;
GRANT EXECUTE ON FUNCTION get_posts_for_newsletter TO authenticated;
GRANT EXECUTE ON FUNCTION was_blog_notification_sent TO authenticated;
GRANT EXECUTE ON FUNCTION mark_blog_notification_sent TO authenticated;

-- ============================================
-- 10. COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE newsletters IS 'Monthly newsletters with selected blog posts';
COMMENT ON TABLE newsletter_posts IS 'Junction table linking newsletters to blog posts';
COMMENT ON TABLE email_logs IS 'Audit log of all emails sent through the system';

COMMENT ON COLUMN newsletters.status IS 'draft, scheduled, or sent';
COMMENT ON COLUMN newsletters.scheduled_send_at IS 'When to automatically send (if scheduled)';
COMMENT ON COLUMN newsletters.sent_at IS 'When the newsletter was actually sent';
COMMENT ON COLUMN newsletters.recipient_count IS 'Number of subscribers who received this newsletter';

COMMENT ON COLUMN content.send_blog_notification IS 'Whether to notify subscribers when this post is published';
COMMENT ON COLUMN content.notification_sent_at IS 'When the notification email was sent';
COMMENT ON COLUMN content.include_in_newsletter IS 'Whether to include this post in the monthly newsletter';
COMMENT ON COLUMN content.featured_in_newsletter IS 'Whether this post should be featured prominently';

COMMENT ON COLUMN newsletter_subscribers.preferences IS 'JSON object with email preference settings';
COMMENT ON COLUMN newsletter_subscribers.unsubscribe_token IS 'Unique token for one-click unsubscribe';
