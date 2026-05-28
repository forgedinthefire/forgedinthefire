-- Forged in the Fire - API Route Support
-- Migration: Add API helper functions for Blog Studio

-- ============================================
-- 1. GET BLOG POSTS FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION get_blog_posts(
  p_category TEXT DEFAULT NULL,
  p_template TEXT DEFAULT NULL,
  p_status TEXT DEFAULT 'published',
  p_featured BOOLEAN DEFAULT NULL,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  template TEXT,
  category TEXT,
  tags TEXT[],
  excerpt TEXT,
  blocks JSONB,
  featured_image JSONB,
  cta JSONB,
  status TEXT,
  featured BOOLEAN,
  author_name TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.title,
    c.slug,
    c.template,
    c.category,
    c.tags,
    c.excerpt,
    c.blocks,
    c.featured_image,
    c.cta,
    c.status,
    c.featured,
    c.author_name,
    c.published_at,
    c.created_at
  FROM content c
  WHERE 
    (p_status IS NULL OR c.status = p_status)
    AND (p_category IS NULL OR c.category = p_category)
    AND (p_template IS NULL OR c.template = p_template)
    AND (p_featured IS NULL OR c.featured = p_featured)
  ORDER BY c.published_at DESC NULLS LAST, c.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 2. GET SINGLE BLOG POST BY SLUG
-- ============================================

CREATE OR REPLACE FUNCTION get_blog_post_by_slug(p_slug TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  template TEXT,
  category TEXT,
  tags TEXT[],
  excerpt TEXT,
  blocks JSONB,
  featured_image JSONB,
  gallery_images JSONB[],
  seo JSONB,
  cta JSONB,
  status TEXT,
  featured BOOLEAN,
  author_name TEXT,
  author_id UUID,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.title,
    c.slug,
    c.template,
    c.category,
    c.tags,
    c.excerpt,
    c.blocks,
    c.featured_image,
    c.gallery_images,
    c.seo,
    c.cta,
    c.status,
    c.featured,
    c.author_name,
    c.author_id,
    c.published_at,
    c.created_at,
    c.updated_at
  FROM content c
  WHERE c.slug = p_slug
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 3. GET RELATED POSTS
-- ============================================

CREATE OR REPLACE FUNCTION get_related_posts(
  p_current_id UUID,
  p_category TEXT,
  p_limit INTEGER DEFAULT 3
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  template TEXT,
  category TEXT,
  excerpt TEXT,
  featured_image JSONB,
  published_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.title,
    c.slug,
    c.template,
    c.category,
    c.excerpt,
    c.featured_image,
    c.published_at
  FROM content c
  WHERE 
    c.id != p_current_id
    AND c.category = p_category
    AND c.status = 'published'
  ORDER BY c.published_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 4. CREATE BLOG POST
-- ============================================

CREATE OR REPLACE FUNCTION create_blog_post(
  p_title TEXT,
  p_slug TEXT,
  p_template TEXT DEFAULT 'standard',
  p_category TEXT DEFAULT 'news',
  p_excerpt TEXT DEFAULT '',
  p_blocks JSONB DEFAULT '[]'::jsonb,
  p_seo JSONB DEFAULT '{}'::jsonb,
  p_cta JSONB DEFAULT NULL,
  p_author_id UUID DEFAULT NULL,
  p_author_name TEXT DEFAULT NULL,
  p_featured_image JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  new_id UUID;
BEGIN
  new_id := gen_random_uuid();
  
  INSERT INTO content (
    id,
    title,
    slug,
    type,
    template,
    category,
    excerpt,
    blocks,
    seo,
    cta,
    status,
    featured,
    author_id,
    author_name,
    featured_image,
    created_at,
    updated_at
  ) VALUES (
    new_id,
    p_title,
    p_slug,
    'blog',
    p_template,
    p_category,
    p_excerpt,
    p_blocks,
    p_seo,
    p_cta,
    'draft',
    FALSE,
    p_author_id,
    p_author_name,
    p_featured_image,
    NOW(),
    NOW()
  );
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 5. UPDATE BLOG POST
-- ============================================

CREATE OR REPLACE FUNCTION update_blog_post(
  p_id UUID,
  p_title TEXT DEFAULT NULL,
  p_slug TEXT DEFAULT NULL,
  p_template TEXT DEFAULT NULL,
  p_category TEXT DEFAULT NULL,
  p_tags TEXT[] DEFAULT NULL,
  p_excerpt TEXT DEFAULT NULL,
  p_blocks JSONB DEFAULT NULL,
  p_seo JSONB DEFAULT NULL,
  p_cta JSONB DEFAULT NULL,
  p_status TEXT DEFAULT NULL,
  p_featured BOOLEAN DEFAULT NULL,
  p_featured_image JSONB DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE content SET
    title = COALESCE(p_title, title),
    slug = COALESCE(p_slug, slug),
    template = COALESCE(p_template, template),
    category = COALESCE(p_category, category),
    tags = COALESCE(p_tags, tags),
    excerpt = COALESCE(p_excerpt, excerpt),
    blocks = COALESCE(p_blocks, blocks),
    seo = COALESCE(p_seo, seo),
    cta = COALESCE(p_cta, cta),
    status = COALESCE(p_status, status),
    featured = COALESCE(p_featured, featured),
    featured_image = COALESCE(p_featured_image, featured_image),
    updated_at = NOW()
  WHERE id = p_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. SEARCH POSTS
-- ============================================

CREATE OR REPLACE FUNCTION search_blog_posts(
  p_query TEXT,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  excerpt TEXT,
  featured_image JSONB,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.title,
    c.slug,
    c.excerpt,
    c.featured_image,
    ts_rank(
      to_tsvector('english', c.title || ' ' || COALESCE(c.excerpt, '')),
      plainto_tsquery('english', p_query)
    ) as rank
  FROM content c
  WHERE 
    c.status = 'published'
    AND to_tsvector('english', c.title || ' ' || COALESCE(c.excerpt, '')) @@ plainto_tsquery('english', p_query)
  ORDER BY rank DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. GET CATEGORY COUNTS
-- ============================================

CREATE OR REPLACE FUNCTION get_category_counts()
RETURNS TABLE (
  category TEXT,
  total_count BIGINT,
  published_count BIGINT,
  featured_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.category,
    COUNT(*) as total_count,
    COUNT(*) FILTER (WHERE c.status = 'published') as published_count,
    COUNT(*) FILTER (WHERE c.featured = TRUE) as featured_count
  FROM content c
  GROUP BY c.category
  ORDER BY published_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 8. GET POST STATISTICS
-- ============================================

CREATE OR REPLACE FUNCTION get_blog_stats()
RETURNS TABLE (
  total_posts BIGINT,
  published_posts BIGINT,
  draft_posts BIGINT,
  featured_posts BIGINT,
  categories JSONB
) AS $$
DECLARE
  category_stats JSONB;
BEGIN
  -- Get category breakdown
  SELECT jsonb_object_agg(cat.category, cat.published_count)
  INTO category_stats
  FROM get_category_counts() cat;
  
  RETURN QUERY
  SELECT 
    COUNT(*) as total_posts,
    COUNT(*) FILTER (WHERE status = 'published') as published_posts,
    COUNT(*) FILTER (WHERE status = 'draft') as draft_posts,
    COUNT(*) FILTER (WHERE featured = TRUE) as featured_posts,
    category_stats as categories
  FROM content;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 9. ARCHIVE OLD POSTS (Maintenance function)
-- ============================================

CREATE OR REPLACE FUNCTION archive_old_posts(
  p_days_old INTEGER DEFAULT 365
)
RETURNS INTEGER AS $$
DECLARE
  archived_count INTEGER;
BEGIN
  UPDATE content
  SET status = 'archived'
  WHERE 
    status = 'published'
    AND published_at < NOW() - INTERVAL '1 day' * p_days_old
    AND featured = FALSE;
  
  GET DIAGNOSTICS archived_count = ROW_COUNT;
  RETURN archived_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 10. GRANT PERMISSIONS
-- ============================================

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_blog_posts TO authenticated;
GRANT EXECUTE ON FUNCTION get_blog_post_by_slug TO authenticated;
GRANT EXECUTE ON FUNCTION get_related_posts TO authenticated;
GRANT EXECUTE ON FUNCTION create_blog_post TO authenticated;
GRANT EXECUTE ON FUNCTION update_blog_post TO authenticated;
GRANT EXECUTE ON FUNCTION search_blog_posts TO authenticated;
GRANT EXECUTE ON FUNCTION get_category_counts TO authenticated;
GRANT EXECUTE ON FUNCTION get_blog_stats TO authenticated;
GRANT EXECUTE ON FUNCTION duplicate_post TO authenticated;
GRANT EXECUTE ON FUNCTION publish_post TO authenticated;

-- Grant execute to anon for public functions
GRANT EXECUTE ON FUNCTION get_blog_posts TO anon;
GRANT EXECUTE ON FUNCTION get_blog_post_by_slug TO anon;
GRANT EXECUTE ON FUNCTION get_related_posts TO anon;
GRANT EXECUTE ON FUNCTION search_blog_posts TO anon;
