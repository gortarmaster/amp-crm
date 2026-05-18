import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import { requireUser } from '@/lib/supabase/auth'
import { createServerClient } from '@/lib/supabase/server'
import type { Company, SavedView } from '@/lib/supabase/database.types'
import { decodeFilters, applyFilters, COMPANY_FILTER_FIELDS } from '@/lib/filters'
import FilterBar from '@/components/dashboard/FilterBar'
import SavedViewsBar from '@/components/dashboard/SavedViewsBar'
import CompaniesView from './CompaniesView'

type SortCol = 'name' | 'industry' | 'website' | 'added'
type SortDir = 'asc' | 'desc'

const DB_SORT: Record<SortCol, string> = {
  name: 'name', industry: 'industry', website: 'website', added: 'created_at',
}

interface Props {
  searchParams: Promise<{ q?: string; sort?: string; dir?: string; filters?: string; view_id?: string }>
}

export default async function CompaniesPage({ searchParams }: Props) {
  const user = await requireUser()
  const { q: rawQ, sort: rawSort, dir: rawDir, filters: rawFilters, view_id } = await searchParams
  const q = rawQ?.trim() ?? ''
  const sort: SortCol = (['name','industry','website','added'] as SortCol[]).includes(rawSort as SortCol)
    ? (rawSort as SortCol) : 'name'
  const dir: SortDir = rawDir === 'desc' ? 'desc' : 'asc'
  const filterRules = decodeFilters(rawFilters)

  let companies: Company[] = []
  let savedViews: SavedView[] = []

  if (user) {
    const supabase = createServerClient()

    const { data: views } = await supabase
      .from('saved_views')
      .select('*')
      .eq('user_id', user.id)
      .eq('object_type', 'companies')
      .order('created_at')
    savedViews = (views ?? []) as SavedView[]

    let query = supabase
      .from('companies')
      .select('*')
      .eq('user_id', user.id)
      .order(DB_SORT[sort], { ascending: dir === 'asc' })

    if (q) query = query.or(`name.ilike.%${q}%,industry.ilike.%${q}%`)
    query = applyFilters(query, filterRules)

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
            {companies.length} {companies.length === 1 ? 'company' : 'companies'}
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

      {/* Saved views */}
      <SavedViewsBar
        savedViews={savedViews}
        activeViewId={view_id}
        objectType="companies"
        objectPath="/dashboard/companies"
        allLabel="All Companies"
      />

      {/* Search */}
      <div className="border-b border-line px-8 py-4">
        <form>
          {sort !== 'name' && <input type="hidden" name="sort" value={sort} />}
          {dir !== 'asc' && <input type="hidden" name="dir" value={dir} />}
          {rawFilters && <input type="hidden" name="filters" value={rawFilters} />}
          <div className="relative max-w-sm">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Search by name or industry…"
              className="w-full rounded-token-md border border-line bg-bg-card py-2 pl-9 pr-4 text-caption text-ink-primary placeholder:text-ink-muted transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
            />
          </div>
        </form>
      </div>

      {/* Filter bar */}
      <FilterBar fields={COMPANY_FILTER_FIELDS} filtersEncoded={rawFilters ?? ''} />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <CompaniesView companies={companies} q={q} filterCount={filterRules.length} />
      </div>
    </div>
  )
}
