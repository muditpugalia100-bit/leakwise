/**
 * Debug endpoint — reveals which env vars are present (prefix only, never the
 * full value) and actively tests both keys against the real APIs.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function prefix(v: string | undefined, n = 6): string | null {
  if (!v) return null;
  return v.slice(0, n) + "…";
}

async function testGemini(): Promise<
  | { ok: true; reply: string }
  | { ok: false; error: string }
> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return { ok: false, error: "no key set" };
  try {
    const genai = new GoogleGenerativeAI(key);
    const model = genai.getGenerativeModel({ model: "gemini-2.0-flash" });
    const res = await model.generateContent(
      "Reply with exactly: TrueDeal Gemini key works.",
    );
    return { ok: true, reply: res.response.text().trim().slice(0, 120) };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message.slice(0, 400) : String(err).slice(0, 400),
    };
  }
}

async function testWire(): Promise<{ ok: boolean; status: number; bytes: number }> {
  const key = process.env.WIRE_API_KEY;
  if (!key) return { ok: false, status: 0, bytes: 0 };
  try {
    const r = await fetch("https://api.anakin.io/v1/wire/catalog", {
      headers: { Authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    const buf = await r.arrayBuffer();
    return { ok: r.ok, status: r.status, bytes: buf.byteLength };
  } catch {
    return { ok: false, status: 0, bytes: 0 };
  }
}

export async function GET() {
  const [geminiTest, wireTest] = await Promise.all([testGemini(), testWire()]);
  return Response.json({
    wire: {
      present: !!process.env.WIRE_API_KEY,
      length: process.env.WIRE_API_KEY?.length ?? 0,
      prefix: prefix(process.env.WIRE_API_KEY),
      liveTest: wireTest,
    },
    gemini: {
      present: !!process.env.GEMINI_API_KEY,
      length: process.env.GEMINI_API_KEY?.length ?? 0,
      prefix: prefix(process.env.GEMINI_API_KEY),
      liveTest: geminiTest,
    },
    runtime: "nodejs",
    nodeVersion: process.versions.node,
    timestamp: new Date().toISOString(),
  });
}
