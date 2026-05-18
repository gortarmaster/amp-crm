'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Users, Building2, FolderOpen, Mail, FileText, LogOut } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase/client'

const NAV_ITEMS = [
  { href: '/dashboard/contacts', label: 'Contacts', icon: Users },
  { href: '/dashboard/companies', label: 'Companies', icon: Building2 },
  { href: '/dashboard/projects', label: 'Projects', icon: FolderOpen },
  { href: '/dashboard/sequences', label: 'Sequences', icon: Mail },
  { href: '/dashboard/templates', label: 'Templates', icon: FileText },
]

interface Props {
  userEmail: string
  userName: string | null
  userAvatar: string | null
}

export default function MobileNav({ userEmail, userName, userAvatar }: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  async function handleSignOut() {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <>
      {/* Top bar — mobile only */}
      <header className="flex items-center justify-between border-b border-line bg-bg-subtle px-5 py-4 md:hidden">
        <span className="text-caption font-semibold tracking-[0.15em] uppercase text-gold">
          amp-crm
        </span>

        {/* Hamburger / close button */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="relative flex h-8 w-8 flex-col items-center justify-center gap-[5px] focus:outline-none"
        >
          <span
            className={`block h-px w-5 bg-ink-primary transition-all duration-300 ease-in-out ${
              open ? 'translate-y-[6px] rotate-45' : ''
            }`}
          />
          <span
            className={`block h-px w-5 bg-ink-primary transition-all duration-300 ease-in-out ${
              open ? 'opacity-0 scale-x-0' : ''
            }`}
          />
          <span
            className={`block h-px w-5 bg-ink-primary transition-all duration-300 ease-in-out ${
              open ? '-translate-y-[6px] -rotate-45' : ''
            }`}
          />
        </button>
      </header>

      {/* Full-screen overlay */}
      <div
        className={`fixed inset-0 z-50 flex flex-col bg-bg-base transition-all duration-500 ease-in-out md:hidden ${
          open
            ? 'opacity-100 [clip-path:inset(0_0_0_0)]'
            : 'opacity-0 pointer-events-none [clip-path:inset(0_0_100%_0)]'
        }`}
      >
        {/* Overlay top bar */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <span className="text-caption font-semibold tracking-[0.15em] uppercase text-gold">
            amp-crm
          </span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="relative flex h-8 w-8 flex-col items-center justify-center gap-[5px] focus:outline-none"
          >
            <span className="block h-px w-5 bg-ink-primary translate-y-[6px] rotate-45 transition-all duration-300" />
            <span className="block h-px w-5 bg-ink-primary opacity-0 scale-x-0 transition-all duration-300" />
            <span className="block h-px w-5 bg-ink-primary -translate-y-[6px] -rotate-45 transition-all duration-300" />
          </button>
        </div>

        {/* Nav items — staggered */}
        <nav className="flex flex-1 flex-col justify-center px-8">
          <ul className="space-y-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }, i) => {
              const isActive = pathname.startsWith(href)
              return (
                <li
                  key={href}
                  className={`transition-all duration-500 ease-out ${
                    open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                  }`}
                  style={{ transitionDelay: open ? `${i * 55 + 120}ms` : '0ms' }}
                >
                  <Link
                    href={href}
                    className={`flex items-center gap-4 rounded-token-lg px-4 py-4 text-body font-medium transition-colors ${
                      isActive
                        ? 'text-gold'
                        : 'text-ink-secondary hover:text-ink-primary'
                    }`}
                  >
                    <Icon
                      size={20}
                      strokeWidth={isActive ? 2 : 1.5}
                      className={isActive ? 'text-gold' : 'text-ink-muted'}
                    />
                    {label}
                    {isActive && (
                      <span className="ml-auto h-1 w-1 rounded-full bg-gold" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User footer */}
        <div
          className={`border-t border-line px-8 py-6 transition-all duration-500 ease-out ${
            open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          style={{ transitionDelay: open ? `${NAV_ITEMS.length * 55 + 140}ms` : '0ms' }}
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full border border-line bg-bg-card">
              {userAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={userAvatar} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-caption font-medium text-ink-muted">
                  {(userName ?? userEmail).charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0">
              {userName && (
                <p className="truncate text-caption font-medium text-ink-primary">{userName}</p>
              )}
              <p className="truncate text-caption text-ink-muted">{userEmail}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-token-md px-3 py-2.5 text-caption font-medium text-ink-muted transition-colors hover:bg-bg-card hover:text-ink-primary"
          >
            <LogOut size={15} strokeWidth={1.5} />
            Sign out
          </button>
        </div>
      </div>
    </>
  )
}
