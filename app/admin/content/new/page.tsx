'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createContentItem } from '@/src/features/content/store'
import { ArrowLeft, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

const contentTypes = [
  { value: 'blog', label: 'Blog Post', description: 'General article or update' },
  { value: 'success_story', label: 'Success Story', description: 'Survivor journey or testimonial' },
  { value: 'news', label: 'News', description: 'Organization news or announcement' },
  { value: 'resource', label: 'Resource', description: 'Helpful resource or guide' },
  { value: 'event', label: 'Event', description: 'Upcoming event or program' },
]

export default function NewContentPage() {
  const [title, setTitle] = useState('')
  const [type, setType] = useState('blog')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    
    setLoading(true)
    try {
      const newItem = await createContentItem(title, type as any)
      router.push(`/admin/content/${newItem.id}`)
    } catch (err) {
      console.error('Failed to create content:', err)
      alert('Failed to create content. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/admin/content" 
          className="inline-flex items-center gap-2 text-sm text-[#8B5E3C] hover:text-[#C8A46B] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Content
        </Link>
        <h1 className="text-2xl font-bold text-[#1E1714]">Create New Content</h1>
        <p className="text-sm text-[#8B5E3C]">Start with a title and content type.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#3A2A24]/20 p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#1E1714] mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter content title..."
            className="w-full border border-[#3A2A24]/20 rounded-lg px-4 py-2.5 text-[#1E1714] placeholder-[#8B5E3C] focus:outline-none focus:border-[#1E6B73] transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1E1714] mb-3">
            Content Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {contentTypes.map((t) => (
              <label
                key={t.value}
                className={`cursor-pointer rounded-xl border p-4 transition-all ${
                  type === t.value
                    ? 'border-[#1E6B73] bg-[#1E6B73]/5'
                    : 'border-[#3A2A24]/20 hover:border-[#8B5E3C]'
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value={t.value}
                  checked={type === t.value}
                  onChange={(e) => setType(e.target.value)}
                  className="sr-only"
                />
                <p className="font-medium text-[#1E1714]">{t.label}</p>
                <p className="text-xs text-[#8B5E3C] mt-1">{t.description}</p>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-[#3A2A24]/10 flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/content')}
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
              'Creating...'
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Create Content
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
