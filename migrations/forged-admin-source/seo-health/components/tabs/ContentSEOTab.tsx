import type { ContentSEOData, SEOSettings } from '../../seoTypes'
import { SectionHeading, FieldRow, SEOInput, CheckRow, ActionButton } from '../SEOPrimitives'

type Props = {
  content: ContentSEOData
  settings: SEOSettings
  onSettingsChange: (patch: Partial<SEOSettings>) => void
}

export default function ContentSEOTab({ content, settings, onSettingsChange }: Props) {
  return (
    <div className="space-y-5">
      {/* Health checks */}
      <SectionHeading>Content Health Checks</SectionHeading>
      <div className="bg-white border border-gray-100 rounded-xl px-4 py-2 divide-y divide-gray-50">
        <CheckRow label="Page has exactly one H1" pass={content.hasH1 && content.h1Count === 1} warn={content.h1Count > 1} />
        <CheckRow label="H2 sections exist" pass={content.hasH2s} />
        <CheckRow label={`Word count (${content.wordCount}) is sufficient`} pass={content.wordCount >= 300} warn={content.wordCount >= 150 && content.wordCount < 300} />
        <CheckRow label="Page has a clear CTA" pass={content.hasCTA} />
        <CheckRow label="Internal links present" pass={content.hasInternalLinks} />
        <CheckRow label="FAQ content present" pass={content.hasFAQ} warn={!content.hasFAQ} />
        <CheckRow label="Primary keyword set" pass={!!settings.primaryKeyword} />
        <CheckRow label="Local SEO phrase set" pass={!!settings.localPhrase} />
      </div>

      {/* Editable fields */}
      <SectionHeading>Keyword & Intent Settings</SectionHeading>
      <div className="space-y-4">
        <FieldRow label="Primary Keyword">
          <SEOInput value={settings.primaryKeyword} onChange={(v) => onSettingsChange({ primaryKeyword: v })} placeholder="e.g. Suzuki outboard service Georgetown SC" />
        </FieldRow>
        <FieldRow label="Local SEO Phrase">
          <SEOInput value={settings.localPhrase} onChange={(v) => onSettingsChange({ localPhrase: v })} placeholder="e.g. boat repair Georgetown, South Carolina" />
        </FieldRow>
        <FieldRow label="Secondary Keywords" hint="Comma-separated">
          <SEOInput
            value={settings.secondaryKeywords.join(', ')}
            onChange={(v) => onSettingsChange({ secondaryKeywords: v.split(',').map((s) => s.trim()).filter(Boolean) })}
          />
        </FieldRow>
      </div>

      {/* AI suggestions — read-only helper fields */}
      {content.suggestedH1 && (
        <>
          <SectionHeading>AI Suggestions (Review Before Using)</SectionHeading>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3 text-sm">
            {/* TODO: Connect AI assistant (OpenAI / Anthropic) for live generation */}
            <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">AI cannot publish. Admin must review and approve all suggestions.</p>
            {content.suggestedH1 && (
              <div>
                <p className="font-semibold text-gray-700 text-xs mb-1">Suggested H1</p>
                <p className="text-gray-900 bg-white border border-blue-100 rounded px-3 py-2 text-sm">{content.suggestedH1}</p>
              </div>
            )}
            {content.suggestedH2s && (
              <div>
                <p className="font-semibold text-gray-700 text-xs mb-1">Suggested H2 Sections</p>
                <ul className="space-y-1">
                  {content.suggestedH2s.map((h, i) => <li key={i} className="text-gray-900 bg-white border border-blue-100 rounded px-3 py-1.5 text-sm">{h}</li>)}
                </ul>
              </div>
            )}
            {content.suggestedFAQs && (
              <div>
                <p className="font-semibold text-gray-700 text-xs mb-1">Suggested FAQ Questions</p>
                <ul className="space-y-1">
                  {content.suggestedFAQs.map((q, i) => <li key={i} className="text-gray-900 bg-white border border-blue-100 rounded px-3 py-1.5 text-sm">{q}</li>)}
                </ul>
              </div>
            )}
            {content.suggestedCTA && (
              <div>
                <p className="font-semibold text-gray-700 text-xs mb-1">Suggested CTA</p>
                <p className="text-gray-900 bg-white border border-blue-100 rounded px-3 py-2 text-sm">{content.suggestedCTA}</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Helper content fields */}
      <SectionHeading>Content Helper Notes</SectionHeading>
      <div className="space-y-3 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-xl p-4">
        {/* TODO: AI-generate all fields below via prompt templates */}
        <p className="font-semibold text-gray-600 text-xs uppercase tracking-wider">Placeholder for AI helper buttons</p>
        <div className="flex flex-wrap gap-2">
          {[
            'Generate SEO Title',
            'Generate Meta Description',
            'Suggest H2 Headings',
            'Suggest FAQ Questions',
            'Suggest Internal Links',
            'Improve Excerpt',
            'Create Local SEO Paragraph',
            'Create Service CTA',
          ].map((label) => (
            <ActionButton key={label} onClick={() => alert(`TODO: AI: ${label}`)}>
              {label}
            </ActionButton>
          ))}
        </div>
        <p className="text-gray-400 italic">AI suggestions require admin approval before being applied to the page.</p>
      </div>
    </div>
  )
}
