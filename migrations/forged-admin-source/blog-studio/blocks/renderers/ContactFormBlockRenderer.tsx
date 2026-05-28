import Link from 'next/link'
import type { ContactFormBlock } from '../../types'

export default function ContactFormBlockRenderer({ block }: { block: ContactFormBlock }) {
  const d = block.data
  return (
    <section className="max-w-3xl mx-auto px-6 py-10">
      {d.heading && <h2 className="text-xl font-bold mb-4" style={{ color: '#0d2b55' }}>{d.heading}</h2>}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
        <p className="text-gray-600 text-sm mb-4">
          {/* TODO: Embed live contact form component when backend is wired */}
          Ready to connect? Reach out to the Thomas Marine team.
        </p>
        <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-white transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #1d4ed8, #0a2d7a)' }}>
          Open Contact Form
        </Link>
      </div>
    </section>
  )
}
