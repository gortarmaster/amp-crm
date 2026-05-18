'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, Building2, FolderOpen, Mail, FileText } from 'lucide-react'
import SignOutButton from './SignOutButton'

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

export default function Sidebar({ userEmail, userName, userAvatar }: Props) {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-56 flex-shrink-0 flex-col border-r border-line bg-bg-subtle">
      {/* Wordmark */}
      <div className="flex h-14 items-center border-b border-line px-5">
        <span className="text-caption font-semibold tracking-[0.15em] uppercase text-gold">
          amp-crm
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 rounded-token-md px-3 py-2.5 transition-colors ${
                    isActive
                      ? 'bg-gold/10 text-gold'
                      : 'text-ink-secondary hover:bg-bg-hover hover:text-ink-primary'
                  }`}
                >
                  <Icon
                    size={15}
                    strokeWidth={isActive ? 2 : 1.5}
                    className={isActive ? 'text-gold' : 'text-ink-muted'}
                  />
                  <span className="text-caption font-medium">{label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User footer */}
      <div className="border-t border-line p-3">
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          {/* Avatar */}
          <div className="h-7 w-7 flex-shrink-0 overflow-hidden rounded-full border border-line bg-bg-hover">
            {userAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={userAvatar} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-caption font-medium text-ink-muted">
                {(userName ?? userEmail).charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          {/* Name / email */}
          <div className="min-w-0 flex-1">
            {userName && (
              <p className="truncate text-caption font-medium leading-none text-ink-primary mb-0.5">
                {userName.split(' ')[0]}
              </p>
            )}
            <p
              className="truncate leading-none text-ink-muted"
              style={{ fontSize: '11px' }}
            >
              {userEmail}
            </p>
          </div>
        </div>
        <SignOutButton />
      </div>
    </aside>
  )
}
