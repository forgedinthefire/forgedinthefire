import type { SEOSettings } from '../../seoTypes'
import { SectionHeading, FieldRow, SEOInput, SEOTextarea, SEOToggle, ActionButton } from '../SEOPrimitives'

type Props = {
  settings: SEOSettings
  onChange: (patch: Partial<SEOSettings>) => void
  pageName: string
}

function GooglePreview({ title, description, url }: { title: string; description: string; url: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 max-w-xl">
      <p className="text-xs text-gray-400 mb-1">google.com  ›  {url.replace(/^https?:\/\/[^/]+/, '').replace(/^\//, '') || 'home'}</p>
      <p className="text-base font-semibold text-blue-700 hover:underline cursor-pointer leading-snug">
        {title || 'Page Title'}
      </p>
      <p className="text-sm text-gray-600 mt-1 leading-relaxed line-clamp-2">
        {description || 'Meta description will appear here. Write 150–160 characters to control what Google shows.'}
      </p>
    </div>
  )
}

export default function SearchAppearanceTab({ settings, onChange, pageName }: Props) {
  return (
    <div className="space-y-5">
      {/* Google Preview */}
      <SectionHeading>Google Search Preview</SectionHeading>
      <GooglePreview
        title={settings.seoTitle}
        description={settings.metaDescription}
        url={settings.canonicalUrl || pageName}
      />

      {/* Core metadata */}
      <SectionHeading>Search Metadata</SectionHeading>
      <div className="space-y-4">
        <FieldRow label="SEO Title" required hint="50–60 characters. Include primary keyword and location.">
          <SEOInput value={settings.seoTitle} onChange={(v) => onChange({ seoTitle: v })} placeholder="Page title for search results" maxLength={60} />
        </FieldRow>
        <FieldRow label="Meta Description" required hint="150–160 characters. Include keyword, location, and a CTA.">
          <SEOTextarea value={settings.metaDescription} onChange={(v) => onChange({ metaDescription: v })} placeholder="Describe this page for searchers..." maxLength={160} rows={3} />
        </FieldRow>
        <FieldRow label="URL Slug" hint="Lowercase, hyphen-separated. Changing this will prompt a redirect.">
          <SEOInput value={settings.slug} onChange={(v) => onChange({ slug: v })} placeholder="page-url-slug" mono />
        </FieldRow>
        <FieldRow label="Canonical URL" hint="Leave default unless this is a duplicate or syndicated page.">
          <SEOInput value={settings.canonicalUrl} onChange={(v) => onChange({ canonicalUrl: v })} placeholder="https://thomasmarinellc.com/page" mono />
        </FieldRow>
      </div>

      {/* Indexing toggles */}
      <SectionHeading>Indexing & Crawling</SectionHeading>
      <div className="space-y-4">
        <SEOToggle
          label="Index this page"
          checked={settings.indexSetting === 'index'}
          onChange={(v) => onChange({ indexSetting: v ? 'index' : 'noindex' })}
          description="Allow Google to include this page in search results."
        />
        <SEOToggle
          label="Follow links on this page"
          checked={settings.followSetting === 'follow'}
          onChange={(v) => onChange({ followSetting: v ? 'follow' : 'nofollow' })}
          description="Pass link equity from this page to linked pages."
        />
        <SEOToggle
          label="Show rich snippets"
          checked={settings.robotsSnippet}
          onChange={(v) => onChange({ robotsSnippet: v })}
          description="Allow Google to show date, description, and other snippets."
        />
        <SEOToggle
          label="Include in sitemap"
          checked={settings.includeInSitemap}
          onChange={(v) => onChange({ includeInSitemap: v })}
          description="Add this page to the XML sitemap for crawler discovery."
        />
        <SEOToggle
          label="Use default canonical (self)"
          checked={settings.useDefaultCanonical}
          onChange={(v) => onChange({ useDefaultCanonical: v })}
          description="Recommended. Only disable if this page has a specific alternate canonical."
        />
      </div>

      {/* Social / OG */}
      <SectionHeading>Social Preview (Open Graph)</SectionHeading>
      <div className="space-y-4">
        <FieldRow label="OG Title" hint="Defaults to SEO title if left blank.">
          <SEOInput value={settings.ogTitle} onChange={(v) => onChange({ ogTitle: v })} placeholder={settings.seoTitle} maxLength={60} />
        </FieldRow>
        <FieldRow label="OG Description" hint="Shown on Facebook, LinkedIn, iMessage previews.">
          <SEOTextarea value={settings.ogDescription} onChange={(v) => onChange({ ogDescription: v })} placeholder={settings.metaDescription} maxLength={160} rows={2} />
        </FieldRow>
        <FieldRow label="OG Image URL" hint="1200×630px recommended. Used for Facebook, Twitter, SMS link previews.">
          <SEOInput value={settings.ogImageUrl} onChange={(v) => onChange({ ogImageUrl: v })} placeholder="/images/social-preview.png" mono />
        </FieldRow>
        <div className="flex flex-wrap gap-2">
          <ActionButton onClick={() => onChange({ ogTitle: settings.seoTitle, ogDescription: settings.metaDescription })}>
            Copy from SEO Fields
          </ActionButton>
          {/* TODO: Open media library to pick OG image */}
          <ActionButton onClick={() => alert('TODO: Open media library for OG image selection')}>
            Choose Image
          </ActionButton>
        </div>
      </div>

      {/* Keywords */}
      <SectionHeading>Keywords & Intent</SectionHeading>
      <div className="space-y-4">
        <FieldRow label="Primary Keyword" hint="The single most important search term for this page.">
          <SEOInput value={settings.primaryKeyword} onChange={(v) => onChange({ primaryKeyword: v })} placeholder="e.g. Suzuki outboard service Georgetown SC" />
        </FieldRow>
        <FieldRow label="Local SEO Phrase" hint="City + state phrase to reinforce local relevance.">
          <SEOInput value={settings.localPhrase} onChange={(v) => onChange({ localPhrase: v })} placeholder="e.g. boat repair Georgetown, South Carolina" />
        </FieldRow>
        <FieldRow label="Secondary Keywords" hint="Comma-separated list of supporting terms.">
          <SEOInput
            value={settings.secondaryKeywords.join(', ')}
            onChange={(v) => onChange({ secondaryKeywords: v.split(',').map((s) => s.trim()).filter(Boolean) })}
            placeholder="e.g. Suzuki Marine dealer, outboard service SC"
          />
        </FieldRow>
        <FieldRow label="Search Intent" hint="What is the searcher trying to do on this page?">
          <select
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            value={settings.searchIntent}
            onChange={(e) => onChange({ searchIntent: e.target.value })}
          >
            {['informational', 'commercial', 'transactional', 'navigational'].map((v) => (
              <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>
            ))}
          </select>
        </FieldRow>
      </div>
    </div>
  )
}
