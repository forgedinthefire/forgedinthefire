import Link from 'next/link'
import type { ButtonCtaBlock } from '../../types'

const ALIGN_CLASSES: Record<string, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
}

const STYLE_CLASSES: Record<string, string> = {
  primary:   'px-8 py-3.5 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]',
  secondary: 'px-8 py-3.5 rounded-xl font-bold border-2 transition-all hover:scale-[1.02]',
  ghost:     'px-8 py-3.5 rounded-xl font-semibold transition-all hover:underline',
  outline:   'px-8 py-3.5 rounded-xl font-bold border-2 transition-all hover:scale-[1.02]',
}

export default function ButtonCtaBlockRenderer({ block }: { block: ButtonCtaBlock }) {
  const { label, url, style = 'primary', align = 'center', subtext } = block.data
  const alignClass = ALIGN_CLASSES[align] ?? 'justify-center'

  const btnStyle: React.CSSProperties =
    style === 'primary' ? { backgroundColor: '#c9a84c', color: '#fff' } :
    style === 'secondary' ? { borderColor: '#0d2b55', color: '#0d2b55' } :
    style === 'outline' ? { borderColor: '#c9a84c', color: '#c9a84c' } :
    { color: '#0d2b55' }

  return (
    <section className="max-w-4xl mx-auto px-6 py-8">
      <div className={`flex flex-col items-center sm:flex-row ${alignClass} gap-3`}>
        <div className={`flex flex-col items-${align === 'center' ? 'center' : 'start'} gap-1`}>
          <Link href={url} className={STYLE_CLASSES[style] ?? STYLE_CLASSES.primary} style={btnStyle}>
            {label}
          </Link>
          {subtext && (
            <p className="text-xs text-gray-400 mt-1">{subtext}</p>
          )}
        </div>
      </div>
    </section>
  )
}
