-- Forged in the Fire - Admin Users Schema
-- Migration: Add admin_users table for role-based access control

-- ============================================
-- 1. CREATE ADMIN_USERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. CREATE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public to check admin status" ON admin_users;
DROP POLICY IF EXISTS "Allow admin full access on admin_users" ON admin_users;

-- Allow public (authenticated) to check their own admin status
CREATE POLICY "Allow public to check admin status"
  ON admin_users FOR SELECT
  TO authenticated
  USING (true);

-- Allow admin full access (must be owner or admin)
CREATE POLICY "Allow admin full access on admin_users"
  ON admin_users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.email = auth.jwt() ->> 'email' 
      AND admin_users.role IN ('admin', 'owner')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.email = auth.jwt() ->> 'email' 
      AND admin_users.role IN ('admin', 'owner')
    )
  );

-- ============================================
-- 4. AUTO-UPDATE TIMESTAMP
-- ============================================

CREATE OR REPLACE FUNCTION update_admin_user_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_admin_user_timestamp ON admin_users;

CREATE TRIGGER update_admin_user_timestamp
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_user_updated_at();

-- ============================================
-- 5. HELPER FUNCTION TO CHECK IF USER IS ADMIN
-- ============================================

CREATE OR REPLACE FUNCTION is_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = user_email 
    AND role IN ('admin', 'owner')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. INSERT OWNER USER
-- ============================================

INSERT INTO admin_users (id, email, role, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'salsbury.law@icloud.com',
  'owner',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE 
  SET role = 'owner', updated_at = NOW();

-- ============================================
-- 7. COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE admin_users IS 'Authorized admin users with role-based access control';
COMMENT ON COLUMN admin_users.email IS 'Email address of the admin (must match Supabase Auth email)';
COMMENT ON COLUMN admin_users.role IS 'Admin role: owner (full control), admin (standard access)';
COMMENT ON FUNCTION is_admin(TEXT) IS 'Check if a given email has admin privileges';

-- ============================================
-- 8. VERIFY SETUP
-- ============================================

SELECT 
  'Admin users table created successfully' as status,
  (SELECT COUNT(*) FROM admin_users) as admin_count,
  (SELECT email FROM admin_users WHERE role = 'owner' LIMIT 1) as owner_email;
