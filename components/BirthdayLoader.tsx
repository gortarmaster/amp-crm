"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

type Phase = "enter" | "active" | "leave" | "done";

export default function BirthdayLoader() {
  const [phase, setPhase] = useState<Phase>("enter");

  useEffect(() => {
    if (sessionStorage.getItem("skipLoader")) {
      sessionStorage.removeItem("skipLoader");
      setPhase("done");
      return;
    }

    let raf: number;

    const launchFireworks = () => {
      const end = Date.now() + 1200;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 70,
          startVelocity: 55,
          origin: { x: 0.05, y: 1 },
          colors: ["#c9a96e", "#dfc08a", "#ffffff", "#f9a8d4"],
          scalar: 1.1,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 70,
          startVelocity: 55,
          origin: { x: 0.95, y: 1 },
          colors: ["#c9a96e", "#dfc08a", "#ffffff", "#93c5fd"],
          scalar: 1.1,
        });
        if (Date.now() < end) raf = requestAnimationFrame(frame);
      };

      frame();
    };

    // Sequence: text animates in (400ms) → text readable → fireworks (1400ms) → clear → fade out
    const t1 = setTimeout(() => setPhase("active"), 400);
    const t2 = setTimeout(launchFireworks, 1400);
    const t3 = setTimeout(() => setPhase("leave"), 3200);
    const t4 = setTimeout(() => setPhase("done"), 4000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg-base px-6 text-center transition-opacity duration-700 ease-in-out ${
        phase === "leave" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/8 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-5">
        {/* Candle */}
        <span
          className={`text-5xl transition-all duration-700 ${
            phase === "enter" ? "opacity-0 scale-75" : "opacity-100 scale-100"
          }`}
          style={{ transitionDelay: "100ms" }}
          role="img"
          aria-label="birthday cake"
        >
          🎂
        </span>

        {/* Happy Birthday line */}
        <p
          className={`text-caption uppercase tracking-[0.25em] text-ink-secondary transition-all duration-700 ${
            phase === "enter" ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          }`}
          style={{ transitionDelay: "250ms" }}
        >
          Happy Birthday
        </p>

        {/* Name */}
        <h1
          className={`text-display-1 text-gold transition-all duration-700 ${
            phase === "enter" ? "opacity-0 translate-y-6" : "opacity-100 translate-y-0"
          }`}
          style={{ transitionDelay: "450ms" }}
        >
          Andres.
        </h1>

        {/* Subtitle */}
        <p
          className={`max-w-xs text-body text-ink-secondary transition-all duration-700 ${
            phase === "enter" ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          }`}
          style={{ transitionDelay: "650ms" }}
        >
          There&apos;s a gift waiting for you.
        </p>
      </div>
    </div>
  );
}
