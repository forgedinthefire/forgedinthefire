import type { SchemaSettings, SchemaType, SEOPageType } from '../../seoTypes'
import { SectionHeading, SEOToggle, ActionButton } from '../SEOPrimitives'

const ALL_SCHEMA_TYPES: SchemaType[] = [
  'Organization', 'LocalBusiness', 'WebSite', 'Breadcrumb',
  'Service', 'Article', 'FAQ', 'Product', 'Offer',
  'ContactPoint', 'Review', 'Video', 'ImageObject',
]

const PAGE_TYPE_DEFAULTS: Record<SEOPageType, SchemaType[]> = {
  core:      ['Organization', 'LocalBusiness', 'WebSite'],
  service:   ['Service', 'LocalBusiness', 'FAQ', 'Breadcrumb'],
  blog:      ['Article', 'FAQ', 'Breadcrumb'],
  inventory: ['Product', 'Offer', 'Breadcrumb'],
  category:  ['Breadcrumb'],
  landing:   ['LocalBusiness', 'Breadcrumb'],
  location:  ['LocalBusiness', 'Breadcrumb'],
  system:    [],
}

type Props = {
  schema: SchemaSettings
  pageType: SEOPageType
  onChange: (patch: Partial<SchemaSettings>) => void
}

export default function SchemaTab({ schema, pageType, onChange }: Props) {
  function toggleType(type: SchemaType) {
    const types = schema.types.includes(type)
      ? schema.types.filter((t) => t !== type)
      : [...schema.types, type]
    onChange({ types })
  }

  function applyDefaults() {
    onChange({ types: PAGE_TYPE_DEFAULTS[pageType] ?? [], enabled: true })
  }

  const previewJson = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': schema.types.map((type) => ({
      '@type': type,
      ...(type === 'LocalBusiness' ? { name: 'Thomas Marine, LLC', telephone: '(843) 833-8054', address: { '@type': 'PostalAddress', streetAddress: '129 Dozier St', addressLocality: 'Georgetown', addressRegion: 'SC', postalCode: '29440' } } : {}),
      ...(type === 'Organization' ? { name: 'Thomas Marine, LLC', url: 'https://thomasmarinellc.com' } : {}),
    })),
  }, null, 2)

  return (
    <div className="space-y-5">
      <SectionHeading>Schema Status</SectionHeading>
      <SEOToggle
        label="Enable structured data (Schema.org)"
        checked={schema.enabled}
        onChange={(v) => onChange({ enabled: v })}
        description="Schema helps Google understand your page and may unlock rich results in search."
      />

      {schema.enabled && (
        <>
          <SectionHeading>Active Schema Types</SectionHeading>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ALL_SCHEMA_TYPES.map((type) => {
              const active = schema.types.includes(type)
              const isDefault = PAGE_TYPE_DEFAULTS[pageType]?.includes(type)
              return (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={`text-xs font-semibold px-3 py-2 rounded-xl border-2 text-left transition-all ${
                    active
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <span>{type}</span>
                  {isDefault && <span className="ml-1 text-gray-400 font-normal text-xs">(recommended)</span>}
                </button>
              )
            })}
          </div>

          <div className="flex flex-wrap gap-2">
            <ActionButton variant="primary" onClick={applyDefaults}>Apply Recommended for Page Type</ActionButton>
            {/* TODO: Validate against Google Rich Results Test API */}
            <ActionButton onClick={() => alert('TODO: Validate schema via Google Rich Results Test')}>Validate Schema</ActionButton>
          </div>

          <SectionHeading>Data Sources</SectionHeading>
          <div className="space-y-3">
            <SEOToggle
              label="Use business profile data"
              checked={schema.useBusinessProfile}
              onChange={(v) => onChange({ useBusinessProfile: v })}
              description="Auto-populate LocalBusiness schema from Thomas Marine business details."
            />
            <SEOToggle
              label="Use FAQ content from page"
              checked={schema.usePageFAQ}
              onChange={(v) => onChange({ usePageFAQ: v })}
              description="Generate FAQ schema from questions on this page."
            />
            <SEOToggle
              label="Use inventory data"
              checked={schema.useInventoryData}
              onChange={(v) => onChange({ useInventoryData: v })}
              description="Generate Product/Offer schema from listing data."
            />
            <SEOToggle
              label="Use service data"
              checked={schema.useServiceData}
              onChange={(v) => onChange({ useServiceData: v })}
              description="Generate Service schema from service page content."
            />
          </div>

          <SectionHeading>JSON-LD Preview</SectionHeading>
          <pre className="bg-gray-900 text-green-400 text-xs rounded-xl p-4 overflow-x-auto leading-relaxed max-h-64">
            {previewJson}
          </pre>
          <p className="text-xs text-gray-400">
            {/* TODO: Schema generation from live page data (not static mock) */}
            Preview is based on mock data. Live schema generation will use actual page content.
          </p>
        </>
      )}
    </div>
  )
}
