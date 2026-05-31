/**
 * Debug endpoint — reveals which env vars are present (prefix only, never the
 * full value). Used to confirm Vercel is loading the keys correctly.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function prefix(v: string | undefined, n = 6): string | null {
  if (!v) return null;
  return v.slice(0, n) + "…";
}

export async function GET() {
  return Response.json({
    wire: {
      present: !!process.env.WIRE_API_KEY,
      length: process.env.WIRE_API_KEY?.length ?? 0,
      prefix: prefix(process.env.WIRE_API_KEY),
    },
    gemini: {
      present: !!process.env.GEMINI_API_KEY,
      length: process.env.GEMINI_API_KEY?.length ?? 0,
      prefix: prefix(process.env.GEMINI_API_KEY),
    },
    runtime: "nodejs",
    nodeVersion: process.versions.node,
    timestamp: new Date().toISOString(),
  });
}
