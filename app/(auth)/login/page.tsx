import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabase/auth'
import LoginButton from './LoginButton'

interface Props {
  searchParams: Promise<{ error?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const user = await getUser()
  if (user) redirect('/dashboard/contacts')

  const { error } = await searchParams

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg-base px-6">
      <div className="w-full max-w-sm">
        {/* Wordmark */}
        <div className="mb-10 text-center">
          <span className="text-heading font-semibold tracking-[0.15em] uppercase text-gold">
            amp-crm
          </span>
          <p className="mt-2 text-caption text-ink-muted">Sign in to continue</p>
        </div>

        {/* Error */}
        {error === 'unauthorized' && (
          <div className="mb-6 rounded-token-md border border-red-900/40 bg-red-950/20 px-4 py-3">
            <p className="text-caption text-red-400">
              Your account is not authorized to access this app.
            </p>
          </div>
        )}

        {/* Card */}
        <div className="rounded-token-lg border border-line bg-bg-card p-8">
          <h1 className="mb-6 text-center text-heading text-ink-primary">Welcome back</h1>
          <LoginButton />
        </div>

        <p className="mt-8 text-center text-caption text-ink-muted">Private access only.</p>
      </div>
    </main>
  )
}
