"use client";

import { useState } from "react";
import ResponseOverlay from "./ResponseOverlay";

type Action = "accept" | "decline";

export default function CTASection() {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<Action | null>(null);

  async function handleChoice(action: Action) {
    if (pending || result) return;
    setPending(true);
    try {
      await fetch("/api/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
    } catch {
      // Fire-and-forget — don't block the UX on email failure
    }
    setResult(action);
    setPending(false);
  }

  return (
    <>
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center snap-start">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/4 blur-[100px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-8">
          <div>
            <p className="text-caption uppercase tracking-widest text-ink-muted">The moment of truth</p>
            <h2 className="mt-4 text-display-2 text-ink-primary">
              The question<br />is simple.
            </h2>
            <p className="mt-4 max-w-sm text-body-lg text-ink-secondary">
              Your move, Andres.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row">
            {/* Accept */}
            <button
              onClick={() => handleChoice("accept")}
              disabled={pending || !!result}
              className="group relative inline-flex h-14 min-w-[220px] items-center justify-center overflow-hidden rounded-token-md bg-gold px-8 font-semibold text-bg-base transition-all duration-200 hover:bg-gold-light active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 animate-pulse-gold"
            >
              <span className="relative z-10 flex items-center gap-2">
                {pending ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <span>Graciously Accept</span>
                )}
              </span>
            </button>

            {/* Decline */}
            <button
              onClick={() => handleChoice("decline")}
              disabled={pending || !!result}
              className="inline-flex h-14 min-w-[200px] items-center justify-center rounded-token-md border border-line px-8 font-medium text-ink-secondary transition-all duration-200 hover:border-ink-muted hover:text-ink-primary active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            >
              Politely Decline
            </button>
          </div>

          <p className="text-caption text-ink-muted">
            No pressure. (Okay, a little pressure.)
          </p>
        </div>
      </section>

      {result && <ResponseOverlay action={result} />}
    </>
  );
}
