'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/supabase/auth'
import type { ContactInsert, ContactUpdate } from '@/lib/supabase/database.types'

async function requireUser() {
  const user = await getUser()
  if (!user) redirect('/login')
  return user
}

export async function createContact(formData: FormData) {
  const user = await requireUser()
  const supabase = createServerClient()

  const insert: ContactInsert = {
    user_id: user.id,
    first_name: String(formData.get('first_name') ?? '').trim(),
    last_name: String(formData.get('last_name') ?? '').trim(),
    email: String(formData.get('email') ?? '').trim() || null,
    phone: String(formData.get('phone') ?? '').trim() || null,
    title: String(formData.get('title') ?? '').trim() || null,
    company_id: String(formData.get('company_id') ?? '').trim() || null,
    notes: String(formData.get('notes') ?? '').trim() || null,
    tags: [],
  }

  const { data, error } = await supabase
    .from('contacts')
    .insert(insert)
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/contacts')
  redirect(`/dashboard/contacts/${data.id}`)
}

export async function updateContact(id: string, formData: FormData) {
  const user = await requireUser()
  const supabase = createServerClient()

  const update: ContactUpdate = {
    first_name: String(formData.get('first_name') ?? '').trim(),
    last_name: String(formData.get('last_name') ?? '').trim(),
    email: String(formData.get('email') ?? '').trim() || null,
    phone: String(formData.get('phone') ?? '').trim() || null,
    title: String(formData.get('title') ?? '').trim() || null,
    company_id: String(formData.get('company_id') ?? '').trim() || null,
    notes: String(formData.get('notes') ?? '').trim() || null,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('contacts')
    .update(update)
    .eq('id', id)
    .eq('user_id', user.id) // ownership guard

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/contacts')
  revalidatePath(`/dashboard/contacts/${id}`)
  redirect(`/dashboard/contacts/${id}`)
}

export async function deleteContact(id: string) {
  const user = await requireUser()
  const supabase = createServerClient()

  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id) // ownership guard

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/contacts')
  redirect('/dashboard/contacts')
}
