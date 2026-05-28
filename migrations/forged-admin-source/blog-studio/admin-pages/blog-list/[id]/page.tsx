import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BlogPostForm from '../_components/BlogPostForm'

type Post = {
  id: string
  title: string
  slug: string
  summary: string | null
  cover_image_url: string | null
  content_json: object | null
  content_html: string | null
  status: 'draft' | 'scheduled' | 'published' | 'archived' | null
  published_at: string | null
  scheduled_for: string | null
  tags: string[] | null
}

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('blog_posts')
    .select('id, title, slug, summary, cover_image_url, content_json, content_html, status, published_at, scheduled_for, tags')
    .eq('id', id)
    .single()
  const post = data as unknown as Post | null
  if (!post) notFound()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-1" style={{ color: '#0d2b55' }}>Edit Blog Post</h1>
      <p className="text-gray-500 text-sm mb-8">/{post.slug}</p>
      <BlogPostForm initialPost={post} />
    </div>
  )
}
