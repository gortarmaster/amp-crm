'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, usePathname } from 'next/navigation'
import { Building2, Globe, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import ColumnEditor, { type ColumnDef } from '@/components/dashboard/ColumnEditor'
import type { Company } from '@/lib/supabase/database.types'

const COLUMN_DEFS: ColumnDef[] = [
  { key: 'name',     label: 'Name',     required: true },
  { key: 'industry', label: 'Industry' },
  { key: 'website',  label: 'Website' },
  { key: 'added',    label: 'Added' },
]
const DEFAULT_VISIBLE = ['name', 'industry', 'website', 'added']

interface Props {
  companies: Company[]
  q: string
  filterCount: number
}

export default function CompaniesView({ companies, q, filterCount }: Props) {
  const [visibleCols, setVisibleCols] = useState<string[]>(DEFAULT_VISIBLE)
  const [mounted, setMounted] = useState(false)
  const searchParams = useSearchParams()
  const pathname = usePathname()

  useEffect(() => { setMounted(true) }, [])

  const sort = searchParams.get('sort') ?? 'name'
  const dir  = searchParams.get('dir')  ?? 'asc'

  function headerLink(col: string) {
    const active = sort === col
    const nextDir = active && dir === 'asc' ? 'desc' : 'asc'
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

  if (companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 rounded-token-lg border border-line bg-bg-card p-4 text-ink-muted">
          <Building2 size={24} strokeWidth={1.5} />
        </div>
        <p className="text-body font-medium text-ink-primary">
          {q || filterCount > 0 ? 'No companies match your filters' : 'No companies yet'}
        </p>
        {!q && filterCount === 0 && (
          <Link href="/dashboard/companies/new" className="mt-4 inline-flex items-center gap-2 rounded-token-md border border-gold/30 px-4 py-2 text-caption font-medium text-gold transition-colors hover:bg-gold/5">
            Add Company
          </Link>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Mobile: card grid */}
      <div className="grid grid-cols-1 gap-3 p-4 md:hidden">
        {companies.map((co) => (
          <Link
            key={co.id}
            href={`/dashboard/companies/${co.id}`}
            className="block rounded-token-lg border border-line bg-bg-card p-4 transition-all active:scale-[0.99] hover:border-gold/30"
          >
            <p className="text-body font-semibold text-ink-primary">{co.name}</p>
            {co.industry && <p className="mt-0.5 text-caption text-ink-muted">{co.industry}</p>}
            {co.website && (
              <div className="mt-3 flex items-center gap-2 text-caption text-ink-secondary">
                <Globe size={12} strokeWidth={1.5} className="flex-shrink-0 text-ink-muted" />
                {co.website.replace(/^https?:\/\//, '')}
              </div>
            )}
            <p className="mt-3 text-ink-muted" style={{ fontSize: '11px' }}>
              {new Date(co.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </Link>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden px-8 py-4 md:block">
        <div className="mb-3 flex justify-end">
          {mounted && (
            <ColumnEditor
              storageKey="companies_columns"
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
            {companies.map((co) => (
              <tr key={co.id} className="group transition-colors hover:bg-bg-hover/40">
                {visibleCols.includes('name') && (
                  <td className="py-3 pr-4">
                    <Link href={`/dashboard/companies/${co.id}`} className="text-caption font-medium text-ink-primary transition-colors hover:text-gold">
                      {co.name}
                    </Link>
                  </td>
                )}
                {visibleCols.includes('industry') && (
                  <td className="py-3 pr-4"><span className="text-caption text-ink-secondary">{co.industry ?? '—'}</span></td>
                )}
                {visibleCols.includes('website') && (
                  <td className="py-3 pr-4">
                    {co.website ? (
                      <a href={co.website} target="_blank" rel="noopener noreferrer" className="text-caption text-ink-secondary transition-colors hover:text-gold">
                        {co.website.replace(/^https?:\/\//, '')}
                      </a>
                    ) : <span className="text-caption text-ink-secondary">—</span>}
                  </td>
                )}
                {visibleCols.includes('added') && (
                  <td className="py-3">
                    <span className="text-caption text-ink-muted">
                      {new Date(co.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
