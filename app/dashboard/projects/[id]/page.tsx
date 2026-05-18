import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { requireUser } from '@/lib/supabase/auth'
import { createServerClient } from '@/lib/supabase/server'
import ProjectStatusBadge from '@/components/dashboard/ProjectStatusBadge'
import ProjectDetail from './ProjectDetail'
import type { ProjectWithDetails } from '@/lib/supabase/database.types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: Props) {
  const user = await requireUser()
  const { id } = await params

  if (!user) notFound()

  const supabase = createServerClient()

  const { data: project } = await supabase
    .from('projects')
    .select('*, companies(id, name), project_contacts(contact_id, role, contacts(id, first_name, last_name, email))')
    .eq('id', id)
    .eq('user_id', user!.id)
    .single()

  if (!project) notFound()

  const [{ data: companies }, { data: allContacts }] = await Promise.all([
    supabase.from('companies').select('id, name').eq('user_id', user!.id).order('name'),
    supabase
      .from('contacts')
      .select('id, first_name, last_name')
      .eq('user_id', user!.id)
      .order('first_name'),
  ])

  const typedProject = project as unknown as ProjectWithDetails

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-line px-8 py-5">
        <Link
          href="/dashboard/projects"
          className="text-ink-muted transition-colors hover:text-ink-primary"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
        </Link>
        <div className="flex flex-1 items-center gap-3">
          <div>
            <h1 className="text-heading text-ink-primary">{typedProject.title}</h1>
            {typedProject.location && (
              <p className="mt-0.5 text-caption text-ink-muted">{typedProject.location}</p>
            )}
          </div>
          <ProjectStatusBadge status={typedProject.status} />
        </div>
      </div>

      <ProjectDetail
        project={typedProject}
        companies={companies ?? []}
        allContacts={allContacts ?? []}
      />
    </div>
  )
}
