import type { SEOPage } from '../../seoTypes'
import { PAGE_TYPE_LABELS } from '../../seoTypes'
import { HealthLight, ScoreBadge, SectionHeading, IssueCard, ActionButton } from '../SEOPrimitives'

type Props = { page: SEOPage; onAutoFix: (issueId: string) => void }

export default function OverviewTab({ page, onAutoFix }: Props) {
  const topIssue = page.issues.find((i) => i.severity === 'red') ?? page.issues[0]

  const rows = [
    { label: 'Page URL', value: page.url },
    { label: 'Page Type', value: PAGE_TYPE_LABELS[page.pageType] },
    { label: 'Status', value: page.indexStatus === 'index' ? '✓ Indexable' : '✕ Noindex' },
    { label: 'In Sitemap', value: page.settings.includeInSitemap ? '✓ Yes' : '✕ No' },
    { label: 'Canonical', value: page.settings.useDefaultCanonical ? 'Default (self)' : page.settings.canonicalUrl },
    { label: 'Last Updated', value: page.lastUpdated },
    { label: 'Last SEO Scan', value: page.lastSEOScan },
    { label: 'Primary Keyword', value: page.settings.primaryKeyword || '—' },
    { label: 'Top Issue', value: topIssue ? topIssue.title : 'None 🎉' },
  ]

  return (
    <div className="space-y-6">
      {/* Score + health */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">SEO Score</p>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold" style={{ color: '#0d2b55' }}>{page.score}</span>
            <ScoreBadge score={page.score} />
          </div>
        </div>
        <div className="h-10 w-px bg-gray-200" />
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Health</p>
          <div className="flex items-center gap-2">
            <HealthLight status={page.health} size="lg" />
            <span className="text-sm font-bold capitalize text-gray-800">{page.health}</span>
          </div>
        </div>
        <div className="h-10 w-px bg-gray-200" />
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Issues</p>
          <div className="flex items-center gap-1.5">
            {['red','yellow','green'].map((s) => {
              const c = page.issues.filter((i) => i.severity === s).length
              return c > 0 ? (
                <span key={s} className={`text-xs font-bold px-2 py-0.5 rounded-full ${s === 'red' ? 'bg-red-100 text-red-700' : s === 'yellow' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {c} {s}
                </span>
              ) : null
            })}
            {page.issues.length === 0 && <span className="text-xs text-emerald-600 font-bold">All clear</span>}
          </div>
        </div>
      </div>

      {/* Info table */}
      <SectionHeading>Page Overview</SectionHeading>
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        {rows.map((r, i) => (
          <div key={r.label} className={`flex gap-4 px-4 py-2.5 ${i % 2 === 0 ? 'bg-gray-50/50' : ''}`}>
            <span className="text-xs font-semibold text-gray-500 w-36 shrink-0">{r.label}</span>
            <span className="text-xs text-gray-800 font-mono break-all">{r.value}</span>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <ActionButton variant="primary" onClick={() => window.open(page.url, '_blank')}>View Public Page ↗</ActionButton>
        <ActionButton onClick={() => alert('TODO: Open Google result preview')}>Preview Google Result</ActionButton>
        <ActionButton onClick={() => alert('TODO: Trigger SEO re-scan')}>Run SEO Scan</ActionButton>
        {/* TODO: Regenerate Metadata via AI */}
        <ActionButton onClick={() => alert('TODO: AI-generate metadata — requires AI assistant integration')}>Regenerate Metadata</ActionButton>
      </div>

      {/* Issues */}
      {page.issues.length > 0 && (
        <>
          <SectionHeading>Active Issues</SectionHeading>
          <div className="space-y-2">
            {page.issues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} onAutoFix={onAutoFix} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
