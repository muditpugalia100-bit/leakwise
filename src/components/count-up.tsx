"use client";

import { useEffect, useRef, useState } from "react";

import { formatINR } from "@/lib/format";

interface CountUpProps {
  to: number;
  durationMs?: number;
  className?: string;
}

/**
 * Subtle ₹ count-up. Eases in over `durationMs` then settles on the final number.
 * Formats internally with formatINR so no function prop crosses the server/client boundary.
 */
export function CountUp({ to, durationMs = 1400, className }: CountUpProps) {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    function tick(ts: number) {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(1, elapsed / durationMs);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(to * eased));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setValue(to);
      }
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [to, durationMs]);

  return <span className={className}>{formatINR(value)}</span>;
}
