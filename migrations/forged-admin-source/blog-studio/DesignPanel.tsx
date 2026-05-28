'use client'
import type { DesignSettings, HeroStyle, LayoutStyle, AccentColor } from './types'

type Props = { design: DesignSettings; onChange: (d: DesignSettings) => void }

const HERO_STYLES: { value: HeroStyle; label: string; desc: string }[] = [
  { value: 'full_image',         label: 'Full Image Hero',         desc: 'Edge-to-edge image with dark overlay' },
  { value: 'split_text_image',   label: 'Split Text + Image',      desc: 'Text left, image right' },
  { value: 'dark_overlay',       label: 'Dark Overlay Hero',       desc: 'Strong navy gradient over image' },
  { value: 'clean_editorial',    label: 'Clean Editorial',         desc: 'White background, no image' },
  { value: 'service_page',       label: 'Service Page Hero',       desc: 'Bold service-style header' },
  { value: 'inventory_spotlight',label: 'Inventory Spotlight',     desc: 'Showcase a specific boat' },
]

const LAYOUT_STYLES: { value: LayoutStyle; label: string }[] = [
  { value: 'premium_editorial', label: 'Premium Editorial' },
  { value: 'service_guide',     label: 'Service Guide' },
  { value: 'compact_news',      label: 'Compact News' },
  { value: 'visual_story',      label: 'Visual Story' },
  { value: 'checklist',         label: 'Checklist' },
  { value: 'sales_spotlight',   label: 'Sales Spotlight' },
]

const ACCENT_COLORS: { value: AccentColor; label: string; hex: string }[] = [
  { value: 'suzuki_blue', label: 'Suzuki Blue',  hex: '#1d4ed8' },
  { value: 'navy',        label: 'Navy',          hex: '#0d2b55' },
  { value: 'charcoal',    label: 'Charcoal',      hex: '#374151' },
  { value: 'silver',      label: 'Silver',        hex: '#9ca3af' },
  { value: 'white',       label: 'White',         hex: '#ffffff' },
]

export default function DesignPanel({ design, onChange }: Props) {
  const set = (patch: Partial<DesignSettings>) => onChange({ ...design, ...patch })

  return (
    <div className="space-y-5">
      {/* Hero Style */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Hero Style</label>
        <div className="space-y-1.5">
          {HERO_STYLES.map((s) => (
            <label key={s.value} className={`flex items-start gap-3 cursor-pointer rounded-lg border px-3 py-2.5 transition-colors ${design.heroStyle === s.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
              <input type="radio" name="heroStyle" value={s.value} checked={design.heroStyle === s.value} onChange={() => set({ heroStyle: s.value })} className="mt-0.5 accent-blue-600" />
              <div>
                <p className="text-sm font-semibold text-gray-800">{s.label}</p>
                <p className="text-xs text-gray-500">{s.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Layout Style */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Layout Style</label>
        <select
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          value={design.layoutStyle}
          onChange={(e) => set({ layoutStyle: e.target.value as LayoutStyle })}
        >
          {LAYOUT_STYLES.map((l) => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>
      </div>

      {/* Accent Color */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Accent Color</label>
        <div className="flex gap-3 flex-wrap">
          {ACCENT_COLORS.map((c) => (
            <button
              key={c.value}
              title={c.label}
              onClick={() => set({ accentColor: c.value })}
              className={`w-8 h-8 rounded-full border-2 transition-all ${design.accentColor === c.value ? 'border-blue-500 scale-110' : 'border-gray-300'}`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Selected: {ACCENT_COLORS.find((c) => c.value === design.accentColor)?.label}
        </p>
      </div>
    </div>
  )
}
