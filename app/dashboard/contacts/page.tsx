import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import { requireUser } from '@/lib/supabase/auth'
import { createServerClient } from '@/lib/supabase/server'
import type { ContactWithCompany, SavedView } from '@/lib/supabase/database.types'
import { decodeFilters, applyFilters, CONTACT_FILTER_FIELDS } from '@/lib/filters'
import FilterBar from '@/components/dashboard/FilterBar'
import SavedViewsBar from '@/components/dashboard/SavedViewsBar'
import ContactsView from './ContactsView'

type SortCol = 'name' | 'email' | 'company' | 'title' | 'phone' | 'added'
type SortDir = 'asc' | 'desc'

const DB_SORT: Partial<Record<SortCol, string>> = {
  name: 'last_name', email: 'email', title: 'title', phone: 'phone', added: 'created_at',
}

interface Props {
  searchParams: Promise<{ q?: string; sort?: string; dir?: string; filters?: string; view_id?: string }>
}

export default async function ContactsPage({ searchParams }: Props) {
  const user = await requireUser()
  const { q: rawQ, sort: rawSort, dir: rawDir, filters: rawFilters, view_id } = await searchParams
  const q = rawQ?.trim() ?? ''
  const sort: SortCol = (['name','email','company','title','phone','added'] as SortCol[]).includes(rawSort as SortCol)
    ? (rawSort as SortCol) : 'added'
  const dir: SortDir = rawDir === 'asc' ? 'asc' : 'desc'
  const filterRules = decodeFilters(rawFilters)

  let contacts: ContactWithCompany[] = []
  let savedViews: SavedView[] = []

  if (user) {
    const supabase = createServerClient()

    // Fetch saved views
    const { data: views } = await supabase
      .from('saved_views')
      .select('*')
      .eq('user_id', user.id)
      .eq('object_type', 'contacts')
      .order('created_at')
    savedViews = (views ?? []) as SavedView[]

    let query = supabase
      .from('contacts')
      .select('*, companies(id, name)')
      .eq('user_id', user.id)

    if (q) query = query.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%`)
    query = applyFilters(query, filterRules)

    if (sort !== 'company') {
      const col = DB_SORT[sort] ?? 'created_at'
      query = query.order(col, { ascending: dir === 'asc' })
      if (sort === 'name') query = query.order('first_name', { ascending: dir === 'asc' })
    } else {
      query = query.order('last_name', { ascending: true })
    }

    const { data, error } = await query.returns<ContactWithCompany[]>()
    if (error) throw error
    const rows = data ?? []

    contacts = sort === 'company'
      ? rows.sort((a, b) => {
          const an = a.companies?.name ?? ''
          const bn = b.companies?.name ?? ''
          return dir === 'asc' ? an.localeCompare(bn) : bn.localeCompare(an)
        })
      : rows
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line px-8 py-5">
        <div>
          <h1 className="text-heading text-ink-primary">Contacts</h1>
          <p className="mt-0.5 text-caption text-ink-muted">
            {contacts.length} {contacts.length === 1 ? 'contact' : 'contacts'}
          </p>
        </div>
        <Link
          href="/dashboard/contacts/new"
          className="inline-flex items-center gap-2 rounded-token-md bg-gold px-4 py-2 text-caption font-semibold text-bg-base transition-colors hover:bg-gold-light"
        >
          <Plus size={14} />
          Add Contact
        </Link>
      </div>

      {/* Saved views */}
      <SavedViewsBar
        savedViews={savedViews}
        activeViewId={view_id}
        objectType="contacts"
        objectPath="/dashboard/contacts"
        allLabel="All Contacts"
      />

      {/* Search */}
      <div className="border-b border-line px-8 py-4">
        <form>
          {sort !== 'added' && <input type="hidden" name="sort" value={sort} />}
          {dir !== 'desc' && <input type="hidden" name="dir" value={dir} />}
          {rawFilters && <input type="hidden" name="filters" value={rawFilters} />}
          <div className="relative max-w-sm">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Search by name or email…"
              className="w-full rounded-token-md border border-line bg-bg-card py-2 pl-9 pr-4 text-caption text-ink-primary placeholder:text-ink-muted transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
            />
          </div>
        </form>
      </div>

      {/* Filter bar */}
      <FilterBar fields={CONTACT_FILTER_FIELDS} filtersEncoded={rawFilters ?? ''} />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <ContactsView contacts={contacts} q={q} filterCount={filterRules.length} />
      </div>
    </div>
  )
}
