'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/supabase/auth'
import type { CompanyInsert, CompanyUpdate } from '@/lib/supabase/database.types'

export async function createCompany(formData: FormData) {
  const user = await requireUser()
  if (!user) redirect('/login')

  const supabase = createServerClient()

  const insert: CompanyInsert = {
    user_id: user.id,
    name: String(formData.get('name') ?? '').trim(),
    website: String(formData.get('website') ?? '').trim() || null,
    industry: String(formData.get('industry') ?? '').trim() || null,
    notes: String(formData.get('notes') ?? '').trim() || null,
  }

  const { data, error } = await supabase
    .from('companies')
    .insert(insert)
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/companies')
  redirect(`/dashboard/companies/${data.id}`)
}

export async function updateCompany(id: string, formData: FormData) {
  const user = await requireUser()
  if (!user) redirect('/login')

  const supabase = createServerClient()

  const update: CompanyUpdate = {
    name: String(formData.get('name') ?? '').trim(),
    website: String(formData.get('website') ?? '').trim() || null,
    industry: String(formData.get('industry') ?? '').trim() || null,
    notes: String(formData.get('notes') ?? '').trim() || null,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('companies')
    .update(update)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/companies')
  revalidatePath(`/dashboard/companies/${id}`)
  redirect(`/dashboard/companies/${id}`)
}

export async function deleteCompany(id: string) {
  const user = await requireUser()
  if (!user) redirect('/login')

  const supabase = createServerClient()

  const { error } = await supabase
    .from('companies')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/companies')
  redirect('/dashboard/companies')
}
