import { redirect } from 'next/navigation'
import { Mail } from 'lucide-react'
import { getUser } from '@/lib/supabase/auth'

export default async function SequencesPage() {
  const user = await getUser()
  if (!user) redirect('/login')

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <div className="rounded-token-lg border border-line bg-bg-card p-5 text-ink-muted">
        <Mail size={28} strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-body font-medium text-ink-primary">Sequences</p>
        <p className="mt-1 text-caption text-ink-muted">Coming soon</p>
      </div>
    </div>
  )
}
