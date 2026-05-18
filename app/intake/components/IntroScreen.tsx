interface Props {
  name?: string
  onStart: () => void
}

export default function IntroScreen({ name, onStart }: Props) {
  const greeting = name ? `Hey ${name},` : 'Hey there,'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
      {/* Logo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-light.svg" alt="AM" className="mb-10 h-10 w-auto opacity-90" />

      <div className="max-w-lg">
        <h1 className="mb-4 text-[2.25rem] font-bold leading-tight tracking-tight text-ink-primary">
          {greeting} let&apos;s map out your workflow.
        </h1>
        <p className="mb-10 text-body text-ink-muted leading-relaxed">
          This short survey helps me understand how you run your business today — your tools,
          your pain points, and what you care about most. Takes about{' '}
          <span className="text-ink-secondary font-medium">5 minutes</span> and everything
          goes straight to me.
        </p>

        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 rounded-token-md bg-gold px-8 py-3.5 text-body font-semibold text-bg-base transition-colors hover:bg-gold-light"
        >
          Get started
          <span aria-hidden>→</span>
        </button>

        <p className="mt-6 text-caption text-ink-muted">
          5 chapters · ~5 minutes · saved as you go
        </p>
      </div>
    </div>
  )
}
