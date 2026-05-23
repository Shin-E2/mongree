import * as Sentry from "@sentry/nextjs";
import { headers } from "next/headers";

export async function register() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;

  if (process.env.NEXT_RUNTIME === "nodejs") {
    Sentry.init({
      dsn,
      tracesSampleRate: 0.1,
      beforeSend(event) {
        if (process.env.NODE_ENV !== "production") return null;
        return event;
      },
      integrations: [
        Sentry.requestDataIntegration(),
      ],
    });
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    Sentry.init({
      dsn,
      tracesSampleRate: 0.1,
    });
  }
}

export async function onRequestError(
  err: unknown,
  _request: { path: string; method: string; headers: Record<string, string> },
  _context: unknown
) {
  let requestId: string | undefined;
  try {
    const h = await headers();
    requestId = h.get("x-request-id") ?? undefined;
  } catch {
    // headers() not available in edge context
  }

  Sentry.captureException(err, {
    tags: requestId ? { request_id: requestId } : undefined,
  });
}
