/**
 * Wire by Anakin low-level client.
 *
 * - Submits a task, polls for completion, returns the structured `data` payload.
 * - Throws on auth/network/timeout — callers decide what to do (usually: log + omit from result).
 */

const WIRE_BASE = "https://api.anakin.io";

interface SubmitResponse {
  status: string;
  job_id: string;
  poll_url?: string;
}

interface JobResponse<T = unknown> {
  id?: string;
  status: "processing" | "queued" | "running" | "pending" | "completed" | "failed";
  credits_used?: number;
  result?: {
    status: "ok" | "error";
    data?: T;
    error?: string;
  };
  error?: string;
}

export interface RunOptions {
  /** Wall-clock budget — total time we'll wait before throwing. Default 25s. */
  timeoutMs?: number;
  /** Poll interval. Default 700ms. */
  pollMs?: number;
  /** Label used in error messages and progress hints. */
  label?: string;
}

export class WireError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "missing_key"
      | "submit_failed"
      | "poll_failed"
      | "job_failed"
      | "timeout"
      | "no_data",
    public readonly status?: number,
  ) {
    super(message);
    this.name = "WireError";
  }
}

function readKey(): string {
  const k = process.env.WIRE_API_KEY;
  if (!k) {
    throw new WireError(
      "WIRE_API_KEY env var is not set",
      "missing_key",
    );
  }
  return k;
}

function headers() {
  return {
    Authorization: `Bearer ${readKey()}`,
    "Content-Type": "application/json",
  };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function runAction<T = unknown>(
  actionId: string,
  parameters: Record<string, unknown> = {},
  options: RunOptions = {},
): Promise<T> {
  const timeoutMs = options.timeoutMs ?? 25_000;
  const pollMs = options.pollMs ?? 700;
  const label = options.label ?? actionId;

  const submitRes = await fetch(`${WIRE_BASE}/v1/wire/task`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ action_id: actionId, parameters }),
    // We can't use Next's caching here — Wire data is dynamic per call
    cache: "no-store",
  });

  if (!submitRes.ok) {
    throw new WireError(
      `[${label}] submit failed (${submitRes.status})`,
      "submit_failed",
      submitRes.status,
    );
  }
  const submit = (await submitRes.json()) as SubmitResponse;
  const jobId = submit.job_id;
  if (!jobId) {
    throw new WireError(`[${label}] no job_id in submit response`, "submit_failed");
  }

  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    await sleep(pollMs);
    const pollRes = await fetch(`${WIRE_BASE}/v1/wire/jobs/${jobId}`, {
      headers: headers(),
      cache: "no-store",
    });
    if (!pollRes.ok) {
      throw new WireError(
        `[${label}] poll failed (${pollRes.status})`,
        "poll_failed",
        pollRes.status,
      );
    }
    const job = (await pollRes.json()) as JobResponse<T>;

    if (job.status === "completed") {
      if (job.result?.status === "ok" && job.result.data !== undefined) {
        return job.result.data;
      }
      throw new WireError(
        `[${label}] completed without data (${job.result?.error ?? "unknown"})`,
        "no_data",
      );
    }
    if (job.status === "failed") {
      throw new WireError(
        `[${label}] job failed (${job.error ?? "unknown"})`,
        "job_failed",
      );
    }
  }
  throw new WireError(
    `[${label}] exceeded ${timeoutMs}ms budget`,
    "timeout",
  );
}

/**
 * Run an action and swallow errors — returns null instead of throwing.
 * Use this for non-critical enrichments (one platform out of many).
 */
export async function tryRunAction<T = unknown>(
  actionId: string,
  parameters: Record<string, unknown> = {},
  options: RunOptions = {},
): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  try {
    const data = await runAction<T>(actionId, parameters, options);
    return { ok: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: message };
  }
}
