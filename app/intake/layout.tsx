import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Client Intake — AM Photography',
  description: 'Tell us about your workflow so we can build something that actually fits.',
}

export default function IntakeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-base text-ink-primary">
      {children}
    </div>
  )
}
