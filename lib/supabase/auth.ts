import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Database } from './database.types'

/**
 * Read the current authenticated user from the session cookie.
 * Use in Server Components and Server Actions to identify who is making a request.
 * Returns null if unauthenticated.
 */
export async function getUser() {
  const cookieStore = await cookies()

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from a Server Component — cookies are read-only here, ignore
          }
        },
      },
    }
  )

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

/**
 * Like getUser(), but also redirects to /login if unauthenticated.
 * On non-production deployments (preview / local), skips auth entirely and returns null.
 * Pages should skip data-fetching when the return value is null.
 */
export async function requireUser() {
  if (process.env.VERCEL_ENV !== 'production') return null
  const user = await getUser()
  if (!user) redirect('/login')
  return user
}
