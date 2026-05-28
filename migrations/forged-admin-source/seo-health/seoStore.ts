'use client'
// ─────────────────────────────────────────────────────────────────────────────
// SEO Center — mock persistence layer
// Uses localStorage for now.
// TODO: Replace with Supabase table `seo_page_settings` (id, page_id, settings jsonb, updated_at)
// TODO: Add audit log table `seo_history` for full change tracking
// ─────────────────────────────────────────────────────────────────────────────

import type { SEOPage, SEOSettings, SEOHistoryEntry, RedirectRule } from './seoTypes'
export { getSEODashboardSummary } from './seoUtils'
import { MOCK_SEO_PAGES } from './seoMockData'
import { nanoid } from 'nanoid'

const STORE_KEY = 'tm_seo_pages'

export function getAllSEOPages(): SEOPage[] {
  if (typeof window === 'undefined') return MOCK_SEO_PAGES
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (!raw) return MOCK_SEO_PAGES
    return JSON.parse(raw) as SEOPage[]
  } catch {
    return MOCK_SEO_PAGES
  }
}

function saveAll(pages: SEOPage[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORE_KEY, JSON.stringify(pages))
}

export function getSEOPage(id: string): SEOPage | null {
  return getAllSEOPages().find((p) => p.id === id) ?? null
}

export function updateSEOSettings(
  pageId: string,
  settings: Partial<SEOSettings>,
  changedBy = 'admin',
): SEOPage | null {
  const pages = getAllSEOPages()
  const idx = pages.findIndex((p) => p.id === pageId)
  if (idx === -1) return null

  const prev = pages[idx]
  const historyEntries: SEOHistoryEntry[] = []

  for (const [field, newValue] of Object.entries(settings)) {
    const oldValue = (prev.settings as Record<string, unknown>)[field]
    if (oldValue !== newValue) {
      historyEntries.push({
        id: nanoid(),
        pageId,
        changedBy,
        field,
        oldValue: String(oldValue ?? ''),
        newValue: String(newValue ?? ''),
        changedAt: new Date().toISOString(),
      })
    }
  }

  pages[idx] = {
    ...prev,
    settings: { ...prev.settings, ...settings },
    lastUpdated: new Date().toISOString().split('T')[0],
    history: [...prev.history, ...historyEntries],
  }
  saveAll(pages)
  return pages[idx]
}

export function addRedirect(pageId: string, rule: Omit<RedirectRule, 'id' | 'hitCount' | 'status'>): void {
  const pages = getAllSEOPages()
  const idx = pages.findIndex((p) => p.id === pageId)
  if (idx === -1) return
  pages[idx].redirects = [
    ...pages[idx].redirects,
    { ...rule, id: nanoid(), hitCount: 0, status: 'active' },
  ]
  saveAll(pages)
}


export function resetToMockData(): void {
  if (typeof window !== 'undefined') localStorage.removeItem(STORE_KEY)
}
