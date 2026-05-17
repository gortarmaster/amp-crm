'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase/client'

export default function SignOutButton() {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex w-full items-center gap-3 rounded-token-md px-3 py-2 text-caption font-medium text-ink-muted transition-colors hover:bg-bg-hover hover:text-ink-primary"
    >
      <LogOut size={14} strokeWidth={1.5} />
      Sign out
    </button>
  )
}
