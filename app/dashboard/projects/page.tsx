import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import { requireUser } from '@/lib/supabase/auth'
import { createServerClient } from '@/lib/supabase/server'
import type { ProjectWithCompany, ProjectStatus, SavedView } from '@/lib/supabase/database.types'
import { decodeFilters, applyFilters, PROJECT_FILTER_FIELDS } from '@/lib/filters'
import FilterBar from '@/components/dashboard/FilterBar'
import SavedViewsBar from '@/components/dashboard/SavedViewsBar'
import ProjectsView from './ProjectsView'

type SortCol = 'title' | 'status' | 'company' | 'shoot_date' | 'delivery_date' | 'value' | 'category' | 'location'
type SortDir = 'asc' | 'desc'

const STATUS_ORDER: Record<ProjectStatus, number> = {
  lead: 0, booked: 1, shooting: 2, editing: 3, delivered: 4, archived: 5,
}

const DB_SORT: Partial<Record<SortCol, string>> = {
  title: 'title', shoot_date: 'shoot_date', delivery_date: 'delivery_date',
  value: 'deal_value', category: 'category', location: 'location',
}

const STATUS_TABS: { label: string; value: string }[] = [
  { label: 'All', value: '' },
  { label: 'Lead', value: 'lead' },
  { label: 'Booked', value: 'booked' },
  { label: 'Shooting', value: 'shooting' },
  { label: 'Editing', value: 'editing' },
  { label: 'Delivered', value: 'delivered' },
]

interface Props {
  searchParams: Promise<{ q?: string; status?: string; sort?: string; dir?: string; filters?: string; view_id?: string }>
}

export default async function ProjectsPage({ searchParams }: Props) {
  const user = await requireUser()
  const { q: rawQ, status: rawStatus, sort: rawSort, dir: rawDir, filters: rawFilters, view_id } = await searchParams
  const q = rawQ?.trim() ?? ''
  const status = rawStatus?.trim() ?? ''
  const sort: SortCol = (['title','status','company','shoot_date','delivery_date','value','category','location'] as SortCol[]).includes(rawSort as SortCol)
    ? (rawSort as SortCol) : 'shoot_date'
  const dir: SortDir = rawDir === 'asc' ? 'asc' : 'desc'
  const filterRules = decodeFilters(rawFilters)

  let projects: ProjectWithCompany[] = []
  let savedViews: SavedView[] = []

  if (user) {
    const supabase = createServerClient()

    const { data: views } = await supabase
      .from('saved_views')
      .select('*')
      .eq('user_id', user.id)
      .eq('object_type', 'projects')
      .order('created_at')
    savedViews = (views ?? []) as SavedView[]

    let query = supabase
      .from('projects')
      .select('*, companies(id, name)')
      .eq('user_id', user.id)

    if (status) query = query.eq('status', status as ProjectStatus)
    if (q) query = query.or(`title.ilike.%${q}%,location.ilike.%${q}%,category.ilike.%${q}%`)
    query = applyFilters(query, filterRules)

    const dbCol = DB_SORT[sort]
    if (dbCol) {
      query = query.order(dbCol, { ascending: dir === 'asc', nullsFirst: false })
      if (dbCol !== 'title') query = query.order('title', { ascending: true })
    } else {
      query = query.order('shoot_date', { ascending: false, nullsFirst: false })
    }

    const { data, error } = await query.returns<ProjectWithCompany[]>()
    if (error) throw error
    const rows = data ?? []

    if (sort === 'status') {
      projects = rows.sort((a, b) => {
        const diff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
        return dir === 'asc' ? diff : -diff
      })
    } else if (sort === 'company') {
      projects = rows.sort((a, b) => {
        const an = a.companies?.name ?? ''
        const bn = b.companies?.name ?? ''
        return dir === 'asc' ? an.localeCompare(bn) : bn.localeCompare(an)
      })
    } else {
      projects = rows
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line px-8 py-5">
        <div>
          <h1 className="text-heading text-ink-primary">Projects</h1>
          <p className="mt-0.5 text-caption text-ink-muted">
            {projects.length} {projects.length === 1 ? 'project' : 'projects'}
            {status ? ` · ${status}` : ''}
          </p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="inline-flex items-center gap-2 rounded-token-md bg-gold px-4 py-2 text-caption font-semibold text-bg-base transition-colors hover:bg-gold-light"
        >
          <Plus size={14} />
          New Project
        </Link>
      </div>

      {/* Saved views */}
      <SavedViewsBar
        savedViews={savedViews}
        activeViewId={view_id}
        objectType="projects"
        objectPath="/dashboard/projects"
        allLabel="All Projects"
      />

      {/* Status filter tabs */}
      <div className="flex items-center gap-1 border-b border-line px-8 py-0">
        {STATUS_TABS.map((tab) => {
          const isActive = tab.value === status
          const params = new URLSearchParams()
          if (tab.value) params.set('status', tab.value)
          if (q) params.set('q', q)
          if (sort !== 'shoot_date') params.set('sort', sort)
          if (dir !== 'desc') params.set('dir', dir)
          if (rawFilters) params.set('filters', rawFilters)
          const href = `/dashboard/projects${params.size > 0 ? `?${params}` : ''}`
          return (
            <Link
              key={tab.value}
              href={href}
              className={`-mb-px border-b-2 px-3 py-3 text-caption font-medium transition-colors ${
                isActive ? 'border-gold text-gold' : 'border-transparent text-ink-muted hover:text-ink-secondary'
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>

      {/* Search */}
      <div className="border-b border-line px-8 py-4">
        <form>
          {status && <input type="hidden" name="status" value={status} />}
          {sort !== 'shoot_date' && <input type="hidden" name="sort" value={sort} />}
          {dir !== 'desc' && <input type="hidden" name="dir" value={dir} />}
          {rawFilters && <input type="hidden" name="filters" value={rawFilters} />}
          <div className="relative max-w-sm">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Search by title, location, or category…"
              className="w-full rounded-token-md border border-line bg-bg-card py-2 pl-9 pr-4 text-caption text-ink-primary placeholder:text-ink-muted transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
            />
          </div>
        </form>
      </div>

      {/* Filter bar */}
      <FilterBar fields={PROJECT_FILTER_FIELDS} filtersEncoded={rawFilters ?? ''} />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <ProjectsView projects={projects} q={q} filterCount={filterRules.length} />
      </div>
    </div>
  )
}
