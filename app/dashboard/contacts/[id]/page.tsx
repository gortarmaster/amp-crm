import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { requireUser } from '@/lib/supabase/auth'
import { createServerClient } from '@/lib/supabase/server'
import type { ContactWithCompany } from '@/lib/supabase/database.types'
import ContactDetail from './ContactDetail'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ContactPage({ params }: Props) {
  const user = await requireUser()
  const { id } = await params

  if (!user) notFound()

  const supabase = createServerClient()

  const { data: contact } = await supabase
    .from('contacts')
    .select('*, companies(id, name)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!contact) notFound()

  const { data: companies } = await supabase
    .from('companies')
    .select('id, name')
    .eq('user_id', user.id)
    .order('name')

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-line px-8 py-5">
        <Link
          href="/dashboard/contacts"
          className="text-ink-muted transition-colors hover:text-ink-primary"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
        </Link>
        <div>
          <h1 className="text-heading text-ink-primary">
            {(contact as ContactWithCompany).first_name}{' '}
            {(contact as ContactWithCompany).last_name}
          </h1>
          {(contact as ContactWithCompany).title && (
            <p className="mt-0.5 text-caption text-ink-muted">
              {(contact as ContactWithCompany).title}
            </p>
          )}
        </div>
      </div>

      <ContactDetail
        contact={contact as ContactWithCompany}
        companies={companies ?? []}
      />
    </div>
  )
}
