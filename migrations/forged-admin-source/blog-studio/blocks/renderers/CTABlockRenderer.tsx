import Link from 'next/link'
import type { CTABlock } from '../../types'

export default function CTABlockRenderer({ block }: { block: CTABlock }) {
  const d = block.data
  return (
    <section className="relative py-16 px-6 overflow-hidden" style={{ background: 'linear-gradient(135deg, #040e21 0%, #0d2b55 55%, #1a4080 100%)' }}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 12px)' }} />
      <div className="relative max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-display), Georgia, serif' }}>{d.title}</h2>
        {d.text && <p className="text-gray-300 mb-8 text-base">{d.text}</p>}
        <div className="flex flex-wrap justify-center gap-4">
          <Link href={d.primaryButtonUrl} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-white transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, rgba(29,78,216,0.9), rgba(8,47,120,0.95))', boxShadow: '0 4px 24px rgba(29,78,216,0.4)', border: '1px solid rgba(255,255,255,0.15)' }}>
            {d.primaryButtonText}
          </Link>
          {d.secondaryButtonText && d.secondaryButtonUrl && (
            <Link href={d.secondaryButtonUrl} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold border border-white/30 text-white hover:bg-white/10 transition-colors">
              {d.secondaryButtonText}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
