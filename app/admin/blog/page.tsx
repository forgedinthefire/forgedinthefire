export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  FileText,
  CheckCircle,
  Clock,
  Archive,
  Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ContentStatus, PostTemplate, ContentCategory } from '@/src/features/content/types'
import { PostActions } from './PostActions'
import { Filters } from './Filters'

const TEAL = '#1E6B73'
const GOLD = '#C8A46B'

function StatusBadge({ status }: { status: ContentStatus }) {
  const styles = {
    published: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    draft: 'bg-amber-100 text-amber-700 border-amber-200',
    archived: 'bg-gray-100 text-gray-600 border-gray-200',
  }
  const icons = {
    published: CheckCircle,
    draft: Clock,
    archived: Archive,
  }
  const Icon = icons[status]
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
      <Icon size={12} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function TemplateBadge({ template }: { template: PostTemplate }) {
  const labels: Record<PostTemplate, string> = {
    standard: 'Standard',
    event: 'Event',
    'impact-story': 'Impact Story',
    'volunteer-opp': 'Volunteer',
    'donor-update': 'Donor Update',
    'resource-guide': 'Resource',
    'partner-spotlight': 'Partner',
    fundraising: 'Fundraising',
  }
  return (
    <span className="text-xs text-[#8B5E3C] bg-[#3A2A24]/10 px-2 py-1 rounded">
      {labels[template] || template}
    </span>
  )
}

function CategoryBadge({ category }: { category: ContentCategory }) {
  const labels: Record<ContentCategory, string> = {
    news: 'News',
    events: 'Events',
    'impact-stories': 'Impact',
    volunteer: 'Volunteer',
    'donor-updates': 'Donor',
    resources: 'Resources',
    partners: 'Partners',
    fundraising: 'Fundraising',
  }
  return (
    <span className="text-xs text-[#1E6B73] bg-[#1E6B73]/10 px-2 py-1 rounded">
      {labels[category] || category}
    </span>
  )
}

export default async function BlogPage({ 
  searchParams 
}: { 
  searchParams: { 
    status?: ContentStatus | 'all'
    template?: PostTemplate | 'all'
    category?: ContentCategory | 'all'
  } 
}) {
  const supabase = await createClient()
  
  // Handle missing Supabase configuration
  if (!supabase) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6">
          <h2 className="text-amber-400 font-medium mb-2">Database Not Connected</h2>
          <p className="text-amber-400/80 text-sm">
            Supabase environment variables are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
          </p>
        </div>
      </div>
    )
  }
  
  let query = supabase
    .from('content')
    .select('*')
    .order('updated_at', { ascending: false })
  
  // Apply filters
  if (searchParams.status && searchParams.status !== 'all') {
    query = query.eq('status', searchParams.status)
  }
  if (searchParams.template && searchParams.template !== 'all') {
    query = query.eq('template', searchParams.template)
  }
  if (searchParams.category && searchParams.category !== 'all') {
    query = query.eq('category', searchParams.category)
  }
  
  const { data: items } = await query

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1714]">Blog Studio</h1>
          <p className="text-sm text-[#8B5E3C]">Create and manage blog posts, stories, and content.</p>
        </div>
        <Button asChild className="bg-[#1E6B73] hover:bg-[#4C9AA3]">
          <Link href="/admin/blog/new">
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Filters 
        status={searchParams.status || 'all'}
        category={searchParams.category || 'all'}
        template={searchParams.template || 'all'}
      />

      {/* Content List */}
      <div className="bg-white rounded-2xl border border-[#3A2A24]/20 overflow-hidden">
        {items && items.length > 0 ? (
          <table className="w-full">
            <thead className="bg-[#f4f6f9] border-b border-[#3A2A24]/10">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider">Post</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider">Type</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider">Category</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider">Updated</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3A2A24]/10">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-[#f4f6f9]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#1E6B73]/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-[#1E6B73]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-[#1E1714]">{item.title}</p>
                          {item.featured && (
                            <Star className="w-4 h-4 text-[#C8A46B] fill-[#C8A46B]" />
                          )}
                        </div>
                        <p className="text-xs text-[#8B5E3C]">/{item.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <TemplateBadge template={item.template} />
                  </td>
                  <td className="px-6 py-4">
                    <CategoryBadge category={item.category} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-[#8B5E3C]">
                    {new Date(item.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <PostActions 
                      postId={item.id} 
                      slug={item.slug} 
                      status={item.status} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[#3A2A24]/10 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-[#8B5E3C]" />
            </div>
            <h3 className="text-lg font-medium text-[#1E1714] mb-1">No posts yet</h3>
            <p className="text-sm text-[#8B5E3C] mb-4">Create your first blog post to get started.</p>
            <Button asChild className="bg-[#1E6B73] hover:bg-[#4C9AA3]">
              <Link href="/admin/blog/new">
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
