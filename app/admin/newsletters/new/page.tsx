'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Plus, Loader2 } from 'lucide-react'

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
]

export default function NewNewsletterPage() {
  const [title, setTitle] = useState('')
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  
  // Handle missing Supabase configuration
  if (!supabase) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6">
          <h2 className="text-amber-400 font-medium mb-2">Database Not Connected</h2>
          <p className="text-amber-400/80 text-sm">
            Supabase environment variables are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
          </p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('newsletters')
        .insert({
          title: title.trim(),
          month,
          year,
          status: 'draft',
        })
        .select()
        .single()

      if (error) throw error

      router.push(`/admin/newsletters/${data.id}`)
    } catch (err) {
      console.error('Failed to create newsletter:', err)
      alert('Failed to create newsletter. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/newsletters"
          className="inline-flex items-center gap-2 text-sm text-[#8B5E3C] hover:text-[#C8A46B] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Newsletters
        </Link>
        <h1 className="text-2xl font-bold text-[#1E1714]">Create New Newsletter</h1>
        <p className="text-sm text-[#8B5E3C]">
          Start a new monthly newsletter. You will add blog posts and content on the next step.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="bg-white rounded-xl border border-[#3A2A24]/20 p-6">
          <Label htmlFor="title" className="block text-sm font-medium text-[#1E1714] mb-2">
            Newsletter Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., March 2024 Update"
            className="w-full text-lg"
            required
          />
          <p className="text-xs text-[#8B5E3C] mt-2">
            This will appear as the subject line of the newsletter email.
          </p>
        </div>

        {/* Month and Year */}
        <div className="bg-white rounded-xl border border-[#3A2A24]/20 p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="month" className="block text-sm font-medium text-[#1E1714] mb-2">
                Month
              </Label>
              <select
                id="month"
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="w-full border border-[#3A2A24]/20 rounded-lg px-3 py-2 text-[#1E1714] focus:outline-none focus:border-[#1E6B73]"
              >
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="year" className="block text-sm font-medium text-[#1E1714] mb-2">
                Year
              </Label>
              <Input
                id="year"
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                min={2024}
                max={2030}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/newsletters')}
            className="border-[#3A2A24]/20 text-[#8B5E3C]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || !title.trim()}
            className="bg-[#1E6B73] hover:bg-[#4C9AA3] text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Create Newsletter
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
