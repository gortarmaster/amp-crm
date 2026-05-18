import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { requireUser } from '@/lib/supabase/auth'
import { createServerClient } from '@/lib/supabase/server'
import type { Company, Contact, Project } from '@/lib/supabase/database.types'
import CompanyDetail from './CompanyDetail'

interface Props {
  params: Promise<{ id: string }>
}

export default async function CompanyPage({ params }: Props) {
  const user = await requireUser()
  const { id } = await params

  if (!user) notFound()

  const supabase = createServerClient()

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!company) notFound()

  const [{ data: contacts }, { data: projects }] = await Promise.all([
    supabase
      .from('contacts')
      .select('id, first_name, last_name, title, email')
      .eq('company_id', id)
      .eq('user_id', user!.id)
      .order('last_name'),
    supabase
      .from('projects')
      .select('id, title, status, shoot_date')
      .eq('company_id', id)
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false }),
  ])

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-line px-8 py-5">
        <Link
          href="/dashboard/companies"
          className="text-ink-muted transition-colors hover:text-ink-primary"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
        </Link>
        <div>
          <h1 className="text-heading text-ink-primary">{(company as Company).name}</h1>
          {(company as Company).industry && (
            <p className="mt-0.5 text-caption text-ink-muted">
              {(company as Company).industry}
            </p>
          )}
        </div>
      </div>

      <CompanyDetail
        company={company as Company}
        contacts={(contacts ?? []) as Pick<Contact, 'id' | 'first_name' | 'last_name' | 'title' | 'email'>[]}
        projects={(projects ?? []) as Pick<Project, 'id' | 'title' | 'status' | 'shoot_date'>[]}
      />
    </div>
  )
}
