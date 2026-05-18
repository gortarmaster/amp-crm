'use server'

import { createServerClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/supabase/auth'
import { revalidatePath } from 'next/cache'

export async function createSavedView(formData: FormData) {
  const user = await requireUser()
  if (!user) return

  const supabase = createServerClient()
  const name = formData.get('name') as string
  const objectType = formData.get('object_type') as string
  const filtersEncoded = formData.get('filters') as string
  const sortCol = (formData.get('sort_col') as string) || null
  const sortDir = (formData.get('sort_dir') as string) || null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let filters: any[] = []
  if (filtersEncoded) {
    try { filters = JSON.parse(decodeURIComponent(filtersEncoded)) } catch { /* empty */ }
  }

  await supabase.from('saved_views').insert({
    user_id: user.id,
    object_type: objectType,
    name: name.trim(),
    filters: filters as import('@/lib/supabase/database.types').Json,
    sort_col: sortCol,
    sort_dir: sortDir,
  })

  revalidatePath(`/dashboard/${objectType}`)
}

export async function deleteSavedView(id: string, objectType: string) {
  const user = await requireUser()
  if (!user) return

  const supabase = createServerClient()
  await supabase.from('saved_views').delete().eq('id', id).eq('user_id', user.id)

  revalidatePath(`/dashboard/${objectType}`)
}
