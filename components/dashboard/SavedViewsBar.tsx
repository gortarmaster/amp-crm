'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Bookmark, X } from 'lucide-react'
import { createSavedView, deleteSavedView } from '@/app/dashboard/saved-views/actions'
import type { SavedView } from '@/lib/supabase/database.types'
import { encodeFilters } from '@/lib/filters'

interface Props {
  savedViews: SavedView[]
  activeViewId: string | undefined
  objectType: string
  objectPath: string
  allLabel: string
}

export default function SavedViewsBar({ savedViews, activeViewId, objectType, objectPath, allLabel }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [saving, setSaving] = useState(false)
  const [viewName, setViewName] = useState('')

  function applyView(view: SavedView) {
    const params = new URLSearchParams()
    params.set('view_id', view.id)
    if (Array.isArray(view.filters) && view.filters.length > 0) {
      params.set('filters', encodeFilters(view.filters as Parameters<typeof encodeFilters>[0]))
    }
    if (view.sort_col) params.set('sort', view.sort_col)
    if (view.sort_dir) params.set('dir', view.sort_dir)
    router.push(`${objectPath}?${params.toString()}`)
  }

  function clearView() {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('view_id')
    params.delete('filters')
    router.push(`${pathname}?${params.toString()}`)
  }

  function handleSave() {
    if (!viewName.trim()) return
    const formData = new FormData()
    formData.set('name', viewName.trim())
    formData.set('object_type', objectType)
    formData.set('filters', searchParams.get('filters') ?? '')
    formData.set('sort_col', searchParams.get('sort') ?? '')
    formData.set('sort_dir', searchParams.get('dir') ?? '')
    startTransition(async () => {
      await createSavedView(formData)
      setSaving(false)
      setViewName('')
    })
  }

  function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    startTransition(async () => {
      await deleteSavedView(id, objectType)
      if (activeViewId === id) clearView()
    })
  }

  return (
    <div className="flex items-center justify-between border-b border-line px-8">
      <div className="flex items-center overflow-x-auto">
        <button
          onClick={clearView}
          className={`-mb-px border-b-2 px-4 py-3 text-caption font-medium whitespace-nowrap transition-colors ${
            !activeViewId
              ? 'border-gold text-gold'
              : 'border-transparent text-ink-muted hover:text-ink-secondary'
          }`}
        >
          {allLabel}
        </button>

        {savedViews.map((view) => (
          <button
            key={view.id}
            onClick={() => applyView(view)}
            className={`-mb-px flex items-center gap-1.5 border-b-2 px-4 py-3 text-caption font-medium whitespace-nowrap transition-colors ${
              activeViewId === view.id
                ? 'border-gold text-gold'
                : 'border-transparent text-ink-muted hover:text-ink-secondary'
            }`}
          >
            {view.name}
            <span
              role="button"
              onClick={(e) => handleDelete(view.id, e)}
              className="opacity-40 transition-opacity hover:opacity-100"
            >
              <X size={10} />
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-shrink-0 items-center gap-2 pl-4 py-2">
        {saving ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') { setSaving(false); setViewName('') } }}
              placeholder="View name…"
              autoFocus
              className="w-32 rounded-token-md border border-gold/40 bg-bg-card px-2.5 py-1 text-caption text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-gold/20"
            />
            <button
              onClick={handleSave}
              disabled={isPending || !viewName.trim()}
              className="rounded-token-md bg-gold px-3 py-1 text-caption font-semibold text-bg-base disabled:opacity-50 hover:bg-gold-light transition-colors"
            >
              {isPending ? '…' : 'Save'}
            </button>
            <button
              onClick={() => { setSaving(false); setViewName('') }}
              className="text-caption text-ink-muted hover:text-ink-primary transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSaving(true)}
            className="inline-flex items-center gap-1.5 text-caption text-ink-muted transition-colors hover:text-gold"
          >
            <Bookmark size={12} strokeWidth={1.5} />
            Save view
          </button>
        )}
      </div>
    </div>
  )
}
