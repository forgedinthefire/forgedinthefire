import type { TechnicalSEOData, SEOSettings } from '../../seoTypes'
import { SectionHeading, CheckRow, SEOInput, FieldRow, SEOToggle, ActionButton } from '../SEOPrimitives'

type Props = {
  technical: TechnicalSEOData
  settings: SEOSettings
  onSettingsChange: (patch: Partial<SEOSettings>) => void
}

export default function TechnicalSEOTab({ technical, settings, onSettingsChange }: Props) {
  return (
    <div className="space-y-5">
      {/* Checks */}
      <SectionHeading>Technical Health Checks</SectionHeading>
      <div className="bg-white border border-gray-100 rounded-xl px-4 py-2 divide-y divide-gray-50">
        <CheckRow label={`HTTP Status: ${technical.httpStatus}`} pass={technical.httpStatus === 200} />
        <CheckRow label="Page is indexable" pass={technical.isIndexable} />
        <CheckRow label="Not blocked by robots.txt" pass={!technical.robotsBlocked} />
        <CheckRow label="Canonical URL is correct" pass={technical.canonicalIsCorrect} />
        <CheckRow label="Included in sitemap" pass={technical.inSitemap} />
        <CheckRow label="No duplicate SEO title" pass={!technical.hasDuplicateTitle} />
        <CheckRow label="No duplicate meta description" pass={!technical.hasDuplicateMeta} />
        <CheckRow label="No duplicate slug" pass={!technical.hasDuplicateSlug} />
        <CheckRow label="No broken internal links" pass={technical.brokenInternalLinks.length === 0} />
        <CheckRow label="No structured data errors" pass={!technical.hasStructuredDataErrors} />
        <CheckRow label="No mobile layout issues" pass={!technical.mobileWarning} warn={technical.mobileWarning} />
        <CheckRow label="No oversized images" pass={!technical.imageSizeWarning} warn={technical.imageSizeWarning} />
      </div>

      {/* Broken links list */}
      {technical.brokenInternalLinks.length > 0 && (
        <>
          <SectionHeading>Broken Internal Links</SectionHeading>
          <div className="space-y-1.5">
            {technical.brokenInternalLinks.map((url) => (
              <div key={url} className="flex items-center justify-between gap-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <span className="text-xs font-mono text-red-700">{url}</span>
                <ActionButton variant="danger" onClick={() => alert(`TODO: Replace broken link: ${url}`)}>Replace</ActionButton>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Admin actions */}
      <SectionHeading>Admin Actions</SectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldRow label="URL Slug" hint="Changing slug will prompt creating a 301 redirect.">
          <SEOInput value={settings.slug} onChange={(v) => onSettingsChange({ slug: v })} mono />
        </FieldRow>
        <FieldRow label="Canonical URL">
          <SEOInput value={settings.canonicalUrl} onChange={(v) => onSettingsChange({ canonicalUrl: v })} mono />
        </FieldRow>
      </div>

      <div className="space-y-3">
        <SEOToggle
          label="Index this page"
          checked={settings.indexSetting === 'index'}
          onChange={(v) => onSettingsChange({ indexSetting: v ? 'index' : 'noindex' })}
          description="⚠ Changing to noindex on a live page removes it from Google. Confirm before saving."
        />
        <SEOToggle
          label="Include in XML sitemap"
          checked={settings.includeInSitemap}
          onChange={(v) => onSettingsChange({ includeInSitemap: v })}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {/* TODO: Actually regenerate and upload sitemap to /public/sitemap.xml */}
        <ActionButton variant="primary" onClick={() => alert('TODO: Regenerate sitemap.xml')}>Regenerate Sitemap</ActionButton>
        {/* TODO: Validate schema JSON via Google Rich Results Test API */}
        <ActionButton onClick={() => alert('TODO: Validate structured data via Google Rich Results Test')}>Validate Schema</ActionButton>
        {/* TODO: Run PageSpeed Insights API call */}
        <ActionButton onClick={() => alert('TODO: PageSpeed Insights integration')}>Check Page Speed</ActionButton>
        <ActionButton variant="danger" onClick={() => confirm('Archive this page? It will be set to noindex and excluded from sitemap.') && alert('TODO: Archive page')}>Archive Page</ActionButton>
      </div>

      {/* Placeholders for future integrations */}
      <div className="mt-4 p-4 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-400 space-y-1">
        {/* TODO: Google Search Console — show last crawl date, index status, mobile usability */}
        {/* TODO: Google PageSpeed Insights — show CLS, LCP, FID scores */}
        {/* TODO: Broken link checker — automated crawl of internal links */}
        <p className="font-semibold text-gray-500">Future integrations</p>
        <p>Google Search Console · PageSpeed Insights · Automated crawl status</p>
      </div>
    </div>
  )
}
