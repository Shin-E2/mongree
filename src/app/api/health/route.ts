import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const requiredEnvironment = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
] as const;

const optionalEnvironment = [
  "OPENAI_API_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_PRICE_ID",
  "STRIPE_WEBHOOK_SECRET",
] as const;

const requiredTables = ["ai_reports", "usage_events", "subscriptions"] as const;
const healthCheckSecret = process.env.HEALTH_CHECK_SECRET;

async function checkTable(table: (typeof requiredTables)[number]) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from(table).select("id").limit(1);
    return { table, ready: !error, error: error?.code ?? null };
  } catch {
    return { table, ready: false, error: "admin_client_unavailable" };
  }
}

function isAuthorized(request: Request) {
  if (!healthCheckSecret) return true;

  const authorization = request.headers.get("authorization");
  return authorization === `Bearer ${healthCheckSecret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { ready: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const environment = [
    ...requiredEnvironment.map((key) => ({
      key,
      category: "required" as const,
      ready: Boolean(process.env[key]),
    })),
    ...optionalEnvironment.map((key) => ({
      key,
      category: "optional" as const,
      ready: Boolean(process.env[key]),
    })),
  ];
  const requiredEnvironmentReady = requiredEnvironment.every((key) =>
    environment.some((item) => item.key === key && item.ready)
  );
  const integrations = {
    openai: {
      ready: Boolean(process.env.OPENAI_API_KEY),
    },
    stripe: {
      ready: optionalEnvironment
        .filter((key) => key.startsWith("STRIPE_"))
        .every((key) => Boolean(process.env[key])),
    },
  };
  const tables = await Promise.all(requiredTables.map(checkTable));
  const ready =
    requiredEnvironmentReady && tables.every((item) => item.ready);

  return NextResponse.json(
    {
      ready,
      environment,
      integrations,
      tables,
    },
    { status: ready ? 200 : 503 }
  );
}
