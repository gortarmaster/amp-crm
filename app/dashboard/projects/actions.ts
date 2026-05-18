'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/supabase/auth'
import type { ProjectInsert, ProjectUpdate, ProjectStatus } from '@/lib/supabase/database.types'

async function requireUser() {
  const user = await getUser()
  if (!user) redirect('/login')
  return user
}

function toSlug(title: string): string {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const suffix = Math.random().toString(36).slice(2, 6)
  return `${base}-${suffix}`
}

export async function createProject(formData: FormData) {
  const user = await requireUser()
  const supabase = createServerClient()

  const title = String(formData.get('title') ?? '').trim()
  const rawSlug = String(formData.get('slug') ?? '').trim()
  const slug = rawSlug || toSlug(title)

  const insert: ProjectInsert = {
    user_id: user.id,
    title,
    status: (String(formData.get('status') ?? 'lead').trim() as ProjectStatus) || 'lead',
    company_id: String(formData.get('company_id') ?? '').trim() || null,
    deal_value: parseFloat(String(formData.get('deal_value') ?? '')) || null,
    internal_notes: String(formData.get('internal_notes') ?? '').trim() || null,
    shoot_date: String(formData.get('shoot_date') ?? '').trim() || null,
    delivery_date: String(formData.get('delivery_date') ?? '').trim() || null,
    slug,
    description: String(formData.get('description') ?? '').trim() || null,
    location: String(formData.get('location') ?? '').trim() || null,
    category: String(formData.get('category') ?? '').trim() || null,
    year: parseInt(String(formData.get('year') ?? ''), 10) || null,
    portfolio_visible: false,
    client_gallery_enabled: false,
  }

  const { data, error } = await supabase
    .from('projects')
    .insert(insert)
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  const contactIds = formData.getAll('contact_ids') as string[]
  if (contactIds.length > 0) {
    await supabase.from('project_contacts').insert(
      contactIds.map((contact_id) => ({ project_id: data.id, contact_id }))
    )
  }

  revalidatePath('/dashboard/projects')
  redirect(`/dashboard/projects/${data.id}`)
}

export async function updateProject(id: string, formData: FormData) {
  const user = await requireUser()
  const supabase = createServerClient()

  const update: ProjectUpdate = {
    title: String(formData.get('title') ?? '').trim(),
    status: String(formData.get('status') ?? 'lead').trim() as ProjectStatus,
    company_id: String(formData.get('company_id') ?? '').trim() || null,
    deal_value: parseFloat(String(formData.get('deal_value') ?? '')) || null,
    internal_notes: String(formData.get('internal_notes') ?? '').trim() || null,
    shoot_date: String(formData.get('shoot_date') ?? '').trim() || null,
    delivery_date: String(formData.get('delivery_date') ?? '').trim() || null,
    description: String(formData.get('description') ?? '').trim() || null,
    location: String(formData.get('location') ?? '').trim() || null,
    category: String(formData.get('category') ?? '').trim() || null,
    year: parseInt(String(formData.get('year') ?? ''), 10) || null,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('projects')
    .update(update)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/projects')
  revalidatePath(`/dashboard/projects/${id}`)
  redirect(`/dashboard/projects/${id}`)
}

export async function updateProjectVisibility(
  id: string,
  slug: string,
  field: 'portfolio_visible' | 'client_gallery_enabled',
  value: boolean
) {
  const user = await requireUser()
  const supabase = createServerClient()

  const patch =
    field === 'portfolio_visible'
      ? { portfolio_visible: value, updated_at: new Date().toISOString() }
      : { client_gallery_enabled: value, updated_at: new Date().toISOString() }

  const { error } = await supabase
    .from('projects')
    .update(patch)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath(`/dashboard/projects/${id}`)
  revalidatePath(`/p/${slug}`)
}

export async function deleteProject(id: string) {
  const user = await requireUser()
  const supabase = createServerClient()

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/projects')
  redirect('/dashboard/projects')
}

export async function addProjectContact(projectId: string, contactId: string, role?: string) {
  const user = await requireUser()
  const supabase = createServerClient()

  // Ownership guard: verify project belongs to this user
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single()

  if (!project) throw new Error('Project not found')

  const { error } = await supabase
    .from('project_contacts')
    .insert({ project_id: projectId, contact_id: contactId, role: role || null })

  if (error && error.code !== '23505') throw new Error(error.message) // ignore duplicate key

  revalidatePath(`/dashboard/projects/${projectId}`)
}

export async function removeProjectContact(projectId: string, contactId: string) {
  const user = await requireUser()
  const supabase = createServerClient()

  // Ownership guard via project lookup
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single()

  if (!project) throw new Error('Project not found')

  const { error } = await supabase
    .from('project_contacts')
    .delete()
    .eq('project_id', projectId)
    .eq('contact_id', contactId)

  if (error) throw new Error(error.message)

  revalidatePath(`/dashboard/projects/${projectId}`)
}
