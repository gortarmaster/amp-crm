export default function SuccessScreen({ name }: { name?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-light.svg" alt="AM" className="mb-10 h-10 w-auto opacity-80" />

      <div className="max-w-md">
        <div className="mb-6 text-5xl">🎉</div>
        <h1 className="mb-4 text-[2rem] font-bold tracking-tight text-ink-primary">
          {name ? `Thanks, ${name.split(' ')[0]}.` : "You’re all set."}
        </h1>
        <p className="mb-4 text-body text-ink-muted leading-relaxed">
          I've got your answers and I'll be in touch soon. We're going to build something that
          actually fits the way you work.
        </p>
        <p className="text-caption text-ink-muted">
          &mdash; Aaron
        </p>
      </div>
    </div>
  )
}
