import { Building2 } from 'lucide-react'

export default function CompaniesPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <div className="rounded-token-lg border border-line bg-bg-card p-5 text-ink-muted">
        <Building2 size={28} strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-body font-medium text-ink-primary">Companies</p>
        <p className="mt-1 text-caption text-ink-muted">Coming soon</p>
      </div>
    </div>
  )
}
