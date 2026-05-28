// Server-safe SEO utilities — no browser APIs, importable from server components
import type { SEOPage, SEODashboardSummary } from './seoTypes'

export function getSEODashboardSummary(pages: SEOPage[]): SEODashboardSummary {
  const green = pages.filter((p) => p.health === 'green').length
  const yellow = pages.filter((p) => p.health === 'yellow').length
  const red = pages.filter((p) => p.health === 'red').length
  const missingMeta = pages.filter((p) => !p.settings.metaDescription || !p.settings.seoTitle).length
  const indexIssues = pages.filter((p) => !p.technical.isIndexable || p.technical.robotsBlocked).length
  const brokenLinks = pages.filter((p) => p.technical.brokenInternalLinks.length > 0).length
  const needsUpdate = pages.filter((p) => {
    const d = new Date(p.lastUpdated)
    return (Date.now() - d.getTime()) > 180 * 24 * 60 * 60 * 1000
  }).length
  const overallHealth = pages.length
    ? Math.round(pages.reduce((s, p) => s + p.score, 0) / pages.length)
    : 0
  return { overallHealth, greenCount: green, yellowCount: yellow, redCount: red, missingMetadataCount: missingMeta, indexingIssuesCount: indexIssues, brokenLinksCount: brokenLinks, needsUpdateCount: needsUpdate }
}
