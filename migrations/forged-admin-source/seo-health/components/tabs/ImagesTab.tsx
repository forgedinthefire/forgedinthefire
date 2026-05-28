import type { ImageSEO } from '../../seoTypes'
import { SectionHeading, HealthLight, SEOToggle, ActionButton } from '../SEOPrimitives'
import Image from 'next/image'

type Props = {
  images: ImageSEO[]
  onChange: (images: ImageSEO[]) => void
}

function ImageCard({ img, onUpdate }: { img: ImageSEO; onUpdate: (patch: Partial<ImageSEO>) => void }) {
  return (
    <div className={`border rounded-xl p-4 space-y-3 ${img.health === 'red' ? 'border-red-200 bg-red-50/30' : img.health === 'yellow' ? 'border-amber-200 bg-amber-50/30' : 'border-gray-200 bg-white'}`}>
      <div className="flex items-start gap-3">
        {/* Thumbnail */}
        <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
          <Image src={img.src} alt={img.alt || 'image'} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <HealthLight status={img.health} size="sm" />
            <p className="text-xs font-mono text-gray-500 truncate">{img.src.split('/').pop()}</p>
          </div>
          {img.fileSizeKb && (
            <p className="text-xs text-gray-400">{img.fileSizeKb}KB · {img.isLazyLoaded ? 'Lazy loaded' : 'Eager loaded'}</p>
          )}
          {img.issues.length > 0 && (
            <div className="mt-1 space-y-0.5">
              {img.issues.map((iss, i) => (
                <p key={i} className="text-xs text-red-600">⚠ {iss}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Editable fields */}
      <div className="space-y-2">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Alt Text {!img.isDecorative && <span className="text-red-400">*</span>}</label>
          <input
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            value={img.alt}
            onChange={(e) => onUpdate({ alt: e.target.value })}
            placeholder="Describe this image for accessibility and SEO..."
            disabled={img.isDecorative}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Caption</label>
          <input
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            value={img.caption ?? ''}
            onChange={(e) => onUpdate({ caption: e.target.value })}
            placeholder="Optional visible caption..."
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="grid grid-cols-2 gap-2">
        <SEOToggle
          label="Decorative image"
          checked={img.isDecorative}
          onChange={(v) => onUpdate({ isDecorative: v, alt: v ? '' : img.alt })}
          description="No alt text needed"
        />
        <SEOToggle
          label="Use as OG image"
          checked={img.isOgImage}
          onChange={(v) => onUpdate({ isOgImage: v })}
          description="Social share preview"
        />
        <SEOToggle
          label="Hero image"
          checked={img.isHeroImage}
          onChange={(v) => onUpdate({ isHeroImage: v })}
        />
      </div>

      <div className="flex gap-2 pt-1">
        {/* TODO: Open media library to replace image */}
        <ActionButton onClick={() => alert('TODO: Replace image via media library')}>Replace Image</ActionButton>
        {img.fileSizeKb && img.fileSizeKb > 200 && (
          /* TODO: Trigger image compression (Sharp/Squoosh) */
          <ActionButton onClick={() => alert('TODO: Compress image — integrate image optimization pipeline')}>
            Compress ({img.fileSizeKb}KB)
          </ActionButton>
        )}
        {/* TODO: Focal point editor UI */}
        <ActionButton onClick={() => alert('TODO: Focal point editor')}>Set Focal Point</ActionButton>
      </div>
    </div>
  )
}

export default function ImagesTab({ images, onChange }: Props) {
  function updateImage(id: string, patch: Partial<ImageSEO>) {
    onChange(images.map((img) => img.id === id ? { ...img, ...patch } : img))
  }

  const redCount = images.filter((i) => i.health === 'red').length
  const yellowCount = images.filter((i) => i.health === 'yellow').length

  return (
    <div className="space-y-4">
      <SectionHeading>Image Health</SectionHeading>

      {images.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
          <p className="text-gray-400 text-sm">No images found on this page.</p>
          {/* TODO: Crawl page to detect images automatically */}
          <p className="text-xs text-gray-300 mt-1">TODO: Auto-detect images via page crawler</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 text-xs">
            <span className="font-bold text-gray-700">{images.length} images</span>
            {redCount > 0 && <span className="text-red-600 font-bold">{redCount} need attention</span>}
            {yellowCount > 0 && <span className="text-amber-600 font-bold">{yellowCount} could improve</span>}
          </div>
          <div className="space-y-3">
            {images.map((img) => (
              <ImageCard key={img.id} img={img} onUpdate={(patch) => updateImage(img.id, patch)} />
            ))}
          </div>
        </>
      )}

      {/* Image health legend */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs text-gray-500 space-y-1">
        <p><span className="text-emerald-600 font-bold">Green</span> — Has alt text, optimized size, responsive</p>
        <p><span className="text-amber-600 font-bold">Yellow</span> — Has alt text but file is heavy (&gt;200KB)</p>
        <p><span className="text-red-600 font-bold">Red</span> — Missing alt text or broken source</p>
      </div>
    </div>
  )
}
