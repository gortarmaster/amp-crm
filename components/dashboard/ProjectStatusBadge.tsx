import type { ProjectStatus } from '@/lib/supabase/database.types'

const STATUS_STYLES: Record<ProjectStatus, string> = {
  lead:      'bg-ink-muted/10 text-ink-muted',
  booked:    'bg-gold/10 text-gold',
  shooting:  'bg-amber-900/20 text-amber-400',
  editing:   'bg-blue-900/20 text-blue-400',
  delivered: 'bg-emerald-900/20 text-emerald-400',
  archived:  'bg-bg-hover text-ink-muted',
}

const STATUS_LABELS: Record<ProjectStatus, string> = {
  lead:      'Lead',
  booked:    'Booked',
  shooting:  'Shooting',
  editing:   'Editing',
  delivered: 'Delivered',
  archived:  'Archived',
}

export default function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-caption font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
