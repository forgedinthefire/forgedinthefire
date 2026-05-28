import type { Metadata } from 'next'
import BlogStudioDashboard from '@/src/features/blog-studio/BlogStudioDashboard'

export const metadata: Metadata = {
  title: 'Blog Studio | Thomas Marine Admin',
  description: 'Create and manage blog content with structured blocks.',
  robots: { index: false, follow: false },
}

export default function BlogStudioPage() {
  return <BlogStudioDashboard />
}
