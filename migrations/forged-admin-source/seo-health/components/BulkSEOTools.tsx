'use client'
import { useState } from 'react'
import type { SEOPage } from '../seoTypes'
import { SectionHeading, ActionButton } from './SEOPrimitives'

type Props = { pages: SEOPage[] }

type BulkFinding = { pageId: string; pageName: string; url: string; detail: string }

export default function BulkSEOTools({ pages }: Props) {
  const [open, setOpen] = useState(false)
  const [activeAudit, setActiveAudit] = useState<string | null>(null)
  const [findings, setFindings] = useState<BulkFinding[]>([])

  function runAudit(label: string, fn: (p: SEOPage) => string | null) {
    const results: BulkFinding[] = []
    for (const p of pages) {
      const detail = fn(p)
      if (detail) results.push({ pageId: p.id, pageName: p.name, url: p.url, detail })
    }
    setActiveAudit(label)
    setFindings(results)
  }

  const audits: Array<{ label: string; fn: (p: SEOPage) => string | null }> = [
    { label: 'Missing Meta Descriptions', fn: (p) => !p.settings.metaDescription ? 'No meta description' : null },
    { label: 'Duplicate SEO Titles', fn: (p) => {
      const dupes = pages.filter((q) => q.settings.seoTitle === p.settings.seoTitle && q.id !== p.id)
      return dupes.length ? `Duplicate of: ${dupes.map((q) => q.name).join(', ')}` : null
    }},
    { label: 'Duplicate Meta Descriptions', fn: (p) => {
      const dupes = pages.filter((q) => q.settings.metaDescription && q.settings.metaDescription === p.settings.metaDescription && q.id !== p.id)
      return dupes.length ? `Duplicate of: ${dupes.map((q) => q.name).join(', ')}` : null
    }},
    { label: 'Pages Not in Sitemap', fn: (p) => !p.settings.includeInSitemap ? 'Excluded from sitemap' : null },
    { label: 'Pages Marked noindex', fn: (p) => p.settings.indexSetting === 'noindex' ? 'Set to noindex' : null },
    { label: 'Broken Internal Links', fn: (p) => p.technical.brokenInternalLinks.length ? `${p.technical.brokenInternalLinks.length} broken link(s)` : null },
    { label: 'Oversized Images', fn: (p) => {
      const heavy = p.images.filter((i) => i.fileSizeKb && i.fileSizeKb > 200)
      return heavy.length ? `${heavy.length} image(s) over 200KB` : null
    }},
    { label: 'Stale Content (6+ months)', fn: (p) => {
      const d = new Date(p.lastUpdated)
      return (Date.now() - d.getTime()) > 180 * 24 * 60 * 60 * 1000 ? `Last updated ${p.lastUpdated}` : null
    }},
    { label: 'Service Pages Without CTA', fn: (p) => (p.pageType === 'service' && !p.content.hasCTA) ? 'No CTA on service page' : null },
    { label: 'Inventory Without Images', fn: (p) => (p.pageType === 'inventory' && p.images.length === 0) ? 'No images on inventory page' : null },
    { label: 'Service Pages Without FAQ', fn: (p) => (p.pageType === 'service' && !p.content.hasFAQ) ? 'Missing FAQ content' : null },
  ]

  const safeBulkActions = [
    {
      label: 'Regenerate Sitemap',
      description: 'Rebuild sitemap.xml based on current inclusion settings.',
      action: () => alert('TODO: Regenerate sitemap — write to /public/sitemap.xml from all included pages'),
    },
    {
      label: 'Apply OG Fallback Image',
      description: 'Set /hero.PNG as the OG image on all pages missing one.',
      action: () => alert('TODO: Bulk-set fallback OG image on pages with empty ogImageUrl'),
    },
    {
      label: 'Draft Meta Descriptions',
      description: 'Generate draft meta descriptions for pages missing them.',
      action: () => alert('TODO: AI-generate draft meta descriptions — requires AI assistant integration'),
    },
    {
      label: 'Mark Archived Inventory noindex',
      description: 'Set noindex on inventory pages marked as archived/sold.',
      action: () => alert('TODO: Bulk noindex archived inventory — query inventory status from Supabase'),
    },
    {
      label: 'Draft Alt Text Suggestions',
      description: 'Generate alt text suggestions for images missing them.',
      action: () => alert('TODO: AI-generate alt text from image analysis'),
    },
  ]

  return (
    <div className="mt-8 bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="text-left">
          <p className="font-bold text-gray-900">Bulk SEO Tools</p>
          <p className="text-xs text-gray-400 mt-0.5">Audit across all pages and take safe bulk actions</p>
        </div>
        <span className="text-gray-400 text-xl">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="border-t border-gray-100 p-6 space-y-6">
          {/* Audit tools */}
          <div>
            <SectionHeading>Audit Tools</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {audits.map((audit) => (
                <button
                  key={audit.label}
                  onClick={() => runAudit(audit.label, audit.fn)}
                  className={`text-left px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                    activeAudit === audit.label
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {audit.label}
                </button>
              ))}
            </div>
          </div>

          {/* Audit results */}
          {activeAudit && (
            <div>
              <SectionHeading>{activeAudit} — {findings.length} found</SectionHeading>
              {findings.length === 0 ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-700 font-semibold">✓ All pages pass this check.</div>
              ) : (
                <div className="space-y-1.5">
                  {findings.map((f) => (
                    <div key={f.pageId} className="flex items-center gap-3 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                      <span className="text-xs font-bold text-gray-800 min-w-32">{f.pageName}</span>
                      <span className="text-xs font-mono text-gray-400">{f.url}</span>
                      <span className="ml-auto text-xs text-amber-700 font-semibold">{f.detail}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Safe bulk actions */}
          <div>
            <SectionHeading>Safe Bulk Actions</SectionHeading>
            <div className="space-y-2">
              {safeBulkActions.map((action) => (
                <div key={action.label} className="flex items-center gap-4 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{action.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{action.description}</p>
                  </div>
                  <ActionButton onClick={action.action}>{action.label}</ActionButton>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700">
              Safe bulk actions never delete pages, change robots settings sitewide, mass redirect, or publish content without individual review.
            </div>
          </div>

          {/* Future integrations placeholder */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Google Search Console', note: 'Clicks, impressions, position, CTR, index status' },
              { label: 'Google Analytics', note: 'Traffic, bounce rate, conversion by page' },
              { label: 'PageSpeed Insights', note: 'CLS, LCP, FID scores per page' },
              { label: 'Google Business Profile', note: 'Reviews, Q&A, photo performance' },
              { label: 'Call Tracking', note: 'Phone calls attributed per landing page' },
              { label: 'Review Platform', note: 'Multi-platform review aggregation' },
            ].map((fi) => (
              <div key={fi.label} className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-3">
                <p className="text-xs font-bold text-gray-500">{fi.label}</p>
                {/* TODO: {fi.label} integration */}
                <p className="text-xs text-gray-400 mt-0.5">{fi.note}</p>
                <p className="text-xs text-blue-400 mt-1 font-semibold">Coming soon</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
