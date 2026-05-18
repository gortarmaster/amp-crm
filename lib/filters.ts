export type FilterOp =
  | 'contains' | 'not_contains'
  | 'eq' | 'neq'
  | 'starts_with'
  | 'empty' | 'not_empty'
  | 'gt' | 'lt'
  | 'before' | 'after'

export type FilterFieldType = 'text' | 'date' | 'number' | 'enum'

export type FilterFieldDef = {
  key: string
  label: string
  type: FilterFieldType
  options?: { value: string; label: string }[]
}

export type FilterRule = {
  id: string
  field: string
  op: FilterOp
  value: string
}

export const CONTACT_FILTER_FIELDS: FilterFieldDef[] = [
  { key: 'first_name', label: 'First Name', type: 'text' },
  { key: 'last_name', label: 'Last Name', type: 'text' },
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'created_at', label: 'Created Date', type: 'date' },
]

export const COMPANY_FILTER_FIELDS: FilterFieldDef[] = [
  { key: 'name', label: 'Company Name', type: 'text' },
  { key: 'industry', label: 'Industry', type: 'text' },
  { key: 'created_at', label: 'Created Date', type: 'date' },
]

export const PROJECT_FILTER_FIELDS: FilterFieldDef[] = [
  { key: 'title', label: 'Title', type: 'text' },
  {
    key: 'status', label: 'Status', type: 'enum', options: [
      { value: 'lead', label: 'Lead' },
      { value: 'booked', label: 'Booked' },
      { value: 'shooting', label: 'Shooting' },
      { value: 'editing', label: 'Editing' },
      { value: 'delivered', label: 'Delivered' },
      { value: 'archived', label: 'Archived' },
    ],
  },
  {
    key: 'category', label: 'Category', type: 'enum', options: [
      { value: 'Wedding', label: 'Wedding' },
      { value: 'Portrait', label: 'Portrait' },
      { value: 'Commercial', label: 'Commercial' },
      { value: 'Events', label: 'Events' },
      { value: 'Family', label: 'Family' },
      { value: 'Boudoir', label: 'Boudoir' },
      { value: 'Editorial', label: 'Editorial' },
      { value: 'Other', label: 'Other' },
    ],
  },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'shoot_date', label: 'Shoot Date', type: 'date' },
  { key: 'deal_value', label: 'Value ($)', type: 'number' },
  { key: 'created_at', label: 'Created Date', type: 'date' },
]

export const OPS_BY_TYPE: Record<FilterFieldType, { value: FilterOp; label: string }[]> = {
  text: [
    { value: 'contains', label: 'contains' },
    { value: 'not_contains', label: 'does not contain' },
    { value: 'eq', label: 'is exactly' },
    { value: 'starts_with', label: 'starts with' },
    { value: 'empty', label: 'is empty' },
    { value: 'not_empty', label: 'is not empty' },
  ],
  date: [
    { value: 'before', label: 'is before' },
    { value: 'after', label: 'is after' },
    { value: 'empty', label: 'is empty' },
    { value: 'not_empty', label: 'is not empty' },
  ],
  number: [
    { value: 'eq', label: 'equals' },
    { value: 'gt', label: 'greater than' },
    { value: 'lt', label: 'less than' },
    { value: 'empty', label: 'is empty' },
    { value: 'not_empty', label: 'is not empty' },
  ],
  enum: [
    { value: 'eq', label: 'is' },
    { value: 'neq', label: 'is not' },
  ],
}

export function encodeFilters(rules: FilterRule[]): string {
  if (rules.length === 0) return ''
  return encodeURIComponent(JSON.stringify(rules))
}

export function decodeFilters(encoded: string | undefined | null): FilterRule[] {
  if (!encoded) return []
  try {
    const parsed = JSON.parse(decodeURIComponent(encoded))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function applyFilters(query: any, rules: FilterRule[]): any {
  for (const { field, op, value } of rules) {
    switch (op) {
      case 'contains':      query = query.ilike(field, `%${value}%`); break
      case 'not_contains':  query = query.not(field, 'ilike', `%${value}%`); break
      case 'eq':            query = query.eq(field, value); break
      case 'neq':           query = query.neq(field, value); break
      case 'starts_with':   query = query.ilike(field, `${value}%`); break
      case 'empty':         query = query.is(field, null); break
      case 'not_empty':     query = query.not(field, 'is', null); break
      case 'gt':            query = query.gt(field, value); break
      case 'lt':            query = query.lt(field, value); break
      case 'before':        query = query.lt(field, value); break
      case 'after':         query = query.gt(field, value); break
    }
  }
  return query
}
