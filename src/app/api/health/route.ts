import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const requiredEnvironment = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "OPENAI_API_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_PRICE_ID",
  "STRIPE_WEBHOOK_SECRET",
] as const;

const requiredTables = ["ai_reports", "usage_events", "subscriptions"] as const;

async function checkTable(table: (typeof requiredTables)[number]) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from(table).select("id").limit(1);
    return { table, ready: !error, error: error?.code ?? null };
  } catch {
    return { table, ready: false, error: "admin_client_unavailable" };
  }
}

export async function GET() {
  const environment = requiredEnvironment.map((key) => ({
    key,
    ready: Boolean(process.env[key]),
  }));
  const tables = await Promise.all(requiredTables.map(checkTable));
  const ready =
    environment.every((item) => item.ready) &&
    tables.every((item) => item.ready);

  return NextResponse.json(
    {
      ready,
      environment,
      tables,
    },
    { status: ready ? 200 : 503 }
  );
}

