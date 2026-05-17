import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabase/auth'
import { createServerClient } from '@/lib/supabase/server'
import Sidebar from '@/components/dashboard/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()
  if (!user) redirect('/login')

  const supabase = createServerClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url, email')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      <Sidebar
        userEmail={profile?.email ?? user.email ?? ''}
        userName={profile?.full_name ?? null}
        userAvatar={profile?.avatar_url ?? null}
      />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
