import { NextResponse } from "next/server";

import { runPipeline } from "@/lib/engine/pipeline";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const input = (body as { input?: unknown }).input;
  if (typeof input !== "string" || input.trim().length < 2) {
    return NextResponse.json(
      { error: "Provide an `input` string of at least 2 characters." },
      { status: 400 },
    );
  }

  try {
    const result = await runPipeline(input);
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
