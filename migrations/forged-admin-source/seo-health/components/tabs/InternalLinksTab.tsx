import type { InternalLinkSuggestion, SEOPageType } from '../../seoTypes'
import { SectionHeading, ActionButton } from '../SEOPrimitives'

const SUGGESTED_BY_TYPE: Record<SEOPageType, InternalLinkSuggestion[]> = {
  service: [
    { id: 'sg1', label: 'Schedule Service', url: '/contact', type: 'cta', status: 'suggested' },
    { id: 'sg2', label: 'Suzuki Outboard Service', url: '/services/suzuki-outboards', type: 'service', status: 'suggested' },
    { id: 'sg3', label: 'View Pre-Owned Inventory', url: '/inventory', type: 'inventory', status: 'suggested' },
    { id: 'sg4', label: 'All Marine Services', url: '/services', type: 'service', status: 'suggested' },
  ],
  inventory: [
    { id: 'si1', label: 'Ask About Financing', url: '/contact', type: 'cta', status: 'suggested' },
    { id: 'si2', label: 'Used Boat Buying Guide', url: '/blog/used-boat-buying-guide', type: 'blog', status: 'suggested' },
    { id: 'si3', label: 'All Services', url: '/services', type: 'service', status: 'suggested' },
  ],
  blog: [
    { id: 'sb1', label: 'Schedule Service', url: '/contact', type: 'cta', status: 'suggested' },
    { id: 'sb2', label: 'Related Service Page', url: '/services', type: 'service', status: 'suggested' },
    { id: 'sb3', label: 'Browse Inventory', url: '/inventory', type: 'inventory', status: 'suggested' },
  ],
  core: [], category: [], landing: [], location: [], system: [],
}

const TYPE_BADGE: Record<InternalLinkSuggestion['type'], string> = {
  service:   'bg-blue-100 text-blue-700',
  blog:      'bg-purple-100 text-purple-700',
  inventory: 'bg-emerald-100 text-emerald-700',
  cta:       'bg-amber-100 text-amber-700',
}

type Props = {
  links: InternalLinkSuggestion[]
  pageType: SEOPageType
  onChange: (links: InternalLinkSuggestion[]) => void
}

export default function InternalLinksTab({ links, pageType, onChange }: Props) {
  function removeLink(id: string) { onChange(links.filter((l) => l.id !== id)) }

  function addSuggestion(sg: InternalLinkSuggestion) {
    if (!links.find((l) => l.url === sg.url)) {
      onChange([...links, { ...sg, status: 'active' }])
    }
  }

  const suggestions = SUGGESTED_BY_TYPE[pageType] ?? []
  const unusedSuggestions = suggestions.filter((s) => !links.find((l) => l.url === s.url))

  return (
    <div className="space-y-5">
      {/* Current links */}
      <SectionHeading>Current Internal Links ({links.length})</SectionHeading>
      {links.length === 0 ? (
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6 text-center text-sm text-gray-400">
          No internal links tracked for this page yet.
        </div>
      ) : (
        <div className="space-y-2">
          {links.map((link) => (
            <div key={link.id} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${link.status === 'broken' ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'}`}>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_BADGE[link.type]}`}>{link.type}</span>
              <span className="text-sm font-semibold text-gray-800 flex-1">{link.label}</span>
              <span className="text-xs font-mono text-gray-400">{link.url}</span>
              {link.status === 'broken' && <span className="text-xs text-red-600 font-bold">Broken</span>}
              <button onClick={() => removeLink(link.id)} className="text-gray-300 hover:text-red-500 text-sm transition-colors">✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Suggested links */}
      {unusedSuggestions.length > 0 && (
        <>
          <SectionHeading>Suggested Links for This Page Type</SectionHeading>
          <div className="space-y-2">
            {unusedSuggestions.map((sg) => (
              <div key={sg.id} className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-dashed border-blue-200 bg-blue-50/30">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_BADGE[sg.type]}`}>{sg.type}</span>
                <span className="text-sm text-gray-700 flex-1">{sg.label}</span>
                <span className="text-xs font-mono text-gray-400">{sg.url}</span>
                <ActionButton onClick={() => addSuggestion(sg)}>+ Add</ActionButton>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Custom link adder */}
      <SectionHeading>Add Custom Link</SectionHeading>
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        {/* TODO: Custom link adder form */}
        {/* TODO: Run broken link checker against current links */}
        <p className="text-xs text-gray-400">Custom internal link form — coming soon. Use the suggestions above or add links directly in your page content.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <ActionButton onClick={() => alert('TODO: Run broken link scanner on this page')}>
            Scan for Broken Links
          </ActionButton>
          <ActionButton onClick={() => alert('TODO: AI-suggest internal links based on keywords')}>
            AI Suggest Links
          </ActionButton>
        </div>
      </div>
    </div>
  )
}
