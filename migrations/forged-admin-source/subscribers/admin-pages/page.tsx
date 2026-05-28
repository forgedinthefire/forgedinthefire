import { createClient } from '@/lib/supabase/server'
import { Mail, Download } from 'lucide-react'

type Subscriber = {
  id: string
  email: string
  source: string | null
  created_at: string
}

export default async function SubscribersPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('newsletter_subscribers')
    .select('id, email, source, created_at')
    .order('created_at', { ascending: false })
  const subscribers = (data as unknown as Subscriber[]) ?? []

  const csv = ['email,source,date', ...subscribers.map(s =>
    `${s.email},${s.source ?? 'homepage'},${new Date(s.created_at).toLocaleDateString()}`
  )].join('\n')

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#0d2b55' }}>Subscribers</h1>
          <p className="text-gray-500 text-sm">{subscribers.length} email subscriber{subscribers.length !== 1 ? 's' : ''}</p>
        </div>
        {subscribers.length > 0 && (
          <a
            href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}
            download="thomas-marine-subscribers.csv"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Download size={14} /> Export CSV
          </a>
        )}
      </div>

      {subscribers.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
          <Mail size={40} className="mx-auto mb-4 text-gray-300" />
          <p className="font-semibold mb-1" style={{ color: '#0d2b55' }}>No subscribers yet</p>
          <p className="text-sm text-gray-500">Signups from the homepage newsletter form will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="text-left px-5 py-3 font-semibold">Email</th>
                <th className="text-left px-5 py-3 font-semibold hidden sm:table-cell">Source</th>
                <th className="text-left px-5 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium" style={{ color: '#0d2b55' }}>{s.email}</td>
                  <td className="px-5 py-3 text-gray-500 capitalize hidden sm:table-cell">{s.source ?? 'homepage'}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs">
                    {new Date(s.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
