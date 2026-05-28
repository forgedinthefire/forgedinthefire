-- Forged in the Fire - Job Positions Schema
-- Migration: Add job postings table for public careers page

-- ============================================
-- 1. CREATE JOB POSITIONS TABLE
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
-- 2. CREATE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_job_positions_slug ON job_positions(slug);
CREATE INDEX IF NOT EXISTS idx_job_positions_active ON job_positions(active) WHERE active = TRUE;
CREATE INDEX IF NOT EXISTS idx_job_positions_sort_order ON job_positions(sort_order);
CREATE INDEX IF NOT EXISTS idx_job_positions_created_at ON job_positions(created_at DESC);

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE job_positions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read of active positions" ON job_positions;
DROP POLICY IF EXISTS "Allow admin full access" ON job_positions;

-- Public can read active positions only
CREATE POLICY "Allow public read of active positions"
  ON job_positions FOR SELECT
  USING (active = TRUE);

-- Authenticated admins have full access
CREATE POLICY "Allow admin full access"
  ON job_positions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 4. AUTO-UPDATE TIMESTAMP
-- ============================================

CREATE OR REPLACE FUNCTION update_job_position_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_job_position_timestamp ON job_positions;

CREATE TRIGGER update_job_position_timestamp
  BEFORE UPDATE ON job_positions
  FOR EACH ROW
  EXECUTE FUNCTION update_job_position_updated_at();

-- ============================================
-- 5. HELPER FUNCTION FOR SLUG GENERATION
-- ============================================

CREATE OR REPLACE FUNCTION generate_job_slug(p_title TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Convert to lowercase, replace spaces with hyphens, remove special chars
  base_slug := lower(regexp_replace(p_title, '[^a-zA-Z0-9\s]', '', 'g'));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  
  final_slug := base_slug;
  
  -- Check for uniqueness and append number if needed
  WHILE EXISTS (SELECT 1 FROM job_positions WHERE slug = final_slug AND (TG_OP = 'INSERT' OR id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'))) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE job_positions IS 'Job postings for the Forged in the Fire careers page';
COMMENT ON COLUMN job_positions.title IS 'Job title (e.g., "Victim Advocate")';
COMMENT ON COLUMN job_positions.slug IS 'URL-friendly identifier for the job detail page';
COMMENT ON COLUMN job_positions.type IS 'Employment type: Full-Time, Part-Time, Contract, Volunteer, Internship';
COMMENT ON COLUMN job_positions.description IS 'Short description for the job listing card';
COMMENT ON COLUMN job_positions.duties IS 'Detailed responsibilities and duties';
COMMENT ON COLUMN job_positions.requirements IS 'Required qualifications and skills';
COMMENT ON COLUMN job_positions.pay_range IS 'Salary or pay range information';
COMMENT ON COLUMN job_positions.location IS 'Job location (defaults to Cleveland, OH)';
COMMENT ON COLUMN job_positions.active IS 'Whether the job is visible on the public site';
COMMENT ON COLUMN job_positions.sort_order IS 'Display order for the listing page';
