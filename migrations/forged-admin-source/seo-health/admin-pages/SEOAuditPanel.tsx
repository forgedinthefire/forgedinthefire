'use client'

import { useState } from 'react'
import { 
  Search, AlertCircle, CheckCircle, Clock, 
  ExternalLink, ChevronDown, ChevronUp, RefreshCw,
  Globe, AlertTriangle
} from 'lucide-react'

interface SEOAuditData {
  timestamp: string
  baseUrl: string
  totalRoutes: number
  crawled: number
  errors: number
  summary: {
    avgLoadTime: number
    missingTitles: string[]
    missingDescriptions: string[]
    missingH1: string[]
    multipleH1: string[]
    missingAltText: Array<{ route: string; count: number; images: string[] }>
    missingCanonical: string[]
    missingOgImage: string[]
    brokenPages: string[]
  }
  issues: Array<{
    severity: 'critical' | 'high' | 'medium' | 'low'
    route: string
    issue: string
  }>
  recommendations: string[]
  routes: Array<{
    route: string
    url: string
    status: number
    loadTime: number
    title: string | null
    metaDescription: string | null
    canonical: string | null
    hasH1: boolean
    h1Count: number
    images: Array<{ src: string; alt: string | null; hasAlt: boolean }>
    ogTags: Record<string, string>
  }>
}

interface SEOAuditPanelProps {
  auditData: SEOAuditData | null
}

export default function SEOAuditPanel({ auditData }: SEOAuditPanelProps) {
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null)

  if (!auditData) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">No SEO Data Available</h2>
        <p className="text-gray-500 mb-4">Run the SEO crawler to generate audit data</p>
        <code className="bg-gray-100 px-3 py-2 rounded-lg text-sm font-mono">
          node scripts/seo-crawler.mjs
        </code>
      </div>
    )
  }

  const criticalCount = auditData.issues.filter(i => i.severity === 'critical').length
  const highCount = auditData.issues.filter(i => i.severity === 'high').length
  const mediumCount = auditData.issues.filter(i => i.severity === 'medium').length
  const lowCount = auditData.issues.filter(i => i.severity === 'low').length

  const score = Math.max(0, 100 - (criticalCount * 15) - (highCount * 10) - (mediumCount * 5) - (lowCount * 2))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SEO Control Center</h1>
          <p className="text-sm text-gray-500">
            Last crawled: {new Date(auditData.timestamp).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-3xl font-bold" style={{ color: score >= 90 ? '#10b981' : score >= 70 ? '#f59e0b' : '#ef4444' }}>
              {score}
            </p>
            <p className="text-xs text-gray-400">SEO Score</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          label="Pages Crawled" 
          value={`${auditData.crawled}/${auditData.totalRoutes}`}
          icon={Globe}
          color="#3b82f6"
        />
        <StatCard 
          label="Avg Load Time" 
          value={`${auditData.summary.avgLoadTime}ms`}
          sub={auditData.summary.avgLoadTime > 2000 ? 'Slow' : 'Good'}
          icon={Clock}
          color={auditData.summary.avgLoadTime > 2000 ? '#ef4444' : '#10b981'}
        />
        <StatCard 
          label="Critical Issues" 
          value={criticalCount}
          icon={AlertCircle}
          color="#ef4444"
        />
        <StatCard 
          label="Total Issues" 
          value={auditData.issues.length}
          icon={AlertTriangle}
          color="#f59e0b"
        />
      </div>

      {/* Issues by Severity */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Issues by Severity</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {/* Critical */}
          {criticalCount > 0 && (
            <IssueSection 
              severity="critical" 
              count={criticalCount}
              issues={auditData.issues.filter(i => i.severity === 'critical')}
              color="#ef4444"
              bgColor="bg-red-50"
              expanded={expandedIssue === 'critical'}
              onToggle={() => setExpandedIssue(expandedIssue === 'critical' ? null : 'critical')}
            />
          )}
          
          {/* High */}
          {highCount > 0 && (
            <IssueSection 
              severity="high" 
              count={highCount}
              issues={auditData.issues.filter(i => i.severity === 'high')}
              color="#ea580c"
              bgColor="bg-orange-50"
              expanded={expandedIssue === 'high'}
              onToggle={() => setExpandedIssue(expandedIssue === 'high' ? null : 'high')}
            />
          )}
          
          {/* Medium */}
          {mediumCount > 0 && (
            <IssueSection 
              severity="medium" 
              count={mediumCount}
              issues={auditData.issues.filter(i => i.severity === 'medium').slice(0, 10)}
              color="#f59e0b"
              bgColor="bg-amber-50"
              expanded={expandedIssue === 'medium'}
              onToggle={() => setExpandedIssue(expandedIssue === 'medium' ? null : 'medium')}
            />
          )}
          
          {/* Low */}
          {lowCount > 0 && (
            <IssueSection 
              severity="low" 
              count={lowCount}
              issues={auditData.issues.filter(i => i.severity === 'low').slice(0, 5)}
              color="#6b7280"
              bgColor="bg-gray-50"
              expanded={expandedIssue === 'low'}
              onToggle={() => setExpandedIssue(expandedIssue === 'low' ? null : 'low')}
            />
          )}
          
          {auditData.issues.length === 0 && (
            <div className="p-8 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No issues found!</p>
              <p className="text-sm text-gray-400">Your site is fully optimized</p>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      {auditData.recommendations.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-bold text-gray-900 mb-4">Recommendations</h2>
          <ul className="space-y-2">
            {auditData.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Pages Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Pages Overview</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Page</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Load Time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">H1</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Issues</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {auditData.routes.map((route) => {
                const routeIssues = auditData.issues.filter(i => i.route === route.route)
                return (
                  <tr key={route.route} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono text-gray-600">{route.route}</code>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                      {route.title || <span className="text-red-500 italic">No title</span>}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={route.loadTime > 3000 ? 'text-red-600' : route.loadTime > 1000 ? 'text-amber-600' : 'text-emerald-600'}>
                        {route.loadTime}ms
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {route.hasH1 ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {routeIssues.length > 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                          <AlertCircle className="w-3 h-3" />
                          {routeIssues.length}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          OK
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <a 
                        href={route.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── Components ───────────────────────────────────────────────────────────────

function StatCard({ 
  label, 
  value, 
  sub,
  icon: Icon,
  color 
}: { 
  label: string
  value: string | number
  sub?: string
  icon: React.ElementType
  color: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs mt-1" style={{ color }}>{sub}</p>}
    </div>
  )
}

function IssueSection({ 
  severity, 
  count, 
  issues,
  color,
  bgColor,
  expanded,
  onToggle
}: {
  severity: string
  count: number
  issues: Array<{ route: string; issue: string }>
  color: string
  bgColor: string
  expanded: boolean
  onToggle: () => void
}) {
  const severityLabels: Record<string, string> = {
    critical: 'Critical',
    high: 'High Priority',
    medium: 'Medium Priority',
    low: 'Low Priority'
  }

  return (
    <div className={bgColor}>
      <button 
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <span 
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="font-semibold text-gray-900">{severityLabels[severity]}</span>
          <span 
            className="px-2 py-0.5 rounded-full text-xs font-bold"
            style={{ backgroundColor: color, color: 'white' }}
          >
            {count}
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      
      {expanded && (
        <div className="px-5 pb-4">
          <ul className="space-y-2">
            {issues.map((issue, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <code className="text-xs font-mono text-gray-500 bg-white px-2 py-1 rounded shrink-0">
                  {issue.route}
                </code>
                <span className="text-gray-700">{issue.issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
