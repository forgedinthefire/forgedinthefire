'use client'
import { useState } from 'react'
import type { SEOPage, SEOSettings, SchemaSettings, ImageSEO, InternalLinkSuggestion, LocalSEOSettings, RedirectRule, SEOHistoryEntry } from '../seoTypes'
import { ActionButton } from './SEOPrimitives'

import OverviewTab from './tabs/OverviewTab'
import SearchAppearanceTab from './tabs/SearchAppearanceTab'
import ContentSEOTab from './tabs/ContentSEOTab'
import TechnicalSEOTab from './tabs/TechnicalSEOTab'
import SchemaTab from './tabs/SchemaTab'
import ImagesTab from './tabs/ImagesTab'
import InternalLinksTab from './tabs/InternalLinksTab'
import LocalSEOTab from './tabs/LocalSEOTab'
import SocialPreviewTab from './tabs/SocialPreviewTab'
import RedirectsTab from './tabs/RedirectsTab'
import HistoryTab from './tabs/HistoryTab'
import RecommendationsTab from './tabs/RecommendationsTab'
import { nanoid } from 'nanoid'

const TABS = [
  { id: 'overview',       label: 'Overview' },
  { id: 'search',         label: 'Search Appearance' },
  { id: 'content',        label: 'Content SEO' },
  { id: 'technical',      label: 'Technical' },
  { id: 'schema',         label: 'Schema' },
  { id: 'images',         label: 'Images' },
  { id: 'links',          label: 'Internal Links' },
  { id: 'local',          label: 'Local SEO' },
  { id: 'social',         label: 'Social Preview' },
  { id: 'redirects',      label: 'Redirects' },
  { id: 'history',        label: 'History' },
  { id: 'recommendations',label: 'Recommendations' },
] as const

type TabId = typeof TABS[number]['id']

type Props = {
  page: SEOPage
  onSave: (updated: SEOPage) => void
  onClose: () => void
}

export default function SEOPagePanel({ page, onSave, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [draft, setDraft] = useState<SEOPage>(page)
  const [saved, setSaved] = useState(false)

  function patchSettings(patch: Partial<SEOSettings>) {
    setDraft((d) => ({ ...d, settings: { ...d.settings, ...patch } }))
  }
  function patchSchema(patch: Partial<SchemaSettings>) {
    setDraft((d) => ({ ...d, schema: { ...d.schema, ...patch } }))
  }
  function patchImages(images: ImageSEO[]) {
    setDraft((d) => ({ ...d, images }))
  }
  function patchLinks(links: InternalLinkSuggestion[]) {
    setDraft((d) => ({ ...d, internalLinks: links }))
  }
  function patchLocalSEO(patch: Partial<LocalSEOSettings>) {
    setDraft((d) => ({ ...d, localSEO: { ...d.localSEO, ...patch } }))
  }
  function addRedirect(rule: Omit<RedirectRule, 'id' | 'hitCount' | 'status'>) {
    setDraft((d) => ({
      ...d,
      redirects: [...d.redirects, { ...rule, id: nanoid(), hitCount: 0, status: 'active' as const }],
    }))
  }
  function handleAutoFix(issueId: string) {
    const issue = draft.issues.find((i) => i.id === issueId)
    if (!issue) return
    const patch: Partial<SEOSettings> = {}
    if (issueId.includes('meta') && issue.suggestedFix) patch.metaDescription = issue.suggestedFix
    if (issueId.includes('title') && issue.suggestedFix) patch.seoTitle = issue.suggestedFix
    if (Object.keys(patch).length > 0) patchSettings(patch)
    setDraft((d) => ({ ...d, issues: d.issues.filter((i) => i.id !== issueId) }))
  }
  function handleRestoreHistory(entry: SEOHistoryEntry) {
    if (!confirm(`Restore "${entry.field}" to: "${entry.oldValue}"?`)) return
    patchSettings({ [entry.field]: entry.oldValue } as Partial<SEOSettings>)
  }

  function save() {
    onSave(draft)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const issueCountByTab: Partial<Record<TabId, number>> = {
    overview:        draft.issues.length,
    content:         draft.issues.filter((i) => i.category === 'content').length,
    technical:       draft.issues.filter((i) => i.category === 'technical').length,
    schema:          draft.issues.filter((i) => i.category === 'schema').length,
    images:          draft.issues.filter((i) => i.category === 'images').length,
    links:           draft.issues.filter((i) => i.category === 'links').length,
    local:           draft.issues.filter((i) => i.category === 'local').length,
    social:          draft.issues.filter((i) => i.category === 'social').length,
    recommendations: draft.issues.length,
  }

  return (
    <div className="border-t-2 border-blue-600 bg-white rounded-b-2xl shadow-lg overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center gap-0 overflow-x-auto border-b border-gray-200 bg-gray-50 scrollbar-hide">
        {TABS.map((tab) => {
          const count = issueCountByTab[tab.id]
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-4 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-700 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-white'
              }`}
            >
              {tab.label}
              {count && count > 0 && tab.id !== 'overview' ? (
                <span className="ml-1.5 text-xs bg-red-500 text-white rounded-full w-4 h-4 inline-flex items-center justify-center font-bold">
                  {count > 9 ? '9+' : count}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div className="p-6">
        {activeTab === 'overview' && <OverviewTab page={draft} onAutoFix={handleAutoFix} />}
        {activeTab === 'search' && <SearchAppearanceTab settings={draft.settings} onChange={patchSettings} pageName={draft.name} />}
        {activeTab === 'content' && <ContentSEOTab content={draft.content} settings={draft.settings} onSettingsChange={patchSettings} />}
        {activeTab === 'technical' && <TechnicalSEOTab technical={draft.technical} settings={draft.settings} onSettingsChange={patchSettings} />}
        {activeTab === 'schema' && <SchemaTab schema={draft.schema} pageType={draft.pageType} onChange={patchSchema} />}
        {activeTab === 'images' && <ImagesTab images={draft.images} onChange={patchImages} />}
        {activeTab === 'links' && <InternalLinksTab links={draft.internalLinks} pageType={draft.pageType} onChange={patchLinks} />}
        {activeTab === 'local' && <LocalSEOTab localSEO={draft.localSEO} onChange={patchLocalSEO} />}
        {activeTab === 'social' && <SocialPreviewTab settings={draft.settings} onChange={patchSettings} />}
        {activeTab === 'redirects' && <RedirectsTab redirects={draft.redirects} pageUrl={draft.url} onAdd={addRedirect} />}
        {activeTab === 'history' && <HistoryTab history={draft.history} onRestore={handleRestoreHistory} />}
        {activeTab === 'recommendations' && <RecommendationsTab issues={draft.issues} onAutoFix={handleAutoFix} />}
      </div>

      {/* Footer save bar */}
      <div className="sticky bottom-0 flex items-center justify-between gap-4 px-6 py-3 bg-white border-t border-gray-200">
        <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
          Close Panel
        </button>
        <div className="flex items-center gap-3">
          {saved && <span className="text-xs text-emerald-600 font-bold animate-pulse">✓ Saved</span>}
          <ActionButton variant="primary" onClick={save}>Save Changes</ActionButton>
        </div>
      </div>
    </div>
  )
}
