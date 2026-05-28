import type { SEOSettings } from '../../seoTypes'
import { SectionHeading, FieldRow, SEOInput, SEOTextarea, ActionButton } from '../SEOPrimitives'
import Image from 'next/image'

type Props = { settings: SEOSettings; onChange: (patch: Partial<SEOSettings>) => void }

function GoogleCard({ title, description, url }: { title: string; description: string; url: string }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden max-w-lg">
      <div className="px-4 pt-3 pb-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">G</div>
          <div>
            <p className="text-xs text-gray-800 font-semibold leading-none">Thomas Marine, LLC</p>
            <p className="text-xs text-gray-400">{url || 'thomasmarinellc.com'}</p>
          </div>
        </div>
        <p className="text-base font-semibold text-blue-700 leading-snug">{title || 'SEO Title'}</p>
        <p className="text-sm text-gray-600 mt-0.5 leading-relaxed line-clamp-2">{description || 'Meta description preview...'}</p>
      </div>
    </div>
  )
}

function FacebookCard({ title, description, imageUrl, url }: { title: string; description: string; imageUrl: string; url: string }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden max-w-lg">
      {imageUrl && (
        <div className="relative w-full h-48 bg-gray-100">
          <Image src={imageUrl} alt="OG preview" fill className="object-cover" />
        </div>
      )}
      {!imageUrl && <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-300 text-sm">No OG image set</div>}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-400 uppercase tracking-wider">{url?.replace(/^https?:\/\//, '') || 'THOMASMARINELLC.COM'}</p>
        <p className="text-sm font-bold text-gray-900 mt-0.5">{title || 'OG Title'}</p>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{description || 'OG description...'}</p>
      </div>
    </div>
  )
}

function SMSCard({ title, url }: { title: string; url: string }) {
  return (
    <div className="max-w-xs bg-gray-100 rounded-2xl p-3 border border-gray-200">
      <div className="bg-white rounded-xl p-2.5 border border-gray-200">
        <p className="text-xs text-blue-600 font-semibold">{url || 'thomasmarinellc.com'}</p>
        <p className="text-xs text-gray-700 font-semibold mt-0.5 line-clamp-2">{title || 'Page Title'}</p>
      </div>
    </div>
  )
}

export default function SocialPreviewTab({ settings, onChange }: Props) {
  return (
    <div className="space-y-6">
      {/* Editable fields */}
      <SectionHeading>Social Share Fields</SectionHeading>
      <div className="space-y-4">
        <FieldRow label="Open Graph Title" hint="Shown on Facebook, LinkedIn, iMessage">
          <SEOInput value={settings.ogTitle} onChange={(v) => onChange({ ogTitle: v })} placeholder={settings.seoTitle} maxLength={60} />
        </FieldRow>
        <FieldRow label="Open Graph Description">
          <SEOTextarea value={settings.ogDescription} onChange={(v) => onChange({ ogDescription: v })} placeholder={settings.metaDescription} maxLength={160} rows={2} />
        </FieldRow>
        <FieldRow label="OG Image URL" hint="1200×630px — shown on Facebook, Twitter, iMessage">
          <SEOInput value={settings.ogImageUrl} onChange={(v) => onChange({ ogImageUrl: v })} placeholder="/images/social-preview.png" mono />
        </FieldRow>
        <div className="flex flex-wrap gap-2">
          <ActionButton onClick={() => onChange({ ogTitle: settings.seoTitle, ogDescription: settings.metaDescription })}>
            Copy from SEO Fields
          </ActionButton>
          {/* TODO: Open media library for OG image */}
          <ActionButton onClick={() => alert('TODO: Media library — choose OG image')}>Choose Image</ActionButton>
        </div>
      </div>

      {/* Live previews */}
      <SectionHeading>Google Result Preview</SectionHeading>
      <GoogleCard title={settings.ogTitle || settings.seoTitle} description={settings.ogDescription || settings.metaDescription} url={settings.canonicalUrl} />

      <SectionHeading>Facebook / LinkedIn Card Preview</SectionHeading>
      <FacebookCard title={settings.ogTitle || settings.seoTitle} description={settings.ogDescription || settings.metaDescription} imageUrl={settings.ogImageUrl} url={settings.canonicalUrl} />

      <SectionHeading>SMS / iMessage Preview</SectionHeading>
      <SMSCard title={settings.ogTitle || settings.seoTitle} url={settings.canonicalUrl} />

      <div className="mt-2 p-4 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-400">
        {/* TODO: Twitter/X card preview — needs twitter:card meta tag */}
        {/* TODO: WhatsApp link preview */}
        <p>Twitter/X card preview and WhatsApp previews — coming soon.</p>
      </div>
    </div>
  )
}
