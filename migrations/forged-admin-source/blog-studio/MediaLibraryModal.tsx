'use client'
import { useState } from 'react'
import Image from 'next/image'
import type { MediaAsset } from './types'

// Sample media assets (existing service flyers)
const SAMPLE_MEDIA: MediaAsset[] = [
  { id: 'm01', url: '/images/blogs/ThomasMarineOilChangesFlyer.png',              alt: 'Oil Changes service', category: 'Services' },
  { id: 'm02', url: '/images/blogs/ThomasMarineEngineInstallationServiceFlyer.png', alt: 'Engine Installation', category: 'Services' },
  { id: 'm03', url: '/images/blogs/ThomasMarineBoatingDetailingFlyer.png',         alt: 'Boat Detailing',      category: 'Services' },
  { id: 'm04', url: '/images/blogs/ThomasMarineWinterizationFlyer.png',            alt: 'Winterization',       category: 'Services' },
  { id: 'm05', url: '/images/blogs/ThomasMarineSpringCommissioningFlyer.png',      alt: 'Spring Commissioning',category: 'Services' },
  { id: 'm06', url: '/images/blogs/ThomasMarineRepowerFlyer.png',                  alt: 'Repower service',     category: 'Services' },
  { id: 'm07', url: '/images/blogs/ThomasMarine-BottomPaintingFlyer.png',          alt: 'Bottom Painting',     category: 'Services' },
  { id: 'm08', url: '/hero.PNG',                                                   alt: 'Thomas Marine hero',  category: 'Brand' },
]

type Props = {
  onSelect: (asset: MediaAsset) => void
  onClose: () => void
}

export default function MediaLibraryModal({ onSelect, onClose }: Props) {
  const [selected, setSelected] = useState<MediaAsset | null>(null)
  const [altEdit, setAltEdit] = useState('')
  const [captionEdit, setCaptionEdit] = useState('')
  const [search, setSearch] = useState('')

  function pick(asset: MediaAsset) {
    setSelected(asset)
    setAltEdit(asset.alt)
    setCaptionEdit(asset.caption ?? '')
  }

  function confirm() {
    if (!selected) return
    onSelect({ ...selected, alt: altEdit, caption: captionEdit || undefined })
    onClose()
  }

  const filtered = SAMPLE_MEDIA.filter((a) =>
    a.alt.toLowerCase().includes(search.toLowerCase()) ||
    (a.category ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900">Media Library</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {/* TODO: Replace with real upload + Supabase storage integration */}
              Sample assets only — upload functionality coming soon
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Asset grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="grid grid-cols-3 gap-3">
              {filtered.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => pick(asset)}
                  className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${selected?.id === asset.id ? 'border-blue-500 ring-2 ring-blue-300' : 'border-transparent hover:border-blue-200'}`}
                >
                  <Image src={asset.url} alt={asset.alt} fill className="object-cover" />
                  {selected?.id === asset.id && (
                    <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                      <span className="text-white text-2xl">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="w-64 border-l border-gray-100 p-4 flex flex-col gap-3 overflow-y-auto">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                <Image src={selected.url} alt={selected.alt} fill className="object-cover" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Alt Text <span className="text-red-400">*</span></label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  value={altEdit}
                  onChange={(e) => setAltEdit(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Caption</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  value={captionEdit}
                  onChange={(e) => setCaptionEdit(e.target.value)}
                  placeholder="Optional caption..."
                />
              </div>
              {/* TODO: Add focal point selector UI */}
              <p className="text-xs text-gray-400">Focal point selector — coming soon</p>
              <button
                onClick={confirm}
                disabled={!altEdit.trim()}
                className="mt-auto w-full py-2.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-105 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #1d4ed8, #0a2d7a)' }}
              >
                Use This Image
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
