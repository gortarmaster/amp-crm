'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, usePathname } from 'next/navigation'
import { Users, Mail, Phone, Building2, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import ColumnEditor, { type ColumnDef } from '@/components/dashboard/ColumnEditor'
import type { ContactWithCompany } from '@/lib/supabase/database.types'

const COLUMN_DEFS: ColumnDef[] = [
  { key: 'name',    label: 'Name',    required: true },
  { key: 'email',   label: 'Email' },
  { key: 'company', label: 'Company' },
  { key: 'title',   label: 'Title' },
  { key: 'phone',   label: 'Phone' },
  { key: 'added',   label: 'Added' },
]
const DEFAULT_VISIBLE = ['name', 'email', 'company', 'title', 'added']

interface Props {
  contacts: ContactWithCompany[]
  q: string
  filterCount: number
}

export default function ContactsView({ contacts, q, filterCount }: Props) {
  const [visibleCols, setVisibleCols] = useState<string[]>(DEFAULT_VISIBLE)
  const [mounted, setMounted] = useState(false)
  const searchParams = useSearchParams()
  const pathname = usePathname()

  useEffect(() => { setMounted(true) }, [])

  const sort = searchParams.get('sort') ?? 'added'
  const dir  = searchParams.get('dir')  ?? 'desc'

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

  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 rounded-token-lg border border-line bg-bg-card p-4 text-ink-muted">
          <Users size={24} strokeWidth={1.5} />
        </div>
        <p className="text-body font-medium text-ink-primary">
          {q || filterCount > 0 ? 'No contacts match your filters' : 'No contacts yet'}
        </p>
        {!q && filterCount === 0 && (
          <Link href="/dashboard/contacts/new" className="mt-4 inline-flex items-center gap-2 rounded-token-md border border-gold/30 px-4 py-2 text-caption font-medium text-gold transition-colors hover:bg-gold/5">
            Add Contact
          </Link>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Mobile: card grid */}
      <div className="grid grid-cols-1 gap-3 p-4 md:hidden">
        {contacts.map((c) => (
          <Link
            key={c.id}
            href={`/dashboard/contacts/${c.id}`}
            className="block rounded-token-lg border border-line bg-bg-card p-4 transition-all active:scale-[0.99] hover:border-gold/30"
          >
            <p className="text-body font-semibold text-ink-primary">{c.first_name} {c.last_name}</p>
            {c.title && <p className="mt-0.5 text-caption text-ink-muted">{c.title}</p>}
            <div className="mt-3 space-y-1.5">
              {c.email && (
                <div className="flex items-center gap-2 text-caption text-ink-secondary">
                  <Mail size={12} strokeWidth={1.5} className="flex-shrink-0 text-ink-muted" />
                  {c.email}
                </div>
              )}
              {c.companies && (
                <div className="flex items-center gap-2 text-caption text-ink-secondary">
                  <Building2 size={12} strokeWidth={1.5} className="flex-shrink-0 text-ink-muted" />
                  {c.companies.name}
                </div>
              )}
              {c.phone && (
                <div className="flex items-center gap-2 text-caption text-ink-secondary">
                  <Phone size={12} strokeWidth={1.5} className="flex-shrink-0 text-ink-muted" />
                  {c.phone}
                </div>
              )}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {c.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-full border border-gold/20 bg-gold/5 px-2 py-0.5 text-gold" style={{ fontSize: '10px' }}>
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-ink-muted" style={{ fontSize: '11px' }}>
                {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden px-8 py-4 md:block">
        <div className="mb-3 flex justify-end">
          {mounted && (
            <ColumnEditor
              storageKey="contacts_columns"
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
            {contacts.map((c) => (
              <tr key={c.id} className="group transition-colors hover:bg-bg-hover/40">
                {visibleCols.includes('name') && (
                  <td className="py-3 pr-4">
                    <Link href={`/dashboard/contacts/${c.id}`} className="text-caption font-medium text-ink-primary transition-colors hover:text-gold">
                      {c.first_name} {c.last_name}
                    </Link>
                  </td>
                )}
                {visibleCols.includes('email') && (
                  <td className="py-3 pr-4"><span className="text-caption text-ink-secondary">{c.email ?? '—'}</span></td>
                )}
                {visibleCols.includes('company') && (
                  <td className="py-3 pr-4">
                    {c.companies ? (
                      <Link href={`/dashboard/companies/${c.company_id}`} className="text-caption text-ink-secondary transition-colors hover:text-gold">
                        {c.companies.name}
                      </Link>
                    ) : <span className="text-caption text-ink-secondary">—</span>}
                  </td>
                )}
                {visibleCols.includes('title') && (
                  <td className="py-3 pr-4"><span className="text-caption text-ink-secondary">{c.title ?? '—'}</span></td>
                )}
                {visibleCols.includes('phone') && (
                  <td className="py-3 pr-4"><span className="text-caption text-ink-secondary">{c.phone ?? '—'}</span></td>
                )}
                {visibleCols.includes('added') && (
                  <td className="py-3">
                    <span className="text-caption text-ink-muted">
                      {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
