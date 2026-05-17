import Link from 'next/link'
import { Plus, Search, Building2 } from 'lucide-react'
import { requireUser } from '@/lib/supabase/auth'
import { createServerClient } from '@/lib/supabase/server'
import type { Company } from '@/lib/supabase/database.types'

interface Props {
  searchParams: Promise<{ q?: string }>
}

export default async function CompaniesPage({ searchParams }: Props) {
  const user = await requireUser()

  const { q: rawQ } = await searchParams
  const q = rawQ?.trim() ?? ''

  let companies: Company[] = []

  if (user) {
    const supabase = createServerClient()

    let query = supabase
      .from('companies')
      .select('*')
      .eq('user_id', user.id)
      .order('name')

    if (q) {
      query = query.or(`name.ilike.%${q}%,industry.ilike.%${q}%`)
    }

    const { data, error } = await query
    if (error) throw error
    companies = data ?? []
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line px-8 py-5">
        <div>
          <h1 className="text-heading text-ink-primary">Companies</h1>
          <p className="mt-0.5 text-caption text-ink-muted">
            {companies.length}{' '}
            {companies.length === 1 ? 'company' : 'companies'}
          </p>
        </div>
        <Link
          href="/dashboard/companies/new"
          className="inline-flex items-center gap-2 rounded-token-md bg-gold px-4 py-2 text-caption font-semibold text-bg-base transition-colors hover:bg-gold-light"
        >
          <Plus size={14} />
          Add Company
        </Link>
      </div>

      {/* Search */}
      <div className="border-b border-line px-8 py-4">
        <form>
          <div className="relative max-w-sm">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
            />
            <input
              name="q"
              defaultValue={q}
              placeholder="Search by name or industry…"
              className="w-full rounded-token-md border border-line bg-bg-card py-2 pl-9 pr-4 text-caption text-ink-primary placeholder:text-ink-muted transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
            />
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto px-8 py-4">
        {companies.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-line">
                {['Name', 'Industry', 'Website', 'Added'].map((col) => (
                  <th
                    key={col}
                    className="pb-3 text-left text-caption font-medium text-ink-muted"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line/50">
              {companies.map((company) => (
                <tr key={company.id} className="group transition-colors hover:bg-bg-hover/40">
                  <td className="py-3 pr-4">
                    <Link
                      href={`/dashboard/companies/${company.id}`}
                      className="text-caption font-medium text-ink-primary transition-colors hover:text-gold"
                    >
                      {company.name}
                    </Link>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-caption text-ink-secondary">
                      {company.industry ?? '—'}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    {company.website ? (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-caption text-ink-secondary transition-colors hover:text-gold"
                      >
                        {company.website.replace(/^https?:\/\//, '')}
                      </a>
                    ) : (
                      <span className="text-caption text-ink-secondary">—</span>
                    )}
                  </td>
                  <td className="py-3">
                    <span className="text-caption text-ink-muted">
                      {new Date(company.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 rounded-token-lg border border-line bg-bg-card p-4 text-ink-muted">
              <Building2 size={24} strokeWidth={1.5} />
            </div>
            <p className="text-body font-medium text-ink-primary">
              {q ? 'No companies match your search' : 'No companies yet'}
            </p>
            <p className="mt-1 text-caption text-ink-muted">
              {q ? 'Try a different search term' : 'Add your first company to get started'}
            </p>
            {!q && (
              <Link
                href="/dashboard/companies/new"
                className="mt-4 inline-flex items-center gap-2 rounded-token-md border border-gold/30 px-4 py-2 text-caption font-medium text-gold transition-colors hover:bg-gold/5"
              >
                <Plus size={14} />
                Add Company
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
