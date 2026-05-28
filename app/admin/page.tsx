export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import {
  FileText,
  PenSquare,
  Search,
  ChevronRight,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react'

const GOLD = '#C8A46B'
const CHARCOAL = '#1E1714'
const TEAL = '#1E6B73'

// Stat Card Component
function StatCard({
  label, value, sub, href, accent, alert,
}: { label: string; value: string | number; sub?: string; href: string; accent: string; alert?: boolean }) {
  return (
    <Link
      href={href}
      className="bg-white rounded-2xl p-5 border border-[#3A2A24]/20 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
    >
      {alert && (
        <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white" />
      )}
      <p className="text-xs font-bold uppercase tracking-widest text-[#8B5E3C] mb-2">{label}</p>
      <p className="text-3xl font-bold mb-1" style={{ color: accent }}>{value}</p>
      {sub && <p className="text-xs text-[#B8A89A]">{sub}</p>}
      <ChevronRight size={14} className="absolute bottom-4 right-4 text-[#3A2A24]/30 group-hover:text-[#8B5E3C] transition-colors" />
    </Link>
  )
}

// Tool Card Component
function ToolCard({
  label, description, href, icon: Icon, accent, badge, badgeColor,
}: { label: string; description: string; href: string; icon: React.ElementType; accent: string; badge?: string; badgeColor?: string }) {
  return (
    <Link
      href={href}
      className="bg-white rounded-2xl border border-[#3A2A24]/20 shadow-sm hover:shadow-md transition-all group flex items-start gap-4 p-5"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: accent }}>
        <Icon size={18} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="font-bold text-sm text-[#1E1714] group-hover:text-[#1E6B73] transition-colors">{label}</p>
          {badge && (
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: badgeColor ?? '#fee2e2', color: badgeColor ? '#fff' : '#b91c1c' }}>
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-[#8B5E3C] leading-relaxed">{description}</p>
      </div>
      <ArrowRight size={14} className="text-[#3A2A24]/30 group-hover:text-[#C8A46B] transition-colors mt-1 shrink-0" />
    </Link>
  )
}

export default async function AdminPage() {
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
  
  // Get content counts
  const { count: contentCount } = await supabase
    .from('content')
    .select('*', { count: 'exact', head: true })
    .eq('type', 'blog')
  
  const { count: publishedCount } = await supabase
    .from('content')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')
  
  const { count: draftCount } = await supabase
    .from('content')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'draft')
  
  const { count: blogCount } = await supabase
    .from('content')
    .select('*', { count: 'exact', head: true })

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1E1714] mb-2">Admin Dashboard</h1>
        <p className="text-[#8B5E3C]">Manage content, SEO, and site settings.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Blog Posts"
          value={blogCount ?? 0}
          sub="Total posts"
          href="/admin/blog"
          accent={TEAL}
        />
        <StatCard
          label="Published"
          value={publishedCount ?? 0}
          sub="Live on site"
          href="/admin/content?filter=published"
          accent="#10b981"
        />
        <StatCard
          label="Drafts"
          value={draftCount ?? 0}
          sub="Awaiting publication"
          href="/admin/content?filter=draft"
          accent={GOLD}
          alert={draftCount ? draftCount > 0 : false}
        />
        <StatCard
          label="Content Pages"
          value={contentCount ?? 0}
          sub="Static pages"
          href="/admin/content"
          accent="#4C9AA3"
        />
      </div>

      {/* Tools Grid */}
      <div>
        <h2 className="text-lg font-bold text-[#1E1714] mb-4">Management Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ToolCard
            label="Blog Studio"
            description="Create and manage blog posts with rich block editor. Stories, events, and updates."
            href="/admin/blog"
            icon={PenSquare}
            accent={TEAL}
            badge="New"
            badgeColor="#1E6B73"
          />
          <ToolCard
            label="Content Pages"
            description="Manage static pages like About, Services, and Resources."
            href="/admin/content"
            icon={FileText}
            accent="#4C9AA3"
          />
          <ToolCard
            label="SEO Health Center"
            description="Monitor SEO scores, fix issues, and optimize search visibility."
            href="/admin/seo"
            icon={Search}
            accent={GOLD}
          />
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-[#1E1714] rounded-2xl p-6 border border-[#3A2A24]">
        <h3 className="text-lg font-bold text-[#C8A46B] mb-4">Quick Tips</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-[#4C9AA3] shrink-0 mt-0.5" />
            <p className="text-sm text-[#CDBDAF]">Use the Content Manager to share survivor stories and advocacy updates.</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-[#4C9AA3] shrink-0 mt-0.5" />
            <p className="text-sm text-[#CDBDAF]">Check the SEO Center monthly to maintain search visibility for those seeking help.</p>
          </div>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#C8A46B] shrink-0 mt-0.5" />
            <p className="text-sm text-[#CDBDAF]">Always prioritize survivor privacy and consent when publishing stories.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
