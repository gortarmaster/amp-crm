"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function ConfettiEffect() {
  useEffect(() => {
    const fire = (particleRatio: number, opts: confetti.Options) => {
      confetti({
        origin: { y: 0.6 },
        ...opts,
        particleCount: Math.floor(200 * particleRatio),
      });
    };

    // Stagger two bursts for a fuller effect
    fire(0.25, { spread: 26, startVelocity: 55, colors: ["#c9a96e", "#f5f5f4", "#dfc08a"] });
    fire(0.2, { spread: 60, colors: ["#c9a96e", "#ffffff", "#a8874e"] });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ["#c9a96e", "#f5f5f4"] });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors: ["#dfc08a"] });
    fire(0.1, { spread: 120, startVelocity: 45, colors: ["#c9a96e", "#ffffff"] });
  }, []);

  return null;
}
