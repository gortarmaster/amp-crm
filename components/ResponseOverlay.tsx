"use client";

import { useEffect, useRef } from "react";
import ConfettiEffect from "./ConfettiEffect";

interface Props {
  action: "accept" | "decline";
}

const content = {
  accept: {
    emoji: "🎉",
    headline: "Welcome to your new CRM.",
    body: "An excellent decision. We build in 3... 2... 1.",
    subtext: "Aaron has been notified. He is doing a little dance.",
    cta: null,
  },
  decline: {
    emoji: "😔",
    headline: "A bold choice.",
    body: "The confetti has been returned to the store. Aaron is crying softly.",
    subtext: "If you change your mind — and you will — it'll still be here.",
    cta: null,
  },
};

export default function ResponseOverlay({ action }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent background scroll while overlay is shown
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const c = content[action];

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-base/95 px-6 text-center backdrop-blur-sm animate-fade-in"
    >
      {action === "accept" && <ConfettiEffect />}

      <div className="flex flex-col items-center gap-6 max-w-lg">
        <span className="text-6xl" role="img" aria-label={action}>
          {c.emoji}
        </span>

        <div>
          <h2 className="text-display-2 text-ink-primary">{c.headline}</h2>
          <p className="mt-4 text-body-lg text-gold">{c.body}</p>
          <p className="mt-3 text-body text-ink-secondary">{c.subtext}</p>
        </div>

        {action === "accept" && (
          <div className="mt-4 rounded-token-lg border border-gold/20 bg-gold/5 px-6 py-4">
            <p className="text-caption uppercase tracking-widest text-gold mb-2">Up next</p>
            <p className="text-body text-ink-secondary">
              Contacts → Companies → Deals → Sequences → Templates → Integrations
            </p>
          </div>
        )}

        {action === "decline" && (
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-caption text-ink-muted underline-offset-4 hover:underline hover:text-ink-secondary transition-colors"
          >
            Actually... wait. Let me reconsider.
          </button>
        )}
      </div>
    </div>
  );
}
