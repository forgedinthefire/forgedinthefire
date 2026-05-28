import type { LocalSEOSettings } from '../../seoTypes'
import { LOCAL_PHRASES_SUGGESTIONS } from '../../seoTypes'
import { SectionHeading, FieldRow, SEOInput, ActionButton } from '../SEOPrimitives'

type Props = { localSEO: LocalSEOSettings; onChange: (patch: Partial<LocalSEOSettings>) => void }

export default function LocalSEOTab({ localSEO, onChange }: Props) {
  function togglePhrase(phrase: string) {
    const current = localSEO.secondaryLocalPhrases
    onChange({
      secondaryLocalPhrases: current.includes(phrase)
        ? current.filter((p) => p !== phrase)
        : [...current, phrase],
    })
  }

  return (
    <div className="space-y-5">
      {/* Business info */}
      <SectionHeading>Business Information</SectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldRow label="Business Name">
          <SEOInput value={localSEO.businessName} onChange={(v) => onChange({ businessName: v })} />
        </FieldRow>
        <FieldRow label="Phone Number">
          <SEOInput value={localSEO.phone} onChange={(v) => onChange({ phone: v })} placeholder="(843) 833-8054" />
        </FieldRow>
        <FieldRow label="Address">
          <SEOInput value={localSEO.address} onChange={(v) => onChange({ address: v })} />
        </FieldRow>
        <FieldRow label="Business Hours">
          <SEOInput value={localSEO.hours} onChange={(v) => onChange({ hours: v })} />
        </FieldRow>
        <FieldRow label="Primary City">
          <SEOInput value={localSEO.primaryCity} onChange={(v) => onChange({ primaryCity: v })} />
        </FieldRow>
        <FieldRow label="State">
          <SEOInput value={localSEO.state} onChange={(v) => onChange({ state: v })} />
        </FieldRow>
      </div>

      {/* Service area */}
      <SectionHeading>Service Area</SectionHeading>
      <FieldRow label="Service Area Cities" hint="Comma-separated list">
        <SEOInput
          value={localSEO.serviceArea.join(', ')}
          onChange={(v) => onChange({ serviceArea: v.split(',').map((s) => s.trim()).filter(Boolean) })}
          placeholder="Georgetown, Pawleys Island, Myrtle Beach..."
        />
      </FieldRow>
      <FieldRow label="Nearby Areas" hint="Neighboring towns to mention for local relevance">
        <SEOInput
          value={localSEO.nearbyAreas.join(', ')}
          onChange={(v) => onChange({ nearbyAreas: v.split(',').map((s) => s.trim()).filter(Boolean) })}
        />
      </FieldRow>

      {/* Brands */}
      <SectionHeading>Brands</SectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldRow label="Brands Serviced">
          <SEOInput
            value={localSEO.brandsServiced.join(', ')}
            onChange={(v) => onChange({ brandsServiced: v.split(',').map((s) => s.trim()).filter(Boolean) })}
            placeholder="Suzuki, Mercury, Yamaha..."
          />
        </FieldRow>
        <FieldRow label="Brands Sold">
          <SEOInput
            value={localSEO.brandsSold.join(', ')}
            onChange={(v) => onChange({ brandsSold: v.split(',').map((s) => s.trim()).filter(Boolean) })}
            placeholder="Suzuki Marine, EZ Loader..."
          />
        </FieldRow>
      </div>

      {/* Local phrases */}
      <SectionHeading>Local SEO Phrases</SectionHeading>
      <FieldRow label="Primary Local Phrase" hint="The main city+service phrase for this page">
        <SEOInput value={localSEO.primaryLocalPhrase} onChange={(v) => onChange({ primaryLocalPhrase: v })} />
      </FieldRow>
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">Suggested Phrases — click to toggle</p>
        <div className="flex flex-wrap gap-2">
          {LOCAL_PHRASES_SUGGESTIONS.map((phrase) => {
            const active = localSEO.secondaryLocalPhrases.includes(phrase)
            return (
              <button
                key={phrase}
                onClick={() => togglePhrase(phrase)}
                className={`text-xs px-3 py-1.5 rounded-full border-2 font-semibold transition-all ${active ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
              >
                {phrase}
              </button>
            )
          })}
        </div>
      </div>

      {/* Profile links */}
      <SectionHeading>Business Profile Links</SectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldRow label="Google Business Profile URL">
          <SEOInput value={localSEO.googleBusinessUrl} onChange={(v) => onChange({ googleBusinessUrl: v })} mono />
        </FieldRow>
        <FieldRow label="Google Maps URL">
          <SEOInput value={localSEO.mapUrl} onChange={(v) => onChange({ mapUrl: v })} mono />
        </FieldRow>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 pt-2">
        {/* TODO: AI-generate local SEO paragraph from business profile data */}
        <ActionButton variant="primary" onClick={() => alert('TODO: AI-generate local SEO paragraph')}>Generate Local SEO Paragraph</ActionButton>
        <ActionButton onClick={() => alert('TODO: Insert service area block into page')}>Insert Service Area Block</ActionButton>
        <ActionButton onClick={() => alert('TODO: Insert map block')}>Add Map Block</ActionButton>
        {/* TODO: Sync with Google Business Profile API */}
        <ActionButton onClick={() => alert('TODO: Google Business Profile API sync')}>Sync Business Profile</ActionButton>
      </div>

      {/* Placeholder for future */}
      <div className="mt-4 p-4 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-400 space-y-1">
        {/* TODO: Google Business Profile API — sync hours, address, photos, categories */}
        {/* TODO: LocalBusiness schema auto-generation from this data */}
        <p className="font-semibold text-gray-500">Future integrations</p>
        <p>Google Business Profile sync · Local citation builder · NAP consistency checker</p>
      </div>
    </div>
  )
}
