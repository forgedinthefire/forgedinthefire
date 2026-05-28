'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'
import { Save, Calendar, Send, Trash2, Upload, ArrowLeft, FileEdit } from 'lucide-react'
import Link from 'next/link'

// Lazy-load the editor so the heavy TipTap bundle only loads when admins write posts
const TipTapEditor = dynamic(() => import('@/src/components/admin/TipTapEditor'), {
  ssr: false,
  loading: () => <div className="border border-gray-200 rounded-lg h-96 bg-white animate-pulse" />,
})

type Status = 'draft' | 'scheduled' | 'published' | 'archived'

export type PostInitial = {
  id: string
  title: string
  slug: string
  summary: string | null
  cover_image_url: string | null
  content_json: object | null
  content_html: string | null
  status: Status | null
  published_at: string | null
  scheduled_for: string | null
  tags: string[] | null
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function toDatetimeLocal(iso: string | null | undefined) {
  if (!iso) return ''
  const d = new Date(iso)
  const tzOffset = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16)
}

export default function BlogPostForm({ initialPost }: { initialPost?: PostInitial }) {
  const router = useRouter()
  const [title, setTitle] = useState(initialPost?.title ?? '')
  const [slug, setSlug] = useState(initialPost?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(Boolean(initialPost?.slug))
  const [summary, setSummary] = useState(initialPost?.summary ?? '')
  const [coverImageUrl, setCoverImageUrl] = useState(initialPost?.cover_image_url ?? '')
  const [contentJson, setContentJson] = useState<object | null>(initialPost?.content_json ?? null)
  const [contentHtml, setContentHtml] = useState(initialPost?.content_html ?? '')
  const [tags, setTags] = useState((initialPost?.tags ?? []).join(', '))
  const [scheduledFor, setScheduledFor] = useState(toDatetimeLocal(initialPost?.scheduled_for))
  const [status, setStatus] = useState<Status>(initialPost?.status ?? 'draft')
  const [saving, setSaving] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function onTitleChange(value: string) {
    setTitle(value)
    if (!slugTouched) setSlug(slugify(value))
  }

  async function uploadImage(file: File, bucket: 'blog-images' | 'promo-images' = 'blog-images') {
    const supabase = createClient()
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, { upsert: false })
    if (upErr) throw upErr
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  }

  async function onCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingCover(true)
    setError(null)
    try {
      const url = await uploadImage(file)
      setCoverImageUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploadingCover(false)
    }
  }

  async function pickEditorImage(): Promise<string | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = async () => {
        const file = input.files?.[0]
        if (!file) return resolve(null)
        try {
          const url = await uploadImage(file)
          resolve(url)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Upload failed')
          resolve(null)
        }
      }
      input.click()
    })
  }

  async function save(targetStatus: Status) {
    setSaving(true)
    setError(null)
    try {
      if (!title.trim()) throw new Error('Title is required.')
      if (!slug.trim()) throw new Error('Slug is required.')
      if (targetStatus === 'scheduled' && !scheduledFor) {
        throw new Error('Pick a date and time to schedule.')
      }

      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: initialPost?.id,
          title: title.trim(),
          slug: slug.trim(),
          summary: summary.trim() || null,
          cover_image_url: coverImageUrl || null,
          content_json: contentJson,
          content_html: contentHtml,
          status: targetStatus,
          published_at:
            targetStatus === 'published' ? new Date().toISOString() :
            targetStatus === 'scheduled' ? new Date(scheduledFor).toISOString() :
            null,
          scheduled_for: targetStatus === 'scheduled' ? new Date(scheduledFor).toISOString() : null,
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Save failed')
      setStatus(targetStatus)
      if (!initialPost?.id && data?.id) {
        router.push(`/admin/blog/${data.id}`)
      } else {
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function deletePost() {
    if (!initialPost?.id) return
    if (!window.confirm('Delete this post? This cannot be undone.')) return
    setSaving(true)
    try {
      await fetch(`/api/admin/blog?id=${initialPost.id}`, { method: 'DELETE' })
      router.push('/admin/blog')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main column */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/blog" className="text-gray-400 hover:text-blue-700">
            <ArrowLeft size={18} />
          </Link>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Post title…"
            className="flex-1 text-2xl font-bold border-none focus:outline-none bg-transparent"
            style={{ color: '#0d2b55' }}
          />
        </div>

        <input
          type="text"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Short summary (shown in /blog list and meta description)"
          className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        />

        <TipTapEditor
          initialContent={contentJson ?? contentHtml ?? ''}
          onChange={({ json, html }) => {
            setContentJson(json)
            setContentHtml(html)
          }}
          onImageUpload={pickEditorImage}
          placeholder="Start writing your post here…"
        />
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        <Panel title="Publish">
          <div className="space-y-3">
            <Row label="Status">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
                style={{ backgroundColor: '#f3f4f6', color: '#374151' }}
              >
                {status}
              </span>
            </Row>
            <Row label="Slug">
              <input
                type="text"
                value={slug}
                onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true) }}
                className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-xs font-mono focus:outline-none"
              />
            </Row>
            <Row label="Schedule for">
              <input
                type="datetime-local"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-xs focus:outline-none"
              />
            </Row>
            <Row label="Tags">
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="repower, maintenance"
                className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-xs focus:outline-none"
              />
            </Row>
          </div>
          <div className="border-t border-gray-100 mt-5 pt-4 space-y-2">
            <button
              type="button"
              onClick={() => save('draft')}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <FileEdit size={14} /> Save Draft
            </button>
            <button
              type="button"
              onClick={() => save('scheduled')}
              disabled={saving || !scheduledFor}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm border-2 border-blue-700 text-blue-700 hover:bg-blue-50 disabled:opacity-50"
            >
              <Calendar size={14} /> Schedule
            </button>
            <button
              type="button"
              onClick={() => save('published')}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm text-white disabled:opacity-50"
              style={{ backgroundColor: '#0d2b55' }}
            >
              <Send size={14} /> {saving ? 'Saving…' : 'Publish Now'}
            </button>
            {initialPost?.id && (
              <button
                type="button"
                onClick={deletePost}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 size={14} /> Delete
              </button>
            )}
          </div>
        </Panel>

        <Panel title="Cover Image">
          {coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverImageUrl} alt="Cover" className="w-full rounded-md aspect-[16/9] object-cover mb-3" />
          ) : (
            <div className="w-full aspect-[16/9] bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-xs mb-3">
              No cover yet
            </div>
          )}
          <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer">
            <Upload size={14} />
            {uploadingCover ? 'Uploading…' : 'Upload Image'}
            <input type="file" accept="image/*" className="hidden" onChange={onCoverUpload} disabled={uploadingCover} />
          </label>
        </Panel>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">{title}</p>
      {children}
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-600 mb-1">{label}</p>
      {children}
    </div>
  )
}

// Mark Save icon as used so eslint doesn't complain about the import
void Save
