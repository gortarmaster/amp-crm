'use client'

import { useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { SlidersHorizontal, X } from 'lucide-react'
import {
  type FilterRule, type FilterFieldDef, type FilterOp,
  OPS_BY_TYPE, encodeFilters, decodeFilters,
} from '@/lib/filters'

interface Props {
  fields: FilterFieldDef[]
  filtersEncoded: string
}

export default function FilterBar({ fields, filtersEncoded }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const activeFilters = decodeFilters(filtersEncoded)

  const [adding, setAdding] = useState(false)
  const [newField, setNewField] = useState(fields[0]?.key ?? '')
  const [newOp, setNewOp] = useState<FilterOp>('contains')
  const [newValue, setNewValue] = useState('')

  function navigate(rules: FilterRule[]) {
    const params = new URLSearchParams(searchParams.toString())
    if (rules.length > 0) {
      params.set('filters', encodeFilters(rules))
    } else {
      params.delete('filters')
    }
    params.delete('view_id')
    router.push(`${pathname}?${params.toString()}`)
  }

  function removeFilter(id: string) {
    navigate(activeFilters.filter((r) => r.id !== id))
  }

  function clearAll() { navigate([]) }

  function addFilter() {
    const fieldDef = fields.find((f) => f.key === newField)
    if (!fieldDef) return
    const needsValue = !['empty', 'not_empty'].includes(newOp)
    if (needsValue && !newValue.trim()) return

    navigate([
      ...activeFilters,
      { id: Math.random().toString(36).slice(2), field: newField, op: newOp, value: newValue.trim() },
    ])
    setAdding(false)
    setNewValue('')
    setNewField(fields[0]?.key ?? '')
    setNewOp('contains')
  }

  const fieldDef = fields.find((f) => f.key === newField)
  const availableOps = fieldDef ? OPS_BY_TYPE[fieldDef.type] : []
  const needsValue = !['empty', 'not_empty'].includes(newOp)

  function getFieldLabel(key: string) { return fields.find((f) => f.key === key)?.label ?? key }
  function getOpLabel(op: string) {
    for (const ops of Object.values(OPS_BY_TYPE)) {
      const found = ops.find((o) => o.value === op)
      if (found) return found.label
    }
    return op
  }

  return (
    <div className="border-b border-line px-8 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setAdding((v) => !v)}
          className={`inline-flex items-center gap-1.5 rounded-token-md border px-3 py-1.5 text-caption font-medium transition-colors ${
            activeFilters.length > 0
              ? 'border-gold/40 bg-gold/5 text-gold'
              : 'border-line text-ink-secondary hover:border-gold/30 hover:text-gold'
          }`}
        >
          <SlidersHorizontal size={12} strokeWidth={1.5} />
          {activeFilters.length > 0
            ? `${activeFilters.length} filter${activeFilters.length > 1 ? 's' : ''}`
            : 'Filter'}
        </button>

        {activeFilters.map((rule) => (
          <span
            key={rule.id}
            className="inline-flex items-center gap-1 rounded-full border border-gold/20 bg-gold/5 px-2.5 py-1 text-caption"
          >
            <span className="text-ink-muted">{getFieldLabel(rule.field)}</span>
            <span className="text-ink-secondary">{getOpLabel(rule.op)}</span>
            {rule.value && <span className="font-medium text-ink-primary">"{rule.value}"</span>}
            <button
              onClick={() => removeFilter(rule.id)}
              className="ml-0.5 text-ink-muted transition-colors hover:text-gold"
            >
              <X size={11} />
            </button>
          </span>
        ))}

        {activeFilters.length > 1 && (
          <button onClick={clearAll} className="text-caption text-ink-muted transition-colors hover:text-ink-primary">
            Clear all
          </button>
        )}
      </div>

      {adding && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <select
            value={newField}
            onChange={(e) => {
              setNewField(e.target.value)
              const fd = fields.find((f) => f.key === e.target.value)
              const ops = fd ? OPS_BY_TYPE[fd.type] : []
              setNewOp(ops[0]?.value ?? 'contains')
              setNewValue('')
            }}
            className="rounded-token-md border border-line bg-bg-card px-3 py-1.5 text-caption text-ink-primary focus:border-gold/40 focus:outline-none"
          >
            {fields.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
          </select>

          <select
            value={newOp}
            onChange={(e) => { setNewOp(e.target.value as FilterOp); setNewValue('') }}
            className="rounded-token-md border border-line bg-bg-card px-3 py-1.5 text-caption text-ink-primary focus:border-gold/40 focus:outline-none"
          >
            {availableOps.map((op) => <option key={op.value} value={op.value}>{op.label}</option>)}
          </select>

          {needsValue && (
            fieldDef?.type === 'enum' ? (
              <select
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="rounded-token-md border border-line bg-bg-card px-3 py-1.5 text-caption text-ink-primary focus:border-gold/40 focus:outline-none"
              >
                <option value="">Select…</option>
                {fieldDef.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                type={fieldDef?.type === 'date' ? 'date' : fieldDef?.type === 'number' ? 'number' : 'text'}
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addFilter()}
                placeholder="Value…"
                autoFocus
                className="rounded-token-md border border-line bg-bg-card px-3 py-1.5 text-caption text-ink-primary placeholder:text-ink-muted focus:border-gold/40 focus:outline-none"
              />
            )
          )}

          <button
            onClick={addFilter}
            className="rounded-token-md bg-gold px-3 py-1.5 text-caption font-semibold text-bg-base transition-colors hover:bg-gold-light"
          >
            Apply
          </button>
          <button
            onClick={() => { setAdding(false); setNewValue('') }}
            className="text-caption text-ink-muted transition-colors hover:text-ink-primary"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
