import type { SEOIssue, SEOIssueCategory } from '../../seoTypes'
import { CATEGORY_LABELS } from '../../seoTypes'
import { SectionHeading, IssueCard } from '../SEOPrimitives'

type Props = { issues: SEOIssue[]; onAutoFix: (id: string) => void }

export default function RecommendationsTab({ issues, onAutoFix }: Props) {
  const red = issues.filter((i) => i.severity === 'red')
  const yellow = issues.filter((i) => i.severity === 'yellow')
  const green = issues.filter((i) => i.severity === 'green')

  const categories = Array.from(new Set(issues.map((i) => i.category))) as SEOIssueCategory[]

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Critical', count: red.length, color: 'bg-red-50 border-red-200 text-red-700' },
          { label: 'Improvements', count: yellow.length, color: 'bg-amber-50 border-amber-200 text-amber-700' },
          { label: 'Passed', count: green.length, color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
        ].map((s) => (
          <div key={s.label} className={`border rounded-xl p-3 text-center ${s.color}`}>
            <p className="text-2xl font-bold">{s.count}</p>
            <p className="text-xs font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {issues.length === 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center">
          <p className="text-3xl mb-2">🎉</p>
          <p className="text-emerald-700 font-bold">No issues found!</p>
          <p className="text-emerald-600 text-sm mt-1">This page is fully optimized.</p>
        </div>
      )}

      {/* Red issues first */}
      {red.length > 0 && (
        <>
          <SectionHeading>Critical Issues — Fix Immediately</SectionHeading>
          <div className="space-y-2">
            {red.map((issue) => <IssueCard key={issue.id} issue={issue} onAutoFix={onAutoFix} />)}
          </div>
        </>
      )}

      {yellow.length > 0 && (
        <>
          <SectionHeading>Recommended Improvements</SectionHeading>
          <div className="space-y-2">
            {yellow.map((issue) => <IssueCard key={issue.id} issue={issue} onAutoFix={onAutoFix} />)}
          </div>
        </>
      )}

      {/* By category */}
      {categories.length > 1 && (
        <>
          <SectionHeading>Issues by Category</SectionHeading>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {categories.map((cat) => {
              const catIssues = issues.filter((i) => i.category === cat)
              const hasRed = catIssues.some((i) => i.severity === 'red')
              return (
                <div key={cat} className={`border rounded-xl p-3 ${hasRed ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'}`}>
                  <p className="text-xs font-bold text-gray-700">{CATEGORY_LABELS[cat]}</p>
                  <p className={`text-lg font-bold ${hasRed ? 'text-red-700' : 'text-amber-700'}`}>{catIssues.length}</p>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Safe one-click fixes legend */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-800 space-y-1">
        <p className="font-bold text-blue-900 mb-2">About Auto-Fix</p>
        <p>Safe auto-fixes only generate or set default values. They never publish, delete, redirect en masse, change robots settings, or modify visible page content without admin review.</p>
        <p className="mt-1 text-blue-600">Changes that require developer action are marked <span className="font-bold">Dev needed</span>.</p>
      </div>
    </div>
  )
}
