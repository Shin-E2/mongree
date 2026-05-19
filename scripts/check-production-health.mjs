const DEFAULT_HEALTH_URL = "https://mongree.vercel.app/api/health";

const healthUrl = process.env.MONGREE_HEALTH_URL || DEFAULT_HEALTH_URL;
const healthSecret = process.env.MONGREE_HEALTH_SECRET;

const requiredEnvironment = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

const optionalEnvironment = [
  "OPENAI_API_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_PRICE_ID",
  "STRIPE_WEBHOOK_SECRET",
];

const requiredTables = ["ai_reports", "usage_events", "subscriptions"];

function formatStatus(items, keyName) {
  return items
    .map((item) => {
      const name = item.key ?? item.table ?? item[keyName];
      return `- ${name}: ${item.ready ? "ready" : "missing"}`;
    })
    .join("\n");
}

async function main() {
  const response = await fetch(healthUrl, {
    headers: {
      accept: "application/json",
      ...(healthSecret ? { Authorization: `Bearer ${healthSecret}` } : {}),
    },
  });
  const body = await response.json();

  const environment = body.environment ?? [];
  const tables = body.tables ?? [];
  const missingEnvironment = requiredEnvironment.filter(
    (key) => !environment.some((item) => item.key === key && item.ready)
  );
  const missingTables = requiredTables.filter(
    (table) => !tables.some((item) => item.table === table && item.ready)
  );

  console.log(`Health URL: ${healthUrl}`);
  console.log(`HTTP status: ${response.status}`);
  const requiredStatuses = environment.filter(
    (item) => item.category !== "optional"
  );
  const optionalStatuses = optionalEnvironment.map(
    (key) =>
      environment.find((item) => item.key === key) ?? {
        key,
        ready: false,
        category: "optional",
      }
  );

  console.log("\nRequired environment");
  console.log(formatStatus(requiredStatuses, "key"));
  console.log("\nOptional environment");
  console.log(formatStatus(optionalStatuses, "key"));
  console.log("\nTables");
  console.log(formatStatus(tables, "table"));

  if (!response.ok || body.ready !== true || missingEnvironment.length || missingTables.length) {
    if (missingEnvironment.length) {
      console.log(`\nMissing environment: ${missingEnvironment.join(", ")}`);
    }
    if (missingTables.length) {
      console.log(`Missing tables: ${missingTables.join(", ")}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log("\nProduction readiness verified.");
}

main().catch((error) => {
  console.error("Production readiness check failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
