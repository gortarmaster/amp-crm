import { requireUser } from '@/lib/supabase/auth'
import { createServerClient } from '@/lib/supabase/server'
import SendInviteButton from './SendInviteButton'

export const dynamic = 'force-dynamic'

type InviteEvent = {
  id: string
  event_type: 'sent' | 'opened' | 'clicked'
  occurred_at: string
  user_agent: string | null
  ip: string | null
}

function fmt(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric',
    minute: '2-digit', hour12: true,
  })
}

const EVENT_STYLE: Record<string, { dot: string; label: string }> = {
  sent:    { dot: 'bg-ink-muted',          label: 'Sent' },
  opened:  { dot: 'bg-blue-400',           label: 'Opened' },
  clicked: { dot: 'bg-gold',               label: 'Clicked link' },
}

export default async function InvitePage() {
  await requireUser()
  const supabase = createServerClient()

  const { data: events } = await supabase
    .from('invite_events')
    .select('*')
    .order('occurred_at', { ascending: false })

  const rows = (events ?? []) as InviteEvent[]

  const sentCount    = rows.filter(e => e.event_type === 'sent').length
  const openCount    = rows.filter(e => e.event_type === 'opened').length
  const clickCount   = rows.filter(e => e.event_type === 'clicked').length
  const lastSent     = rows.find(e => e.event_type === 'sent')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submitted = await (supabase as any)
    .from('intake_submissions')
    .select('id, submitted_at')
    .not('submitted_at', 'is', null)

  const isSubmitted = ((submitted.data as unknown[])?.length ?? 0) > 0

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line px-8 py-5">
        <div>
          <h1 className="text-heading text-ink-primary">Andres Invite</h1>
          <p className="mt-0.5 text-caption text-ink-muted">
            {lastSent
              ? `Last sent ${fmt(lastSent.occurred_at)}`
              : 'Not sent yet'}
          </p>
        </div>
        <SendInviteButton disabled={isSubmitted} />
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        {/* Status banner if submitted */}
        {isSubmitted && (
          <div className="mb-6 flex items-center gap-3 rounded-token-md border border-gold/20 bg-gold/5 px-4 py-3">
            <span className="text-gold">✓</span>
            <p className="text-caption text-ink-secondary">
              Andres has submitted the survey.
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          {[
            { label: 'Times sent', value: sentCount },
            { label: 'Opens', value: openCount, hint: 'requires image loading' },
            { label: 'Link clicks', value: clickCount },
          ].map(({ label, value, hint }) => (
            <div key={label} className="rounded-token-lg border border-line bg-bg-card p-5">
              <p className="mb-1 text-[2rem] font-bold leading-none text-ink-primary">{value}</p>
              <p className="text-caption text-ink-secondary">{label}</p>
              {hint && <p className="mt-0.5 text-[11px] text-ink-muted">{hint}</p>}
            </div>
          ))}
        </div>

        {/* Event log */}
        <h2 className="mb-3 text-caption font-semibold text-ink-primary">Event log</h2>
        {rows.length === 0 ? (
          <p className="text-caption text-ink-muted">No events yet. Send the invite to get started.</p>
        ) : (
          <div className="rounded-token-lg border border-line bg-bg-card">
            {rows.map((e, i) => {
              const style = EVENT_STYLE[e.event_type] ?? EVENT_STYLE.sent
              return (
                <div
                  key={e.id}
                  className={`flex items-start gap-4 px-5 py-3.5 ${i < rows.length - 1 ? 'border-b border-line' : ''}`}
                >
                  <div className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${style.dot}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-caption text-ink-primary">{style.label}</p>
                    {e.user_agent && (
                      <p className="mt-0.5 truncate text-[11px] text-ink-muted">{e.user_agent}</p>
                    )}
                  </div>
                  <span className="flex-shrink-0 text-[11px] text-ink-muted">{fmt(e.occurred_at)}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
