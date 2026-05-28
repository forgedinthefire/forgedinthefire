import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Edit2, 
  Eye, 
  Trash2,
  FileText,
  CheckCircle,
  Clock,
  Archive,
  Copy,
  Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ContentStatus, PostTemplate, ContentCategory } from '@/src/features/content/types'

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

  const templates: PostTemplate[] = ['standard', 'event', 'impact-story', 'volunteer-opp', 'donor-update', 'resource-guide', 'partner-spotlight', 'fundraising']
  const categories: ContentCategory[] = ['news', 'events', 'impact-stories', 'volunteer', 'donor-updates', 'resources', 'partners', 'fundraising']
  const statuses: ContentStatus[] = ['draft', 'published', 'archived']

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
      <div className="flex flex-wrap items-center gap-3 bg-white rounded-xl p-4 border border-[#3A2A24]/20">
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#8B5E3C]">Status:</span>
          <div className="flex gap-1">
            {['all', ...statuses].map((status) => (
              <Link
                key={status}
                href={`/admin/blog?${new URLSearchParams({
                  ...(searchParams.template && searchParams.template !== 'all' ? { template: searchParams.template } : {}),
                  ...(searchParams.category && searchParams.category !== 'all' ? { category: searchParams.category } : {}),
                  ...(status !== 'all' ? { status } : {}),
                }).toString()}`}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  searchParams.status === status || (!searchParams.status && status === 'all')
                    ? 'bg-[#1E6B73] text-white'
                    : 'text-[#8B5E3C] hover:bg-[#3A2A24]/10'
                }`}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </Link>
            ))}
          </div>
        </div>

        <div className="w-px h-6 bg-[#3A2A24]/20" />

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#8B5E3C]">Category:</span>
          <select
            className="text-sm border border-[#3A2A24]/20 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[#1E6B73]"
            value={searchParams.category || 'all'}
            onChange={(e) => {
              const params = new URLSearchParams()
              if (searchParams.status && searchParams.status !== 'all') params.set('status', searchParams.status)
              if (e.target.value !== 'all') params.set('category', e.target.value)
              window.location.href = `/admin/blog?${params.toString()}`
            }}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

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
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/blog/${item.id}`}
                        className="p-2 rounded-lg hover:bg-[#3A2A24]/10 text-[#8B5E3C] hover:text-[#1E6B73] transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      {item.status === 'published' && (
                        <Link
                          href={`/blog/${item.slug}`}
                          target="_blank"
                          className="p-2 rounded-lg hover:bg-[#3A2A24]/10 text-[#8B5E3C] hover:text-[#C8A46B] transition-colors"
                          title="View Live"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      )}
                      <button
                        className="p-2 rounded-lg hover:bg-[#3A2A24]/10 text-[#8B5E3C] hover:text-[#1E6B73] transition-colors"
                        title="Duplicate"
                        onClick={async () => {
                          // Handle duplicate via API
                          const res = await fetch(`/api/admin/content/${item.id}/duplicate`, { method: 'POST' })
                          if (res.ok) window.location.reload()
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <form action={`/api/admin/content/${item.id}/delete`} method="POST" className="inline">
                        <button
                          type="submit"
                          className="p-2 rounded-lg hover:bg-red-50 text-[#8B5E3C] hover:text-red-600 transition-colors"
                          title="Delete"
                          onClick={(e) => confirm('Delete this post?') ? null : e.preventDefault()}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
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
