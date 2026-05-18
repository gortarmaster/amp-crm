const CHAPTERS = [
  { n: 1, label: 'Home Base', emoji: '🌐' },
  { n: 2, label: 'Money', emoji: '💳' },
  { n: 3, label: 'Booking Flow', emoji: '📋' },
  { n: 4, label: 'Delivery', emoji: '📦' },
  { n: 5, label: 'Pain Points', emoji: '⚡' },
]

export default function ChapterProgress({ current }: { current: number }) {
  const pct = Math.round(((current - 1) / 5) * 100)

  return (
    <div className="w-full">
      {/* Chapter label */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-caption text-ink-muted">
          Chapter {current} of 5 — <span className="text-ink-secondary">{CHAPTERS[current - 1]?.label}</span>
        </span>
        <span className="text-caption text-ink-muted">{pct}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-px w-full overflow-hidden bg-line">
        <div
          className="h-full bg-gold transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Step dots */}
      <div className="mt-3 flex items-center justify-between">
        {CHAPTERS.map((ch) => (
          <div key={ch.n} className="flex flex-col items-center gap-1">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full border text-[10px] transition-all duration-300 ${
                ch.n < current
                  ? 'border-gold bg-gold text-bg-base'
                  : ch.n === current
                  ? 'border-gold bg-transparent text-gold'
                  : 'border-line bg-transparent text-ink-muted'
              }`}
            >
              {ch.n < current ? '✓' : ch.emoji}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
