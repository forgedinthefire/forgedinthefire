import { useState } from 'react'
import type { RedirectRule } from '../../seoTypes'
import { SectionHeading, ActionButton } from '../SEOPrimitives'

type Props = {
  redirects: RedirectRule[]
  pageUrl: string
  onAdd: (rule: Omit<RedirectRule, 'id' | 'hitCount' | 'status'>) => void
}

export default function RedirectsTab({ redirects, pageUrl, onAdd }: Props) {
  const [form, setForm] = useState({ fromUrl: '', toUrl: pageUrl, type: '301' as '301' | '302', notes: '' })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.fromUrl) return
    onAdd({ fromUrl: form.fromUrl, toUrl: form.toUrl, type: form.type, createdAt: new Date().toISOString().split('T')[0], createdBy: 'admin', notes: form.notes })
    setForm({ fromUrl: '', toUrl: pageUrl, type: '301', notes: '' })
  }

  return (
    <div className="space-y-5">
      <SectionHeading>Active Redirects</SectionHeading>
      {redirects.length === 0 ? (
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6 text-center text-sm text-gray-400">
          No redirects set up for this page.
        </div>
      ) : (
        <div className="space-y-2">
          {redirects.map((r) => (
            <div key={r.id} className={`border rounded-xl px-4 py-3 ${r.status === 'active' ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">{r.type}</span>
                <span className="text-xs font-mono text-gray-500">{r.fromUrl}</span>
                <span className="text-gray-300">→</span>
                <span className="text-xs font-mono text-gray-700">{r.toUrl}</span>
                <span className="ml-auto text-xs text-gray-400">{r.hitCount} hits · {r.createdAt}</span>
                {r.status === 'inactive' && <span className="text-xs text-gray-400">Inactive</span>}
              </div>
              {r.notes && <p className="text-xs text-gray-400 mt-1 ml-1">{r.notes}</p>}
            </div>
          ))}
        </div>
      )}

      <SectionHeading>Create Redirect</SectionHeading>
      <form onSubmit={submit} className="space-y-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          ⚠ Creating a redirect affects how Google crawls and indexes your URLs. Only redirect when changing a slug or retiring a page.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">From URL (old) <span className="text-red-400">*</span></label>
            <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30" value={form.fromUrl} onChange={(e) => setForm({ ...form, fromUrl: e.target.value })} placeholder="/old-url-slug" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">To URL (new)</label>
            <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30" value={form.toUrl} onChange={(e) => setForm({ ...form, toUrl: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Redirect Type</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as '301' | '302' })}>
              <option value="301">301 — Permanent (passes SEO value)</option>
              <option value="302">302 — Temporary (no SEO value transfer)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Notes</label>
            <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Why was this redirect created?" />
          </div>
        </div>
        <ActionButton variant="primary" onClick={() => {}}>
          <span onClick={undefined}>Create Redirect</span>
        </ActionButton>
        {/* TODO: Write redirect to next.config.ts redirects array (developer action required) */}
        <p className="text-xs text-gray-400">Redirects are stored in the admin database. A developer must apply them to <code className="bg-gray-100 px-1 rounded">next.config.ts</code> for live use.</p>
      </form>
    </div>
  )
}
