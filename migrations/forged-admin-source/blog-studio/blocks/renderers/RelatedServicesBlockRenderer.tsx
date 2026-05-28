import Link from 'next/link'
import type { RelatedServicesBlock } from '../../types'

const SERVICE_LABELS: Record<string, string> = {
  'boating-detailing': 'Boat Detailing', 'boat-storage': 'Boat Storage', 'bottom-painting': 'Bottom Painting',
  'canvas-work': 'Canvas Work', 'de-winterization': 'De-Winterization', 'electrical-repair-installation': 'Electrical Repair',
  'engine-installation': 'Engine Installation', 'fiberglass-gelcoat-repair': 'Fiberglass & Gelcoat Repair',
  'insurance-warranty': 'Insurance & Warranty', 'interior-repair': 'Interior Repair', 'mobile-service': 'Mobile Service',
  'oil-changes': 'Oil Changes', 'outdrive-service': 'Outdrive Service', 'pontoon-restoration': 'Pontoon Restoration',
  'pressure-washing': 'Pressure Washing', 'repower': 'Repower', 'shrink-wrapping': 'Shrink Wrapping',
  'spring-commissioning': 'Spring Commissioning', 'spring-start-up': 'Spring Start-Up', 'tune-ups': 'Tune-Ups',
  'winterization': 'Winterization',
}

export default function RelatedServicesBlockRenderer({ block }: { block: RelatedServicesBlock }) {
  const d = block.data
  if (d.serviceIds.length === 0) return null
  return (
    <section className="max-w-5xl mx-auto px-6 py-10">
      {d.heading && <h2 className="text-xl font-bold mb-6" style={{ color: '#0d2b55', fontFamily: 'var(--font-display), Georgia, serif' }}>{d.heading}</h2>}
      <div className="flex flex-wrap gap-3">
        {d.serviceIds.map((id) => (
          <Link
            key={id}
            href={`/services/${id}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-colors hover:text-white"
            style={{ borderColor: '#0d2b55', color: '#0d2b55' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#0d2b55' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '' }}
          >
            {SERVICE_LABELS[id] ?? id}
          </Link>
        ))}
      </div>
    </section>
  )
}
