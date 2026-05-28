import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import {
  Package, Users, ChevronRight, FileText, PenSquare,
  Megaphone, Mail, Star, Search, Briefcase, ArrowRight,
  AlertCircle, CheckCircle, Clock, TrendingUp,
} from 'lucide-react'
import { MOCK_SEO_PAGES } from '@/src/features/seo-center/seoMockData'
import { getSEODashboardSummary } from '@/src/features/seo-center/seoUtils'

const NAVY = '#0d2b55'
const GOLD = '#c9a84c'

// ── helpers ───────────────────────────────────────────────────────────────────
function count(r: unknown): number {
  return ((r as { count: number | null }).count) ?? 0
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
  label, value, sub, href, accent, alert,
}: { label: string; value: string | number; sub?: string; href: string; accent: string; alert?: boolean }) {
  return (
    <Link
      href={href}
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
    >
      {alert && (
        <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white" />
      )}
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{label}</p>
      <p className="text-3xl font-bold mb-1" style={{ color: accent }}>{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
      <ChevronRight size={14} className="absolute bottom-4 right-4 text-gray-200 group-hover:text-gray-400 transition-colors" />
    </Link>
  )
}

// ── Tool card ─────────────────────────────────────────────────────────────────
function ToolCard({
  label, description, href, icon: Icon, accent, badge, badgeColor,
}: { label: string; description: string; href: string; icon: React.ElementType; accent: string; badge?: string; badgeColor?: string }) {
  return (
    <Link
      href={href}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex items-start gap-4 p-5"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: accent }}>
        <Icon size={18} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="font-bold text-sm text-gray-900 group-hover:text-blue-700 transition-colors">{label}</p>
          {badge && (
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: badgeColor ?? '#fee2e2', color: badgeColor ? '#fff' : '#b91c1c' }}>
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
      </div>
      <ArrowRight size={14} className="text-gray-200 group-hover:text-blue-400 transition-colors mt-1 shrink-0" />
    </Link>
  )
}

// ── SEO Health bar ────────────────────────────────────────────────────────────
function SEOHealthBar({ green, yellow, red, total, score }: { green: number; yellow: number; red: number; total: number; score: number }) {
  const scoreColor = score >= 90 ? '#10b981' : score >= 70 ? '#f59e0b' : '#ef4444'
  return (
    <Link href="/admin/seo" className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: NAVY }}>
            <Search size={15} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">SEO Control Center</p>
            <p className="text-xs text-gray-400">Overall site health</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold" style={{ color: scoreColor }}>{score}</p>
          <p className="text-xs text-gray-400">avg score</p>
        </div>
      </div>
      {/* Stacked bar */}
      <div className="flex h-2 rounded-full overflow-hidden gap-0.5 mb-2">
        {green > 0 && <div className="bg-emerald-500 rounded-full" style={{ width: `${(green / total) * 100}%` }} />}
        {yellow > 0 && <div className="bg-amber-400 rounded-full" style={{ width: `${(yellow / total) * 100}%` }} />}
        {red > 0 && <div className="bg-red-500 rounded-full" style={{ width: `${(red / total) * 100}%` }} />}
      </div>
      <div className="flex gap-3 text-xs">
        <span className="flex items-center gap-1 text-emerald-600 font-semibold"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />{green} green</span>
        <span className="flex items-center gap-1 text-amber-600 font-semibold"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />{yellow} yellow</span>
        <span className="flex items-center gap-1 text-red-600 font-semibold"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />{red} red</span>
        <span className="ml-auto text-gray-400">{total} pages tracked</span>
      </div>
    </Link>
  )
}

// ── Quick action button ───────────────────────────────────────────────────────
function QuickAction({ href, label, icon: Icon, accent }: { href: string; label: string; icon: React.ElementType; accent: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 bg-white hover:scale-105 transition-all text-sm font-bold"
      style={{ borderColor: accent, color: accent }}
    >
      <Icon size={15} />
      {label}
    </Link>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // ── Live Supabase counts ──────────────────────────────────────────────────
  // FIX: careers uses column `active` (not `is_active`)
  // FIX: promotions uses `status = 'active'` string column (not boolean `active`)
  // FIX: blog gets separate published + draft counts for accurate sub-labels
  const db = supabase as unknown as { from: (t: string) => ReturnType<typeof supabase.from> }

  const [
    rInv, rLeads, rNewLeads,
    rBlogTotal, rBlogPublished, rBlogDraft,
    rPromos, rSubs,
    rReviews, rCareersActive, rCareersDraft,
  ] = await Promise.all([
    db.from('inventory_items').select('*', { count: 'exact', head: true }).neq('status', 'archived'),
    db.from('leads').select('*', { count: 'exact', head: true }),
    db.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    db.from('blog_posts').select('*', { count: 'exact', head: true }),
    db.from('blog_posts').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    db.from('blog_posts').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
    // FIX: use status='active' — promotions table has a string status column
    db.from('promotions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    db.from('newsletter_subscribers').select('*', { count: 'exact', head: true }),
    db.from('google_reviews').select('*', { count: 'exact', head: true }),
    // FIX: use `active` column — confirmed from CareersClient.tsx and careers/page.tsx
    db.from('job_positions').select('*', { count: 'exact', head: true }).eq('active', true),
    db.from('job_positions').select('*', { count: 'exact', head: true }).eq('active', false),
  ])

  const inventoryCount    = count(rInv)
  const leadCount         = count(rLeads)
  const newLeadCount      = count(rNewLeads)
  const blogCount         = count(rBlogTotal)
  const blogPublished     = count(rBlogPublished)
  const blogDraft         = count(rBlogDraft)
  const promoCount        = count(rPromos)
  const subCount          = count(rSubs)
  const reviewCount       = count(rReviews)
  const careerActive      = count(rCareersActive)
  const careerDraft       = count(rCareersDraft)

  // ── Reviews: fetch live total from Places API to replace hardcoded 23 ─────
  let reviewsTotal = 0
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/google-reviews`, {
      next: { revalidate: 43200 },
    })
    if (res.ok) {
      const data = await res.json() as { totalReviews?: number }
      reviewsTotal = data.totalReviews ?? 0
    }
  } catch { /* silent — fallback to 0 */ }

  // When Places API returns 0 (no key configured), fall back to DB count as the known floor
  const reviewsOnGoogle = reviewsTotal > 0 ? reviewsTotal : reviewCount
  const reviewsMissing = Math.max(0, reviewsOnGoogle - reviewCount)

  // ── SEO summary from mock data (source of truth until Supabase scan exists) ─
  const seoSummary = getSEODashboardSummary(MOCK_SEO_PAGES)
  const seoTotal = MOCK_SEO_PAGES.length

  // ── Greeting ──────────────────────────────────────────────────────────────
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const adminName = user?.email?.split('@')[0] ?? 'Admin'

  return (
    <div className="p-8 max-w-screen-xl space-y-8">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: NAVY, fontFamily: 'var(--font-display), Georgia, serif' }}>
            {greeting}, {adminName} 👋
          </h1>
          <p className="text-gray-400 text-sm">Thomas Marine admin portal — all tools in one place.</p>
        </div>
        <div className="text-right text-xs text-gray-400">
          <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          <p className="mt-0.5 font-semibold text-gray-500">thomasmarinellc.com</p>
        </div>
      </div>

      {/* ── Priority alerts ────────────────────────────────────────────────── */}
      {(newLeadCount > 0 || seoSummary.redCount > 0) && (
        <div className="flex flex-wrap gap-3">
          {newLeadCount > 0 && (
            <Link href="/admin/leads?status=new" className="flex items-center gap-2.5 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-semibold hover:bg-red-100 transition-colors">
              <AlertCircle size={15} />
              {newLeadCount} new lead{newLeadCount !== 1 ? 's' : ''} need attention
              <ArrowRight size={13} />
            </Link>
          )}
          {seoSummary.redCount > 0 && (
            <Link href="/admin/seo" className="flex items-center gap-2.5 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 font-semibold hover:bg-amber-100 transition-colors">
              <AlertCircle size={15} />
              {seoSummary.redCount} page{seoSummary.redCount !== 1 ? 's' : ''} with critical SEO issues
              <ArrowRight size={13} />
            </Link>
          )}
          {newLeadCount === 0 && seoSummary.redCount === 0 && (
            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-semibold">
              <CheckCircle size={15} />
              No critical issues — everything looks good
            </div>
          )}
        </div>
      )}

      {/* ── Core metrics strip ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-4">
        <StatCard label="Inventory"    value={inventoryCount}  sub={inventoryCount === 0 ? 'no active listings' : 'active listings'}       href="/admin/inventory"          accent={NAVY}      />
        <StatCard label="Total Leads"  value={leadCount}       sub="all time"                                                               href="/admin/leads"              accent="#1a4080"   />
        <StatCard label="New Leads"    value={newLeadCount}    sub={newLeadCount === 0 ? 'none unread' : 'awaiting response'}               href="/admin/leads?status=new"   accent={GOLD}      alert={newLeadCount > 0} />
        <StatCard label="Blog Posts"   value={blogCount}       sub={blogCount === 0 ? 'no posts yet' : `${blogPublished} published, ${blogDraft} draft`}  href="/admin/blog"               accent="#6366f1"   />
        <StatCard label="Active Promos" value={promoCount}     sub={promoCount === 0 ? 'none running' : 'live now'}                        href="/admin/promotions"         accent="#0ea5e9"   />
        <StatCard label="Subscribers"  value={subCount}        sub={subCount === 0 ? 'none yet' : 'newsletter list'}                       href="/admin/subscribers"        accent="#8b5cf6"   />
        <StatCard label="Reviews"      value={reviewCount}     sub={reviewCount === 0 ? 'none logged yet' : `of ${reviewsOnGoogle} on Google`}  href="/admin/reviews"        accent="#f59e0b"   />
        <StatCard label="Open Roles"   value={careerActive}    sub={careerActive === 0 ? 'no active postings' : `${careerDraft} draft`}    href="/admin/careers"            accent="#10b981"   />
      </div>

      {/* ── SEO health bar ─────────────────────────────────────────────────── */}
      <SEOHealthBar
        green={seoSummary.greenCount}
        yellow={seoSummary.yellowCount}
        red={seoSummary.redCount}
        total={seoTotal}
        score={seoSummary.overallHealth}
      />

      {/* ── Tool grid ──────────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">All Admin Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <ToolCard href="/admin/inventory"    label="Inventory"         icon={Package}    accent={NAVY}      description="Manage boat listings, photos, pricing, and availability status." />
          <ToolCard href="/admin/leads"        label="Leads"             icon={Users}      accent="#1a4080"   description="View and respond to customer inquiries and service requests." badge={newLeadCount > 0 ? `${newLeadCount} new` : undefined} badgeColor="#ef4444" />
          <ToolCard href="/admin/blog-studio"  label="Blog Studio"       icon={PenSquare}  accent="#6366f1"   description="Block-based editor for creating and publishing Knowledge Hub articles." />
          <ToolCard href="/admin/blog"         label="Blog Posts"        icon={FileText}   accent="#4f46e5"   description="Manage existing blog posts — edit, publish, archive, or delete." />
          <ToolCard href="/admin/promotions"   label="Promotions"        icon={Megaphone}  accent="#0ea5e9"   description="Create and schedule promotional banners and seasonal offers." />
          <ToolCard href="/admin/subscribers"  label="Subscribers"       icon={Mail}       accent="#8b5cf6"   description="View newsletter subscribers and export the list for campaigns." />
          <ToolCard href="/admin/reviews"      label="Google Reviews"    icon={Star}       accent="#f59e0b"   description={reviewsOnGoogle > 0 ? `Tracking ${reviewCount} of ${reviewsOnGoogle} Google reviews.` : 'Track Google Business Profile reviews over time.'} badge={reviewsMissing > 0 ? `${reviewsMissing} missing` : reviewCount > 0 ? '✓ Complete' : undefined} badgeColor={reviewsMissing > 0 ? '#f59e0b' : '#10b981'} />
          <ToolCard href="/admin/seo"          label="SEO Control Center" icon={Search}    accent={NAVY}      description={`Manage metadata, schema, images, and indexing for all ${seoTotal} tracked pages.`} badge={seoSummary.redCount > 0 ? `${seoSummary.redCount} critical` : undefined} badgeColor="#ef4444" />
          <ToolCard href="/admin/careers"      label="Careers"           icon={Briefcase}  accent="#10b981"   description={careerActive > 0 ? `${careerActive} active posting${careerActive !== 1 ? 's' : ''}${careerDraft > 0 ? `, ${careerDraft} draft` : ''}.` : 'Manage open job postings on the careers page.'} badge={careerActive > 0 ? `${careerActive} open` : undefined} badgeColor="#10b981" />
        </div>
      </div>

      {/* ── Quick actions ───────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <QuickAction href="/admin/inventory/new"  label="Add Listing"          icon={Package}   accent={NAVY}    />
          <QuickAction href="/admin/blog-studio"    label="Write Blog Post"       icon={PenSquare} accent="#6366f1" />
          <QuickAction href="/admin/promotions"     label="New Promotion"         icon={Megaphone} accent="#0ea5e9" />
          <QuickAction href="/admin/seo"            label="Fix SEO Issues"        icon={Search}    accent={NAVY}    />
          <QuickAction href="/admin/leads"          label="Check Leads"           icon={Users}     accent={GOLD}    />
          <QuickAction href="/admin/reviews"        label="Log a Review"          icon={Star}      accent="#f59e0b" />
        </div>
      </div>

      {/* ── Site health summary ─────────────────────────────────────────────── */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} style={{ color: NAVY }} />
            <p className="text-sm font-bold text-gray-800">SEO Health</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Overall score</span><span className="font-bold" style={{ color: NAVY }}>{seoSummary.overallHealth}/100</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Missing metadata</span><span className={`font-bold ${seoSummary.missingMetadataCount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{seoSummary.missingMetadataCount}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Indexing issues</span><span className={`font-bold ${seoSummary.indexingIssuesCount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{seoSummary.indexingIssuesCount}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Stale pages</span><span className={`font-bold ${seoSummary.needsUpdateCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>{seoSummary.needsUpdateCount}</span></div>
          </div>
          <Link href="/admin/seo" className="mt-3 flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline">Open SEO Center <ArrowRight size={11} /></Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Users size={16} style={{ color: GOLD }} />
            <p className="text-sm font-bold text-gray-800">Lead Pipeline</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Total leads</span><span className="font-bold" style={{ color: NAVY }}>{leadCount}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">New (unread)</span><span className={`font-bold ${newLeadCount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{newLeadCount}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Subscribers</span><span className="font-bold" style={{ color: NAVY }}>{subCount}</span></div>
          </div>
          <Link href="/admin/leads" className="mt-3 flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline">View Leads <ArrowRight size={11} /></Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Star size={16} style={{ color: '#f59e0b' }} />
            <p className="text-sm font-bold text-gray-800">Google Reviews</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Tracked in DB</span><span className="font-bold" style={{ color: NAVY }}>{reviewCount}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Total on Google</span><span className="font-bold" style={{ color: NAVY }}>{reviewsOnGoogle > 0 ? reviewsOnGoogle : '—'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Coverage</span>
              <span className={`font-bold ${reviewsOnGoogle > 0 && reviewCount >= reviewsOnGoogle ? 'text-emerald-600' : 'text-amber-600'}`}>
                {reviewsOnGoogle > 0 ? `${Math.round((reviewCount / reviewsOnGoogle) * 100)}%` : 'Setup needed'}
              </span>
            </div>
          </div>
          <Link href="/admin/reviews" className="mt-3 flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline">Track Reviews <ArrowRight size={11} /></Link>
        </div>
      </div>

      {/* ── Content inventory summary ────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-gray-400" />
            <p className="text-sm font-bold text-gray-800">Content at a Glance</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Boat Listings', value: inventoryCount, href: '/admin/inventory', color: NAVY },
            { label: 'Blog Posts', value: blogCount, href: '/admin/blog', color: '#6366f1' },
            { label: 'Active Promotions', value: promoCount, href: '/admin/promotions', color: '#0ea5e9' },
            { label: 'Open Roles', value: careerActive, href: '/admin/careers', color: '#10b981' },
          ].map((item) => (
            <Link key={item.label} href={item.href} className="text-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group">
              <p className="text-2xl font-bold group-hover:scale-110 transition-transform inline-block" style={{ color: item.color }}>{item.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
