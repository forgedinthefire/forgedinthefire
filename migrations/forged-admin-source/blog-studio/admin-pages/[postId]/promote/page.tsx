'use client'
import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { getBlogPostById } from '@/src/features/blog-studio/blogStore'
import PromoteBlogPostPage from '@/src/features/social/PromoteBlogPostPage'
import type { MinimalBlogPostForCampaign } from '@/src/features/social/socialStore'

export default function PromotePage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = use(params)
  const router = useRouter()
  const [blogPost, setBlogPost] = useState<MinimalBlogPostForCampaign | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    void (async () => {
      const found = await getBlogPostById(postId)
      if (mounted) {
        setBlogPost(found ? {
          id: found.id,
          title: found.title,
          excerpt: found.excerpt,
          slug: found.slug,
          featuredImage: found.featuredImage
            ? { url: found.featuredImage.url, alt: found.featuredImage.alt }
            : undefined,
        } : null)
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [postId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f0f4f8' }}>
        <p className="text-gray-400 text-sm">Loading post…</p>
      </div>
    )
  }

  if (!blogPost) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f0f4f8' }}>
        <div className="text-center">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-gray-500 font-medium">Blog post not found</p>
          <p className="text-gray-400 text-sm mt-1">ID: {postId}</p>
          <button onClick={() => router.push('/admin/blog-studio')} className="mt-4 text-sm font-bold text-blue-600 hover:text-blue-800">
            ← Back to Blog Studio
          </button>
        </div>
      </div>
    )
  }

  return <PromoteBlogPostPage blogPost={blogPost} />
}
