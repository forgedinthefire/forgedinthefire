'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createContentItem } from '@/src/features/content/store'
import type { PostTemplate, ContentCategory } from '@/src/features/content/types'
import { ArrowLeft, Plus, FileText, Calendar, Heart, Users, Gift, BookOpen, Handshake, Megaphone } from 'lucide-react'
import { Button } from '@/components/ui/button'

const templates: { 
  value: PostTemplate
  label: string
  description: string
  icon: React.ElementType
  category: ContentCategory
}[] = [
  { 
    value: 'standard', 
    label: 'Standard Post', 
    description: 'General blog post or article',
    icon: FileText,
    category: 'news'
  },
  { 
    value: 'event', 
    label: 'Event', 
    description: 'Event announcement or recap',
    icon: Calendar,
    category: 'events'
  },
  { 
    value: 'impact-story', 
    label: 'Impact Story', 
    description: 'Survivor journey or success story',
    icon: Heart,
    category: 'impact-stories'
  },
  { 
    value: 'volunteer-opp', 
    label: 'Volunteer Opportunity', 
    description: 'Volunteer position or opportunity',
    icon: Users,
    category: 'volunteer'
  },
  { 
    value: 'donor-update', 
    label: 'Donor Update', 
    description: 'Update for donors and supporters',
    icon: Gift,
    category: 'donor-updates'
  },
  { 
    value: 'resource-guide', 
    label: 'Resource Guide', 
    description: 'Helpful resource or guide',
    icon: BookOpen,
    category: 'resources'
  },
  { 
    value: 'partner-spotlight', 
    label: 'Partner Spotlight', 
    description: 'Feature a partner organization',
    icon: Handshake,
    category: 'partners'
  },
  { 
    value: 'fundraising', 
    label: 'Fundraising', 
    description: 'Campaign or fundraising update',
    icon: Megaphone,
    category: 'fundraising'
  },
]

export default function NewBlogPostPage() {
  const [title, setTitle] = useState('')
  const [template, setTemplate] = useState<PostTemplate>('standard')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    
    setLoading(true)
    try {
      const selectedTemplate = templates.find(t => t.value === template)
      const newItem = await createContentItem(
        title, 
        template,
        selectedTemplate?.category
      )
      router.push(`/admin/blog/${newItem.id}`)
    } catch (err) {
      console.error('Failed to create post:', err)
      alert('Failed to create post. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/admin/blog" 
          className="inline-flex items-center gap-2 text-sm text-[#8B5E3C] hover:text-[#C8A46B] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
        <h1 className="text-2xl font-bold text-[#1E1714]">Create New Post</h1>
        <p className="text-sm text-[#8B5E3C]">Choose a template and start writing.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title */}
        <div className="bg-white rounded-xl border border-[#3A2A24]/20 p-6">
          <label className="block text-sm font-medium text-[#1E1714] mb-2">
            Post Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a compelling title..."
            className="w-full text-lg border border-[#3A2A24]/20 rounded-lg px-4 py-3 text-[#1E1714] placeholder-[#8B5E3C] focus:outline-none focus:border-[#1E6B73] transition-colors"
            required
          />
          <p className="text-xs text-[#8B5E3C] mt-2">
            This will be used as the SEO title unless you customize it later.
          </p>
        </div>

        {/* Template Selection */}
        <div>
          <label className="block text-sm font-medium text-[#1E1714] mb-3">
            Post Template <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {templates.map((t) => {
              const Icon = t.icon
              return (
                <label
                  key={t.value}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    template === t.value
                      ? 'border-[#1E6B73] bg-[#1E6B73]/5'
                      : 'border-[#3A2A24]/20 hover:border-[#8B5E3C]'
                  }`}
                >
                  <input
                    type="radio"
                    name="template"
                    value={t.value}
                    checked={template === t.value}
                    onChange={(e) => setTemplate(e.target.value as PostTemplate)}
                    className="sr-only"
                  />
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      template === t.value ? 'bg-[#1E6B73] text-white' : 'bg-[#f4f6f9] text-[#8B5E3C]'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-[#1E1714]">{t.label}</p>
                      <p className="text-xs text-[#8B5E3C] mt-1">{t.description}</p>
                    </div>
                  </div>
                </label>
              )
            })}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-[#1E1714] rounded-xl p-5 border border-[#3A2A24]">
          <h3 className="text-sm font-semibold text-[#C8A46B] mb-3">Writing Tips</h3>
          <ul className="space-y-2 text-sm text-[#CDBDAF]">
            <li className="flex items-start gap-2">
              <span className="text-[#4C9AA3]">•</span>
              Keep titles under 65 characters for SEO
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4C9AA3]">•</span>
              For impact stories, always obtain proper consent
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4C9AA3]">•</span>
              Include clear calls to action (donate, volunteer, etc.)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4C9AA3]">•</span>
              Add featured images for better engagement
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/blog')}
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
                Create Post
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
