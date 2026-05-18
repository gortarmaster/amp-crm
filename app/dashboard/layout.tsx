import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabase/auth'
import { createServerClient } from '@/lib/supabase/server'
import Sidebar from '@/components/dashboard/Sidebar'
import MobileNav from '@/components/dashboard/MobileNav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isProduction = process.env.VERCEL_ENV === 'production'

  let userEmail = 'preview@amp-crm'
  let userName: string | null = 'Preview'
  let userAvatar: string | null = null

  if (isProduction) {
    const user = await getUser()
    if (!user) redirect('/login')

    const supabase = createServerClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, avatar_url, email')
      .eq('id', user.id)
      .single()

    userEmail = profile?.email ?? user.email ?? ''
    userName = profile?.full_name ?? null
    userAvatar = profile?.avatar_url ?? null
  }

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar userEmail={userEmail} userName={userName} userAvatar={userAvatar} />
      </div>

      {/* Right side: mobile top bar + main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <MobileNav userEmail={userEmail} userName={userName} userAvatar={userAvatar} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
