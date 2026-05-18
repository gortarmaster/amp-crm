import Link from 'next/link'
import { Plus, Search, FolderOpen, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { requireUser } from '@/lib/supabase/auth'
import { createServerClient } from '@/lib/supabase/server'
import ProjectStatusBadge from '@/components/dashboard/ProjectStatusBadge'
import type { ProjectWithCompany, ProjectStatus } from '@/lib/supabase/database.types'

type SortCol = 'title' | 'status' | 'company' | 'shoot_date' | 'value'
type SortDir = 'asc' | 'desc'

const STATUS_ORDER: Record<ProjectStatus, number> = {
  lead: 0, booked: 1, shooting: 2, editing: 3, delivered: 4, archived: 5,
}

const DB_SORT: Partial<Record<SortCol, string>> = {
  title: 'title',
  shoot_date: 'shoot_date',
  value: 'deal_value',
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
  searchParams: Promise<{ q?: string; status?: string; sort?: string; dir?: string }>
}

export default async function ProjectsPage({ searchParams }: Props) {
  const user = await requireUser()
  const { q: rawQ, status: rawStatus, sort: rawSort, dir: rawDir } = await searchParams
  const q = rawQ?.trim() ?? ''
  const status = rawStatus?.trim() ?? ''
  const sort: SortCol = (['title', 'status', 'company', 'shoot_date', 'value'] as SortCol[]).includes(rawSort as SortCol)
    ? (rawSort as SortCol)
    : 'shoot_date'
  const dir: SortDir = rawDir === 'asc' ? 'asc' : 'desc'

  let projects: ProjectWithCompany[] = []

  if (user) {
    const supabase = createServerClient()

    let query = supabase
      .from('projects')
      .select('*, companies(id, name)')
      .eq('user_id', user.id)

    if (status) query = query.eq('status', status as ProjectStatus)
    if (q) query = query.or(`title.ilike.%${q}%,location.ilike.%${q}%,category.ilike.%${q}%`)

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

  function headerLink(col: SortCol) {
    const active = sort === col
    const nextDir = active && dir === 'desc' ? 'asc' : 'desc'
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (status) params.set('status', status)
    params.set('sort', col)
    params.set('dir', nextDir)
    return `/dashboard/projects?${params.toString()}`
  }

  function SortIcon({ col }: { col: SortCol }) {
    if (sort !== col) return <ChevronsUpDown size={12} className="ml-1 inline text-ink-muted/40" />
    return dir === 'asc'
      ? <ChevronUp size={12} className="ml-1 inline text-gold" />
      : <ChevronDown size={12} className="ml-1 inline text-gold" />
  }

  const COLS: { label: string; col: SortCol }[] = [
    { label: 'Title', col: 'title' },
    { label: 'Status', col: 'status' },
    { label: 'Company', col: 'company' },
    { label: 'Shoot Date', col: 'shoot_date' },
    { label: 'Value', col: 'value' },
  ]

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

      {/* Status filter tabs */}
      <div className="flex items-center gap-1 border-b border-line px-8 py-0">
        {STATUS_TABS.map((tab) => {
          const isActive = tab.value === status
          const params = new URLSearchParams()
          if (tab.value) params.set('status', tab.value)
          if (q) params.set('q', q)
          if (sort !== 'shoot_date') params.set('sort', sort)
          if (dir !== 'desc') params.set('dir', dir)
          const href = `/dashboard/projects${params.size > 0 ? `?${params}` : ''}`
          return (
            <Link
              key={tab.value}
              href={href}
              className={`-mb-px border-b-2 px-3 py-3 text-caption font-medium transition-colors ${
                isActive
                  ? 'border-gold text-gold'
                  : 'border-transparent text-ink-muted hover:text-ink-secondary'
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
          <div className="relative max-w-sm">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
            />
            <input
              name="q"
              defaultValue={q}
              placeholder="Search by title, location, or category…"
              className="w-full rounded-token-md border border-line bg-bg-card py-2 pl-9 pr-4 text-caption text-ink-primary placeholder:text-ink-muted transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
            />
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto px-8 py-4">
        {projects.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-line">
                {COLS.map(({ label, col }) => (
                  <th key={col} className="pb-3 text-left text-caption font-medium text-ink-muted">
                    <Link
                      href={headerLink(col)}
                      className="inline-flex items-center transition-colors hover:text-ink-primary"
                    >
                      {label}
                      <SortIcon col={col} />
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line/50">
              {projects.map((project) => (
                <tr key={project.id} className="group transition-colors hover:bg-bg-hover/40">
                  <td className="py-3 pr-4">
                    <Link
                      href={`/dashboard/projects/${project.id}`}
                      className="text-caption font-medium text-ink-primary transition-colors hover:text-gold"
                    >
                      {project.title}
                    </Link>
                    {project.location && (
                      <p className="mt-0.5 text-ink-muted" style={{ fontSize: '11px' }}>
                        {project.location}
                      </p>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <ProjectStatusBadge status={project.status} />
                  </td>
                  <td className="py-3 pr-4">
                    {project.companies ? (
                      <Link
                        href={`/dashboard/companies/${project.company_id}`}
                        className="text-caption text-ink-secondary transition-colors hover:text-gold"
                      >
                        {project.companies.name}
                      </Link>
                    ) : (
                      <span className="text-caption text-ink-secondary">—</span>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-caption text-ink-secondary">
                      {project.shoot_date
                        ? new Date(project.shoot_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            timeZone: 'UTC',
                          })
                        : '—'}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="text-caption text-ink-secondary">
                      {project.deal_value != null
                        ? `$${project.deal_value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
                        : '—'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 rounded-token-lg border border-line bg-bg-card p-4 text-ink-muted">
              <FolderOpen size={24} strokeWidth={1.5} />
            </div>
            <p className="text-body font-medium text-ink-primary">
              {q ? 'No projects match your search' : 'No projects yet'}
            </p>
            <p className="mt-1 text-caption text-ink-muted">
              {q
                ? 'Try a different search term'
                : 'Create your first project to get started'}
            </p>
            {!q && (
              <Link
                href="/dashboard/projects/new"
                className="mt-4 inline-flex items-center gap-2 rounded-token-md border border-gold/30 px-4 py-2 text-caption font-medium text-gold transition-colors hover:bg-gold/5"
              >
                <Plus size={14} />
                New Project
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
