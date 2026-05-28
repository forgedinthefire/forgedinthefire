'use client'
import { useState, useCallback } from 'react'
import type { SEOPage } from './seoTypes'
import { PAGE_TYPE_LABELS } from './seoTypes'
import { getAllSEOPages, updateSEOSettings } from './seoStore'
import { getSEODashboardSummary } from './seoUtils'
import { HealthLight, ScoreBadge } from './components/SEOPrimitives'
import SEOPagePanel from './components/SEOPagePanel'
import BulkSEOTools from './components/BulkSEOTools'

const NAVY = '#0d2b55'

// ── Summary card ──────────────────────────────────────────────────────────────
function SummaryCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{label}</p>
      <p className="text-3xl font-bold" style={{ color: accent ?? NAVY }}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

// ── Page row ──────────────────────────────────────────────────────────────────
function PageRow({
  page, isExpanded, onToggle,
}: { page: SEOPage; isExpanded: boolean; onToggle: () => void }) {
  const redIssues = page.issues.filter((i) => i.severity === 'red').length
  const yellowIssues = page.issues.filter((i) => i.severity === 'yellow').length

  return (
    <tr
      className={`cursor-pointer transition-colors ${isExpanded ? 'bg-blue-50' : 'hover:bg-gray-50/80'}`}
      onClick={onToggle}
    >
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-2.5">
          <HealthLight status={page.health} />
          <span className="text-sm font-semibold text-gray-900">{page.name}</span>
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-xs px-2 py-1 rounded-full font-semibold bg-gray-100 text-gray-600">
          {PAGE_TYPE_LABELS[page.pageType]}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs font-mono text-gray-500 truncate max-w-xs block">{page.url}</span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <ScoreBadge score={page.score} />
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className={`text-xs font-semibold ${page.indexStatus === 'index' ? 'text-emerald-600' : 'text-red-600'}`}>
          {page.indexStatus === 'index' ? '✓ Index' : '✕ Noindex'}
        </span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-xs text-gray-500 truncate max-w-28 block">{page.settings.primaryKeyword || '—'}</span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-1">
          {redIssues > 0 && <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700">{redIssues}</span>}
          {yellowIssues > 0 && <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">{yellowIssues}</span>}
          {redIssues === 0 && yellowIssues === 0 && <span className="text-xs text-emerald-600 font-bold">✓</span>}
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-400">{page.lastUpdated}</td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className={`text-xs transition-colors ${isExpanded ? 'text-blue-600' : 'text-gray-300'}`}>
          {isExpanded ? '▲' : '▼'}
        </span>
      </td>
    </tr>
  )
}

// ── Main dashboard ────────────────────────────────────────────────────────────
export default function SEODashboard() {
  const [pages, setPages] = useState<SEOPage[]>(() => getAllSEOPages())
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterHealth, setFilterHealth] = useState<string>('')
  const [filterType, setFilterType] = useState<string>('')

  const summary = getSEODashboardSummary(pages)

  const filtered = pages.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.url.toLowerCase().includes(search.toLowerCase())
    const matchHealth = !filterHealth || p.health === filterHealth
    const matchType = !filterType || p.pageType === filterType
    return matchSearch && matchHealth && matchType
  })

  function toggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const handleSave = useCallback((updated: SEOPage) => {
    updateSEOSettings(updated.id, updated.settings)
    setPages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
  }, [])

  const healthColor = summary.overallHealth >= 90 ? '#10b981' : summary.overallHealth >= 70 ? '#f59e0b' : '#ef4444'

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: NAVY, fontFamily: 'var(--font-display), Georgia, serif' }}>
            SEO Control Center
          </h1>
          <p className="text-gray-400 text-sm">Manage search visibility for every public page without touching code.</p>
        </div>
        <div className="flex gap-2">
          {/* TODO: Export SEO report as CSV/PDF */}
          <button className="text-xs font-semibold px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-700 transition-colors shadow-sm" onClick={() => alert('TODO: Export SEO audit report')}>
            Export Report
          </button>
          <button className="text-xs font-semibold px-4 py-2.5 rounded-xl text-white transition-all hover:scale-105 shadow-sm" style={{ background: `linear-gradient(135deg, #1d4ed8, ${NAVY})` }} onClick={() => alert('TODO: Run full site SEO scan via crawler')}>
            Run Full Scan
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-4 mb-8">
        <SummaryCard label="Overall Health" value={`${summary.overallHealth}`} sub="avg score" accent={healthColor} />
        <SummaryCard label="Green Pages" value={summary.greenCount} sub="fully optimized" accent="#10b981" />
        <SummaryCard label="Yellow Pages" value={summary.yellowCount} sub="need improvement" accent="#f59e0b" />
        <SummaryCard label="Red Pages" value={summary.redCount} sub="critical issues" accent="#ef4444" />
        <SummaryCard label="Missing Metadata" value={summary.missingMetadataCount} sub="pages" />
        <SummaryCard label="Indexing Issues" value={summary.indexingIssuesCount} sub="pages" />
        <SummaryCard label="Broken Links" value={summary.brokenLinksCount} sub="pages affected" />
        <SummaryCard label="Needs Update" value={summary.needsUpdateCount} sub="6+ months old" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search pages..."
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none text-gray-700" value={filterHealth} onChange={(e) => setFilterHealth(e.target.value)}>
          <option value="">All Health</option>
          <option value="green">Green</option>
          <option value="yellow">Yellow</option>
          <option value="red">Red</option>
        </select>
        <select className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none text-gray-700" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">All Types</option>
          {Object.entries(PAGE_TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} pages</span>
      </div>

      {/* Page table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Page', 'Type', 'URL', 'Score', 'Index', 'Primary Keyword', 'Issues', 'Updated', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((page) => (
                <>
                  <PageRow
                    key={page.id}
                    page={page}
                    isExpanded={expandedId === page.id}
                    onToggle={() => toggle(page.id)}
                  />
                  {expandedId === page.id && (
                    <tr key={`${page.id}-panel`}>
                      <td colSpan={9} className="px-4 pb-4">
                        <SEOPagePanel
                          page={page}
                          onSave={handleSave}
                          onClose={() => setExpandedId(null)}
                        />
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">No pages match your filters.</div>
        )}
      </div>

      {/* Bulk tools */}
      <BulkSEOTools pages={pages} />

      {/* Future integration placeholders */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Google Search Console', items: ['Index status', 'Last crawl', 'Top queries', 'Mobile usability', 'Structured data results'] },
          { label: 'Google Analytics', items: ['Sessions per page', 'Bounce rate', 'Conversions', 'Top landing pages'] },
          { label: 'PageSpeed Insights', items: ['LCP', 'CLS', 'FID', 'Mobile score', 'Desktop score'] },
        ].map((card) => (
          <div key={card.label} className="bg-white border border-dashed border-gray-200 rounded-2xl p-5">
            {/* TODO: {card.label} API integration */}
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{card.label}</p>
            <p className="text-xs font-bold text-blue-400 mb-3">Integration coming soon</p>
            <ul className="space-y-1">
              {card.items.map((item) => <li key={item} className="text-xs text-gray-300">• {item}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
