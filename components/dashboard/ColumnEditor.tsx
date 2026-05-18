'use client'

import { useState, useEffect, useRef } from 'react'
import { Columns3, X } from 'lucide-react'

export type ColumnDef = {
  key: string
  label: string
  required?: boolean
}

interface Props {
  storageKey: string
  columns: ColumnDef[]
  defaultVisible: string[]
  onChange: (visible: string[]) => void
}

export default function ColumnEditor({ storageKey, columns, defaultVisible, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState<string[]>(defaultVisible)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as string[]
        setVisible(parsed)
        onChange(parsed)
      } catch { /* ignore */ }
    } else {
      onChange(defaultVisible)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  function toggle(key: string) {
    const next = visible.includes(key)
      ? visible.filter((k) => k !== key)
      : [...visible, key]
    setVisible(next)
    onChange(next)
    localStorage.setItem(storageKey, JSON.stringify(next))
  }

  function reset() {
    setVisible(defaultVisible)
    onChange(defaultVisible)
    localStorage.removeItem(storageKey)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-token-md border border-line px-3 py-1.5 text-caption font-medium text-ink-secondary transition-colors hover:border-gold/30 hover:text-gold"
      >
        <Columns3 size={13} strokeWidth={1.5} />
        Edit columns
      </button>

      {open && (
        <div className="absolute right-0 top-full z-30 mt-1.5 w-52 rounded-token-lg border border-line bg-bg-card shadow-2xl">
          <div className="flex items-center justify-between border-b border-line px-3 py-2.5">
            <span className="text-caption font-semibold text-ink-secondary">Columns</span>
            <div className="flex items-center gap-2">
              <button onClick={reset} className="text-caption text-ink-muted transition-colors hover:text-gold" style={{ fontSize: '11px' }}>
                Reset
              </button>
              <button onClick={() => setOpen(false)} className="text-ink-muted transition-colors hover:text-ink-primary">
                <X size={13} />
              </button>
            </div>
          </div>
          <div className="p-1.5">
            {columns.map((col) => (
              <label
                key={col.key}
                className={`flex cursor-pointer items-center gap-2.5 rounded-token-md px-2.5 py-2 transition-colors hover:bg-bg-hover ${col.required ? 'cursor-default opacity-50' : ''}`}
              >
                <div
                  className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors ${
                    visible.includes(col.key) ? 'border-gold bg-gold' : 'border-line bg-transparent'
                  }`}
                >
                  {visible.includes(col.key) && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.5 6L8 1" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <input
                  type="checkbox"
                  checked={visible.includes(col.key)}
                  disabled={col.required}
                  onChange={() => !col.required && toggle(col.key)}
                  className="sr-only"
                />
                <span className="text-caption text-ink-primary">{col.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
