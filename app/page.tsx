import CTASection from "@/components/CTASection";

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="10" cy="6" r="3.25" />
        <path d="M2.5 17.5c0-4.142 3.358-7.5 7.5-7.5s7.5 3.358 7.5 7.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Contacts",
    description:
      "Every client, lead, and collaborator in one place. Add notes, track history, and never lose context again.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2.5" y="7.5" width="15" height="10" rx="1.5" />
        <path d="M6.5 7.5V5a3.5 3.5 0 0 1 7 0v2.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Companies",
    description:
      "Track the studios, agencies, and architecture firms you work with. See every deal, contact, and interaction at a glance.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="2.5,14.5 7.5,9.5 11.5,12.5 17.5,5.5" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="13.5,5.5 17.5,5.5 17.5,9.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Deals",
    description:
      "From first inquiry to signed contract — every stage, visible. Know exactly where each project stands.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="10" cy="10" r="7.5" />
        <polyline points="10,6 10,10 13,13" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Sequences",
    description:
      "Automated follow-up flows that run while you're on a shoot. Set it once, stay top of mind always.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3.5 4h13a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H7l-4 3V5a1 1 0 0 1 1-1z" strokeLinejoin="round" />
        <path d="M7 8.5h6M7 11.5h4" strokeLinecap="round" />
      </svg>
    ),
    title: "Message Templates",
    description: (
      <>
        Write once. Personalize with tokens. Send everywhere.{" "}
        <span className="font-mono text-xs text-gold/80">
          {"{{first_name}}"}
        </span>
        {", "}
        <span className="font-mono text-xs text-gold/80">
          {"{{project_type}}"}
        </span>
        {", "}
        <span className="font-mono text-xs text-gold/80">
          {"{{budget}}"}
        </span>
        .
      </>
    ),
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="5" cy="10" r="2.5" />
        <circle cx="15" cy="5" r="2.5" />
        <circle cx="15" cy="15" r="2.5" />
        <line x1="7.5" y1="8.75" x2="12.5" y2="6.25" strokeLinecap="round" />
        <line x1="7.5" y1="11.25" x2="12.5" y2="13.75" strokeLinecap="round" />
      </svg>
    ),
    title: "Integrations",
    description:
      "Your tools, your call. Gmail, Instagram, QuickBooks — connect the platforms that already run your business.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center snap-start snap-always">
        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/5 blur-[120px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6">
          {/* Gift chip */}
          <div className="animate-fade-up opacity-0 [animation-fill-mode:forwards]">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 text-caption font-medium uppercase tracking-widest text-gold">
              <span>✦</span>
              <span>A gift. Just for you.</span>
              <span>✦</span>
            </span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up opacity-0 [animation-fill-mode:forwards] animate-delay-100 text-display-1 max-w-3xl text-ink-primary">
            Andres, meet{" "}
            <span className="text-gold">your&nbsp;CRM.</span>
          </h1>

          {/* Subheadline */}
          <p className="animate-fade-up opacity-0 [animation-fill-mode:forwards] animate-delay-200 max-w-xl text-body-lg text-ink-secondary">
            Built from scratch. Designed around the way you work.
            No bloat, no subscriptions — just the tools you actually need.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="animate-fade-in opacity-0 [animation-fill-mode:forwards] animate-delay-600 absolute bottom-10 flex flex-col items-center gap-2">
          <span className="text-caption text-ink-muted tracking-widest uppercase">What&apos;s inside</span>
          <svg
            className="animate-bounce text-ink-muted"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <polyline points="3,6 8,11 13,6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-24 snap-start">
        <div className="mb-16 text-center">
          <p className="text-caption uppercase tracking-widest text-ink-muted">Everything you need</p>
          <h2 className="mt-3 text-display-2 text-ink-primary">Six&nbsp;features. Zero&nbsp;fluff.</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group relative rounded-token-lg border border-line bg-bg-card p-6 transition-all duration-300 hover:border-gold/20 hover:bg-bg-hover"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Subtle hover glow */}
              <div className="pointer-events-none absolute inset-0 rounded-token-lg bg-gradient-to-br from-gold/0 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:from-gold/5" />

              <div className="relative z-10">
                <div className="mb-4 inline-flex items-center justify-center rounded-token-md border border-line bg-bg-subtle p-2.5 text-gold">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-heading text-ink-primary">{feature.title}</h3>
                <p className="text-body text-ink-secondary">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-line to-transparent" />
      </div>

      {/* CTA */}
      <CTASection />

      {/* Footer */}
      <footer className="py-10 text-center text-caption text-ink-muted">
        Made with care, by Aaron.
      </footer>
    </main>
  );
}
