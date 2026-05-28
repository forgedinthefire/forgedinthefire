import type { SEOHistoryEntry } from '../../seoTypes'
import { SectionHeading, ActionButton } from '../SEOPrimitives'

type Props = { history: SEOHistoryEntry[]; onRestore?: (entry: SEOHistoryEntry) => void }

export default function HistoryTab({ history, onRestore }: Props) {
  const sorted = [...history].sort((a, b) => b.changedAt.localeCompare(a.changedAt))

  return (
    <div className="space-y-4">
      <SectionHeading>Change History ({sorted.length})</SectionHeading>
      {sorted.length === 0 ? (
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-8 text-center text-sm text-gray-400">
          No changes recorded yet. Changes will appear here as you edit SEO settings.
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((entry) => (
            <div key={entry.id} className="bg-white border border-gray-200 rounded-xl px-4 py-3">
              <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-800">{entry.changedBy}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs text-gray-500">{entry.changedAt.replace('T', ' ').slice(0, 16)}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs font-mono bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">{entry.field}</span>
                </div>
                {onRestore && (
                  <ActionButton onClick={() => onRestore(entry)}>Restore</ActionButton>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs font-semibold text-gray-400 mb-0.5">Before</p>
                  <p className="text-xs text-red-700 bg-red-50 border border-red-100 rounded px-2 py-1 font-mono break-all">{entry.oldValue || '(empty)'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 mb-0.5">After</p>
                  <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-2 py-1 font-mono break-all">{entry.newValue || '(empty)'}</p>
                </div>
              </div>
              {entry.reason && <p className="text-xs text-gray-400 mt-1.5 italic">{entry.reason}</p>}
            </div>
          ))}
        </div>
      )}
      {/* TODO: Persist history to Supabase seo_history table */}
      <p className="text-xs text-gray-300 text-center">History is stored locally. TODO: sync to Supabase for cross-device audit trail.</p>
    </div>
  )
}
