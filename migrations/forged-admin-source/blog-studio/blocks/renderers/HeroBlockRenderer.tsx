import Link from 'next/link'
import type { HeroBlock } from '../../types'

export default function HeroBlockRenderer({ block }: { block: HeroBlock }) {
  const d = block.data
  return (
    <section
      className="relative min-h-[420px] flex items-end pb-14 text-white overflow-hidden"
      style={{
        backgroundImage: d.image ? `url(${d.image.url})` : 'none',
        backgroundColor: '#0d2b55',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(4,14,34,0.92) 0%, rgba(4,14,34,0.55) 60%, rgba(4,14,34,0.3) 100%)' }} />
      <div className="relative max-w-4xl mx-auto px-6 w-full">
        {d.eyebrow && (
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#c9a84c' }}>{d.eyebrow}</p>
        )}
        <h1 className="text-3xl md:text-5xl font-bold mb-3 leading-tight" style={{ fontFamily: 'var(--font-display), Georgia, serif' }}>
          {d.title || 'Post Title'}
        </h1>
        {d.subtitle && <p className="text-gray-300 text-lg mb-6">{d.subtitle}</p>}
        <div className="flex flex-wrap gap-3">
          {d.primaryCta && (
            <Link href={d.primaryCta.url} className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-white transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #1d4ed8, #0a2d7a)', boxShadow: '0 4px 20px rgba(29,78,216,0.4)' }}>
              {d.primaryCta.text}
            </Link>
          )}
          {d.secondaryCta && (
            <Link href={d.secondaryCta.url} className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold border border-white/30 text-white hover:bg-white/10 transition-colors">
              {d.secondaryCta.text}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
