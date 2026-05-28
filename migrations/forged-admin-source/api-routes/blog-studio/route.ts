import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

// GET /api/blog-studio — list all posts for the current authenticated user
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('blog_studio_posts')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/blog-studio — create a new post
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error, data } = await (supabase as any)
    .from('blog_studio_posts')
    .insert(toRow(body))
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(fromRow(data), { status: 201 })
}

// ── helpers ───────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toRow(post: any) {
  return {
    id:                     post.id,
    title:                  post.title,
    slug:                   post.slug,
    subtitle:               post.subtitle ?? null,
    excerpt:                post.excerpt ?? null,
    post_type:              post.postType ?? 'standard_article',
    category:               post.category ?? null,
    tags:                   post.tags ?? [],
    featured_image:         post.featuredImage ?? null,
    gallery_images:         post.galleryImages ?? [],
    blocks:                 post.blocks ?? [],
    related_service_ids:    post.relatedServiceIds ?? [],
    related_inventory_ids:  post.relatedInventoryIds ?? [],
    seo:                    post.seo ?? {},
    design:                 post.design ?? {},
    status:                 post.status ?? 'draft',
    featured:               post.featured ?? false,
    show_on_homepage:       post.showOnHomepage ?? false,
    show_on_blog_page:      post.showOnBlogPage ?? false,
    author_name:            post.authorName ?? 'Admin',
    published_at:           post.publishedAt ?? null,
    scheduled_for:          post.scheduledFor ?? null,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromRow(row: any) {
  return {
    id:                   row.id,
    title:                row.title,
    slug:                 row.slug,
    subtitle:             row.subtitle,
    excerpt:              row.excerpt,
    postType:             row.post_type,
    category:             row.category,
    tags:                 row.tags ?? [],
    featuredImage:        row.featured_image,
    galleryImages:        row.gallery_images ?? [],
    blocks:               row.blocks ?? [],
    relatedServiceIds:    row.related_service_ids ?? [],
    relatedInventoryIds:  row.related_inventory_ids ?? [],
    seo:                  row.seo ?? {},
    design:               row.design ?? {},
    status:               row.status,
    featured:             row.featured,
    showOnHomepage:       row.show_on_homepage,
    showOnBlogPage:       row.show_on_blog_page,
    authorName:           row.author_name,
    createdAt:            row.created_at,
    updatedAt:            row.updated_at,
    publishedAt:          row.published_at,
    scheduledFor:         row.scheduled_for,
  }
}
