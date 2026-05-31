"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

interface ConfettiBurstProps {
  trigger: boolean;
  color: string;
  /** Wait this many ms after mount before firing — lets the page settle. */
  delayMs?: number;
}

/**
 * Brief, tasteful confetti — fires once on first mount when `trigger` is true.
 * Two staggered bursts, 1.5s total, vertical's signature colour mixed with cream.
 */
export function ConfettiBurst({
  trigger,
  color,
  delayMs = 700,
}: ConfettiBurstProps) {
  const fired = useRef(false);

  useEffect(() => {
    if (!trigger || fired.current) return;
    fired.current = true;

    const colors = [color, "#FAF8F5", "#1D1A16"];
    const burstA = setTimeout(() => {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { x: 0.5, y: 0.35 },
        colors,
        ticks: 220,
        startVelocity: 32,
        scalar: 0.95,
        gravity: 1.1,
      });
    }, delayMs);
    const burstB = setTimeout(() => {
      confetti({
        particleCount: 45,
        spread: 110,
        origin: { x: 0.5, y: 0.4 },
        colors,
        ticks: 180,
        startVelocity: 22,
        scalar: 0.75,
        gravity: 1.25,
      });
    }, delayMs + 250);

    return () => {
      clearTimeout(burstA);
      clearTimeout(burstB);
    };
  }, [trigger, color, delayMs]);

  return null;
}
