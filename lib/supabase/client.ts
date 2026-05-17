import { createBrowserClient as createSSRBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'

let client: ReturnType<typeof createSSRBrowserClient<Database>> | undefined

/**
 * Browser-side Supabase client (anon key).
 * Uses @supabase/ssr's createBrowserClient which defaults to PKCE flow —
 * required for the /auth/callback code-exchange route to work.
 * Singleton — safe to call multiple times; only one instance is created.
 * Use only in Client Components for auth state (sign in, sign out, session).
 */
export function createBrowserClient() {
  if (!client) {
    client = createSSRBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return client
}
