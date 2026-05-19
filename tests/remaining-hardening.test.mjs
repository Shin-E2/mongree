import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");

test("diary create and update use transactional RPC functions", () => {
  const createAction = read("src/app/(dashboard)/diary/new/action.ts");
  const editAction = read("src/app/(dashboard)/diary/[id]/edit/action.ts");
  const migration = read(
    "supabase/migrations/20260519010000_remaining_product_hardening.sql"
  );

  assert.match(migration, /create or replace function public\.create_diary_transaction/);
  assert.match(migration, /create or replace function public\.update_diary_transaction/);
  assert.match(createAction, /\.rpc\(\s*"create_diary_transaction"/);
  assert.match(editAction, /\.rpc\(\s*"update_diary_transaction"/);
  assert.doesNotMatch(createAction, /\.from\("diary_emotions"\)\s*[\s\S]*?\.insert/);
  assert.doesNotMatch(editAction, /\.from\("diary_emotions"\)\s*[\s\S]*?\.delete/);
});

test("community feed uses database aggregate pagination for latest and popular sorting", () => {
  const community = read("src/app/(dashboard)/community/action.ts");
  const migration = read(
    "supabase/migrations/20260519010000_remaining_product_hardening.sql"
  );
  const types = read("src/lib/supabase.types.ts");

  assert.match(migration, /create or replace view public\.public_diary_feed/);
  assert.match(migration, /create or replace function public\.get_public_diary_feed/);
  assert.match(community, /\.rpc\("get_public_diary_feed"/);
  assert.doesNotMatch(community, /sortBy === "popular"[\s\S]*?\.sort/);
  assert.doesNotMatch(community, /\.slice\(skip, skip \+ ITEMS_PER_PAGE\)/);
  assert.match(types, /get_public_diary_feed:/);
});

test("AI report API separates GET lookup from POST generation and enforces policy gates", () => {
  const route = read("src/app/api/ai/reports/route.ts");
  const migration = read(
    "supabase/migrations/20260519010000_remaining_product_hardening.sql"
  );

  assert.match(route, /export async function GET/);
  assert.match(route, /export async function POST/);
  assert.match(route, /explicitConsent/);
  assert.match(route, /hasActiveSubscription/);
  assert.match(route, /getMonthlyAiUsage/);
  assert.match(route, /AI_FREE_MONTHLY_LIMIT/);
  assert.match(route, /AI_PAID_MONTHLY_LIMIT/);
  assert.match(route, /event_type:\s*"ai_report\.generated"/);
  assert.match(migration, /create index if not exists idx_usage_events_ai_report_month/);

  const getBody = route.slice(
    route.indexOf("export async function GET"),
    route.indexOf("export async function POST")
  );
  assert.doesNotMatch(getBody, /buildOpenAiReport/);
  assert.doesNotMatch(getBody, /usage_events"\)\.insert/);
});

test("AI report page surfaces saved reports and an explicit generation consent control", () => {
  const action = read("src/app/(dashboard)/ai-report/action.ts");
  const page = read("src/app/(dashboard)/ai-report/page.tsx");
  const client = read("src/app/(dashboard)/ai-report/generate-report-button.tsx");

  assert.match(action, /ai_reports/);
  assert.match(action, /reportStatus/);
  assert.match(page, /GenerateReportButton/);
  assert.match(client, /explicitConsent:\s*true/);
  assert.match(client, /\/api\/ai\/reports/);
});
