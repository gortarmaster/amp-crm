'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, usePathname } from 'next/navigation'
import { FolderOpen, Calendar, DollarSign, MapPin, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import ColumnEditor, { type ColumnDef } from '@/components/dashboard/ColumnEditor'
import ProjectStatusBadge from '@/components/dashboard/ProjectStatusBadge'
import type { ProjectWithCompany, ProjectStatus } from '@/lib/supabase/database.types'

const COLUMN_DEFS: ColumnDef[] = [
  { key: 'title',         label: 'Title',         required: true },
  { key: 'status',        label: 'Status' },
  { key: 'company',       label: 'Company' },
  { key: 'shoot_date',    label: 'Shoot Date' },
  { key: 'delivery_date', label: 'Delivery Date' },
  { key: 'value',         label: 'Value' },
  { key: 'category',      label: 'Category' },
  { key: 'location',      label: 'Location' },
]
const DEFAULT_VISIBLE = ['title', 'status', 'company', 'shoot_date', 'value']

interface Props {
  projects: ProjectWithCompany[]
  q: string
  filterCount: number
}

export default function ProjectsView({ projects, q, filterCount }: Props) {
  const [visibleCols, setVisibleCols] = useState<string[]>(DEFAULT_VISIBLE)
  const [mounted, setMounted] = useState(false)
  const searchParams = useSearchParams()
  const pathname = usePathname()

  useEffect(() => { setMounted(true) }, [])

  const sort = searchParams.get('sort') ?? 'shoot_date'
  const dir  = searchParams.get('dir')  ?? 'desc'

  function headerLink(col: string) {
    const active = sort === col
    const nextDir = active && dir === 'desc' ? 'asc' : 'desc'
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', col)
    params.set('dir', nextDir)
    return `${pathname}?${params.toString()}`
  }

  function SortIcon({ col }: { col: string }) {
    if (sort !== col) return <ChevronsUpDown size={11} className="ml-1 inline text-ink-muted/40" />
    return dir === 'asc'
      ? <ChevronUp size={11} className="ml-1 inline text-gold" />
      : <ChevronDown size={11} className="ml-1 inline text-gold" />
  }

  function fmtDate(d: string | null) {
    if (!d) return null
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
  }

  function fmtValue(v: number | null) {
    if (v == null) return null
    return `$${v.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 rounded-token-lg border border-line bg-bg-card p-4 text-ink-muted">
          <FolderOpen size={24} strokeWidth={1.5} />
        </div>
        <p className="text-body font-medium text-ink-primary">
          {q || filterCount > 0 ? 'No projects match your filters' : 'No projects yet'}
        </p>
        {!q && filterCount === 0 && (
          <Link href="/dashboard/projects/new" className="mt-4 inline-flex items-center gap-2 rounded-token-md border border-gold/30 px-4 py-2 text-caption font-medium text-gold transition-colors hover:bg-gold/5">
            New Project
          </Link>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Mobile: card grid */}
      <div className="grid grid-cols-1 gap-3 p-4 md:hidden">
        {projects.map((p) => (
          <Link
            key={p.id}
            href={`/dashboard/projects/${p.id}`}
            className="block rounded-token-lg border border-line bg-bg-card p-4 transition-all active:scale-[0.99] hover:border-gold/30"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <ProjectStatusBadge status={p.status as ProjectStatus} />
              {p.category && (
                <span className="rounded-full border border-line px-2 py-0.5 text-ink-muted" style={{ fontSize: '10px' }}>
                  {p.category}
                </span>
              )}
            </div>
            <p className="text-body font-semibold text-ink-primary">{p.title}</p>
            {p.location && <p className="mt-0.5 text-caption text-ink-muted">{p.location}</p>}
            <div className="mt-3 space-y-1.5">
              {p.shoot_date && (
                <div className="flex items-center gap-2 text-caption text-ink-secondary">
                  <Calendar size={12} strokeWidth={1.5} className="flex-shrink-0 text-ink-muted" />
                  {fmtDate(p.shoot_date)}
                </div>
              )}
              {p.deal_value != null && (
                <div className="flex items-center gap-2 text-caption text-ink-secondary">
                  <DollarSign size={12} strokeWidth={1.5} className="flex-shrink-0 text-ink-muted" />
                  {fmtValue(p.deal_value)}
                </div>
              )}
              {p.companies && (
                <div className="flex items-center gap-2 text-caption text-ink-secondary">
                  <MapPin size={12} strokeWidth={1.5} className="flex-shrink-0 text-ink-muted" />
                  {p.companies.name}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden px-8 py-4 md:block">
        <div className="mb-3 flex justify-end">
          {mounted && (
            <ColumnEditor
              storageKey="projects_columns"
              columns={COLUMN_DEFS}
              defaultVisible={DEFAULT_VISIBLE}
              onChange={setVisibleCols}
            />
          )}
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-line">
              {COLUMN_DEFS.filter((c) => visibleCols.includes(c.key)).map(({ key, label }) => (
                <th key={key} className="pb-3 text-left text-caption font-medium text-ink-muted">
                  <Link href={headerLink(key)} className="inline-flex items-center transition-colors hover:text-ink-primary">
                    {label}<SortIcon col={key} />
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line/50">
            {projects.map((p) => (
              <tr key={p.id} className="group transition-colors hover:bg-bg-hover/40">
                {visibleCols.includes('title') && (
                  <td className="py-3 pr-4">
                    <Link href={`/dashboard/projects/${p.id}`} className="text-caption font-medium text-ink-primary transition-colors hover:text-gold">
                      {p.title}
                    </Link>
                    {p.location && <p className="mt-0.5 text-ink-muted" style={{ fontSize: '11px' }}>{p.location}</p>}
                  </td>
                )}
                {visibleCols.includes('status') && (
                  <td className="py-3 pr-4"><ProjectStatusBadge status={p.status as ProjectStatus} /></td>
                )}
                {visibleCols.includes('company') && (
                  <td className="py-3 pr-4">
                    {p.companies ? (
                      <Link href={`/dashboard/companies/${p.company_id}`} className="text-caption text-ink-secondary transition-colors hover:text-gold">
                        {p.companies.name}
                      </Link>
                    ) : <span className="text-caption text-ink-secondary">—</span>}
                  </td>
                )}
                {visibleCols.includes('shoot_date') && (
                  <td className="py-3 pr-4"><span className="text-caption text-ink-secondary">{fmtDate(p.shoot_date) ?? '—'}</span></td>
                )}
                {visibleCols.includes('delivery_date') && (
                  <td className="py-3 pr-4"><span className="text-caption text-ink-secondary">{fmtDate(p.delivery_date) ?? '—'}</span></td>
                )}
                {visibleCols.includes('value') && (
                  <td className="py-3 pr-4"><span className="text-caption text-ink-secondary">{fmtValue(p.deal_value) ?? '—'}</span></td>
                )}
                {visibleCols.includes('category') && (
                  <td className="py-3 pr-4"><span className="text-caption text-ink-secondary">{p.category ?? '—'}</span></td>
                )}
                {visibleCols.includes('location') && (
                  <td className="py-3"><span className="text-caption text-ink-secondary">{p.location ?? '—'}</span></td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
