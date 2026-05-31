"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Sparkles } from "lucide-react";

import { CategoryTiles } from "./category-tiles";
import type { ComparisonResult } from "@/lib/engine/types";

const PROGRESS_STEPS = [
  "Detecting category…",
  "Checking Amazon…",
  "Checking Flipkart…",
  "Checking eBay…",
  "Checking brand site…",
  "Reading reviews…",
  "Checking trend signals…",
  "Composing the verdict…",
];

const DEMO_QUERIES = [
  "Sony WH-CH720N headphones",
  "boAt Airdopes 161",
  "Atomic Habits by James Clear",
  "Aashirvaad Atta 5kg",
];

const STEP_TICK_MS = 480;

export function SearchPanel() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function submit(query: string) {
    setError(null);
    setSubmitting(true);
    setStepIdx(0);

    const startedAt = Date.now();
    const apiPromise = fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: query }),
    }).then((r) => r.json());

    // March through progress steps client-side at fixed cadence
    let cancelled = false;
    const ticker = setInterval(() => {
      if (cancelled) return;
      setStepIdx((prev) => Math.min(prev + 1, PROGRESS_STEPS.length - 1));
    }, STEP_TICK_MS);

    let payload: { ok?: boolean; result?: ComparisonResult; error?: string };
    try {
      payload = (await apiPromise) as typeof payload;
    } catch (e) {
      cancelled = true;
      clearInterval(ticker);
      setSubmitting(false);
      setError(e instanceof Error ? e.message : "Network error");
      return;
    }

    cancelled = true;
    clearInterval(ticker);
    setStepIdx(PROGRESS_STEPS.length - 1);

    // Give the final step a beat to be readable
    const minWall = 3200;
    const elapsed = Date.now() - startedAt;
    if (elapsed < minWall) {
      await new Promise((r) => setTimeout(r, minWall - elapsed));
    }

    if (!payload.ok || !payload.result) {
      setSubmitting(false);
      setError(payload.error ?? "Couldn't complete the search.");
      return;
    }
    const result = payload.result;
    try {
      sessionStorage.setItem(`td:${result.id}`, JSON.stringify(result));
    } catch {
      /* sessionStorage may be unavailable; fall back to query param */
    }
    router.push(`/r/${result.id}`);
  }

  function onSubmitForm(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (!q || submitting) return;
    submit(q);
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="relative">
      <form onSubmit={onSubmitForm} className="relative">
        <div className="relative flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3.5 shadow-[0_4px_24px_rgb(0_0_0_/0.03)] focus-within:border-foreground/40 focus-within:shadow-[0_8px_32px_rgb(0_0_0_/0.06)] transition-all">
          <Sparkles
            aria-hidden
            className="h-4 w-4 shrink-0 text-muted-foreground"
          />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Paste an Amazon URL, or describe a product…"
            className="min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
            disabled={submitting}
          />
          <button
            type="submit"
            disabled={submitting || !value.trim()}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-foreground text-background transition-all disabled:opacity-30"
            aria-label="Run TrueDeal"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>

      <div className="mt-3 text-center text-xs text-muted-foreground">
        Paste a URL or describe a product. We check the right marketplaces and
        tell you where to buy.
      </div>

      <div className="mt-6">
        <CategoryTiles onPick={(p) => setValue(p)} />
      </div>

      <div className="mt-10">
        <div className="small-caps text-xs text-muted-foreground">
          Try a demo
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {DEMO_QUERIES.map((q) => (
            <button
              key={q}
              type="button"
              disabled={submitting}
              onClick={() => {
                setValue(q);
                submit(q);
              }}
              className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs text-foreground/80 transition-colors hover:border-foreground/40 hover:text-foreground disabled:opacity-40"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div
          className="mt-6 rounded-2xl border px-5 py-4"
          style={{
            borderColor: "rgba(159, 57, 57, 0.25)",
            backgroundColor: "rgba(159, 57, 57, 0.05)",
          }}
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0"
              style={{ color: "#9F3939" }}
            />
            <div className="flex-1 text-sm">
              <div className="font-medium" style={{ color: "#9F3939" }}>
                Couldn&apos;t complete this search.
              </div>
              <p className="mt-1 text-foreground/70 leading-relaxed">
                {error}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Wire&apos;s scraping backend is intermittently degraded today —
                try one of the demo queries above to see the full TrueDeal
                experience.
              </p>
            </div>
          </div>
        </div>
      )}

      {submitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-foreground/40" />
                <span className="relative h-2 w-2 rounded-full bg-foreground" />
              </span>
              TrueDeal is working
            </div>
            <div className="mt-8 min-h-[3rem]">
              <p
                key={stepIdx}
                className="animate-fade-up font-display text-2xl tracking-tight text-foreground"
              >
                {PROGRESS_STEPS[stepIdx]}
              </p>
            </div>
            <div className="mt-6 mx-auto h-1 w-48 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-foreground transition-all duration-300 ease-out"
                style={{
                  width: `${((stepIdx + 1) / PROGRESS_STEPS.length) * 100}%`,
                }}
              />
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              Wire calls run in parallel. Total time varies with platform response.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
