import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

let client: ReturnType<typeof createClient<Database>> | undefined

/**
 * Browser-side Supabase client (anon key).
 * Singleton — safe to call multiple times; only one instance is created.
 * Use only in Client Components for auth state (sign in, sign out, session).
 */
export function createBrowserClient() {
  if (!client) {
    client = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return client
}
