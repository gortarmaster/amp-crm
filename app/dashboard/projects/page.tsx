import Link from 'next/link'
import { Plus, Search, FolderOpen } from 'lucide-react'
import { requireUser } from '@/lib/supabase/auth'
import { createServerClient } from '@/lib/supabase/server'
import ProjectStatusBadge from '@/components/dashboard/ProjectStatusBadge'
import type { ProjectWithCompany, ProjectStatus } from '@/lib/supabase/database.types'

const STATUS_TABS: { label: string; value: string }[] = [
  { label: 'All', value: '' },
  { label: 'Lead', value: 'lead' },
  { label: 'Booked', value: 'booked' },
  { label: 'Shooting', value: 'shooting' },
  { label: 'Editing', value: 'editing' },
  { label: 'Delivered', value: 'delivered' },
]

interface Props {
  searchParams: Promise<{ q?: string; status?: string }>
}

export default async function ProjectsPage({ searchParams }: Props) {
  const user = await requireUser()
  const { q: rawQ, status: rawStatus } = await searchParams
  const q = rawQ?.trim() ?? ''
  const status = rawStatus?.trim() ?? ''

  let projects: ProjectWithCompany[] = []

  if (user) {
    const supabase = createServerClient()

    let query = supabase
      .from('projects')
      .select('*, companies(id, name)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status as ProjectStatus)
    }

    if (q) {
      query = query.or(`title.ilike.%${q}%,location.ilike.%${q}%,category.ilike.%${q}%`)
    }

    const { data, error } = await query.returns<ProjectWithCompany[]>()
    if (error) throw error
    projects = data ?? []
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

      {/* Status filter tabs */}
      <div className="flex items-center gap-1 border-b border-line px-8 py-0">
        {STATUS_TABS.map((tab) => {
          const isActive = tab.value === status
          const params = new URLSearchParams()
          if (tab.value) params.set('status', tab.value)
          if (q) params.set('q', q)
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
                {['Title', 'Status', 'Company', 'Shoot Date', 'Value'].map((col) => (
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
                    <span className="text-caption text-ink-secondary">
                      {project.companies?.name ?? '—'}
                    </span>
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
