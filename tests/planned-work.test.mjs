import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = path.resolve(import.meta.dirname, "..");

const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");

const plannedKoreanCopyFiles = [
  "src/components/layout/sidebar/navigation/constants.ts",
  "src/commons/constants/global-url.ts",
  "src/components/home/(dashboard)/diary/new/form.schema.ts",
  "src/app/(dashboard)/diary/new/action.ts",
  "src/app/(dashboard)/diary/new/hook.ts",
  "src/app/(dashboard)/diary/[id]/edit/action.ts",
  "src/components/home/(dashboard)/diary/edit/index.tsx",
  "src/components/layout/scene-character/index.tsx",
  "src/components/home/welcome-hero-section/index.tsx",
];

const mojibakeFragments = [
  "\uFFFD",
  "濡쒓",
  "媛먯",
  "留묒",
  "諛?",
  "鍮?",
  "怨듦",
  "?대?",
  "?쇨",
  "?쒕",
  "?섏",
  "?댁",
];

test("planned Korean copy files do not contain mojibake", () => {
  const brokenFiles = plannedKoreanCopyFiles.filter((file) =>
    mojibakeFragments.some((fragment) => read(file).includes(fragment))
  );

  assert.deepEqual(brokenFiles, []);
});

test("sidebar navigation exposes readable Korean route labels", () => {
  const source = read("src/components/layout/sidebar/navigation/constants.ts");

  for (const label of [
    "홈",
    "나의 일기",
    "감정 캘린더",
    "감정 통계",
    "공개 일기",
    "AI 리포트",
  ]) {
    assert.match(source, new RegExp(`label: "${label}"`));
  }

  assert.match(source, /export const MOBILE_NAV_ITEMS/);
});

test("diary form schema normalizes tags and uses readable validation messages", () => {
  const source = read("src/components/home/(dashboard)/diary/new/form.schema.ts");

  assert.match(source, /Array\.from\(new Set/);
  assert.match(source, /감정을 하나 이상 선택해주세요\./);
  assert.match(source, /제목을 입력해주세요\./);
  assert.match(source, /내용을 입력해주세요\./);
});

test("app shell redesign artifacts are wired", () => {
  const dashboardLayout = read("src/components/layout/index.tsx");
  const sceneCharacter = read("src/components/layout/scene-character/index.tsx");
  const topbarStyles = read("src/components/layout/topbar/styles.module.css");
  const sidebarNavigation = read(
    "src/components/layout/sidebar/navigation/index.tsx"
  );

  assert.match(dashboardLayout, /SceneCharacter/);
  assert.match(sceneCharacter, /\/characters\/day\.svg/);
  assert.match(sceneCharacter, /\/characters\/night\.svg/);
  assert.match(sceneCharacter, /\/characters\/rain\.svg/);
  assert.match(sceneCharacter, /\/characters\/snow\.svg/);
  assert.match(topbarStyles, /@keyframes sceneIconSpin/);
  assert.match(sidebarNavigation, /styles\.tooltip/);
});

test("welcome hero exposes readable Korean copy", () => {
  const source = read("src/components/home/welcome-hero-section/index.tsx");

  assert.match(source, /몽그리와 함께/);
  assert.match(source, /당신의 마음을 보듬어보세요/);
  assert.match(source, /시작하기/);
});

test("planned production API routes exist", () => {
  for (const routeFile of [
    "src/app/api/ai/reports/route.ts",
    "src/app/api/billing/checkout/route.ts",
    "src/app/api/billing/portal/route.ts",
    "src/app/api/webhooks/stripe/route.ts",
    "src/app/api/weather/theme/route.ts",
    "src/app/api/health/route.ts",
  ]) {
    assert.equal(fs.existsSync(path.join(root, routeFile)), true, routeFile);
  }
});

test("health route checks production readiness without leaking secrets", () => {
  const source = read("src/app/api/health/route.ts");

  assert.match(source, /OPENAI_API_KEY/);
  assert.match(source, /STRIPE_SECRET_KEY/);
  assert.match(source, /ai_reports/);
  assert.match(source, /usage_events/);
  assert.match(source, /subscriptions/);
  assert.doesNotMatch(source, /process\.env\[[^\]]+\]\s*\}/);
});

test("production readiness has an operator verification path", () => {
  const packageJson = JSON.parse(read("package.json"));
  const script = read("scripts/check-production-health.mjs");
  const runbook = read("README.md");

  assert.equal(
    packageJson.scripts["verify:production"],
    "node scripts/check-production-health.mjs"
  );
  assert.match(script, /mongree\.vercel\.app\/api\/health/);
  assert.match(script, /OPENAI_API_KEY/);
  assert.match(script, /STRIPE_WEBHOOK_SECRET/);
  assert.match(runbook, /OPENAI_API_KEY/);
  assert.match(runbook, /STRIPE_WEBHOOK_SECRET/);
  assert.match(runbook, /npm run verify:production/);
});

test("AI report route uses structured OpenAI output with safe fallback", () => {
  const source = read("src/app/api/ai/reports/route.ts");

  assert.match(source, /OPENAI_API_KEY/);
  assert.match(source, /https:\/\/api\.openai\.com\/v1\/responses/);
  assert.match(source, /json_schema/);
  assert.match(source, /summary/);
  assert.match(source, /recommendations/);
});

test("AI report page surfaces generated report fields", () => {
  const pageSource = read("src/app/(dashboard)/ai-report/page.tsx");
  const actionSource = read("src/app/(dashboard)/ai-report/action.ts");

  assert.match(actionSource, /generatedReport/);
  assert.match(pageSource, /generatedReport/);
  assert.match(pageSource, /recommendations/);
});

test("billing routes expose checkout, portal, and webhook contracts", () => {
  const checkout = read("src/app/api/billing/checkout/route.ts");
  const portal = read("src/app/api/billing/portal/route.ts");
  const webhook = read("src/app/api/webhooks/stripe/route.ts");

  assert.match(checkout, /checkout\.sessions\.create/);
  assert.match(checkout, /mode: "subscription"/);
  assert.match(portal, /billingPortal\.sessions\.create/);
  assert.match(webhook, /webhooks\.constructEvent/);
  assert.match(webhook, /request\.text\(\)/);
});

test("planned AI and billing persistence tables are represented", () => {
  const migration = read("supabase/migrations/20260518030000_ai_billing_tables.sql");
  const types = read("src/lib/supabase.types.ts");
  const aiRoute = read("src/app/api/ai/reports/route.ts");
  const checkoutRoute = read("src/app/api/billing/checkout/route.ts");
  const webhookRoute = read("src/app/api/webhooks/stripe/route.ts");

  for (const table of ["ai_reports", "usage_events", "subscriptions"]) {
    assert.equal(
      migration.includes(`create table if not exists public.${table}`),
      true,
      table
    );
    assert.match(types, new RegExp(`${table}:`));
  }

  assert.match(aiRoute, /ai_reports/);
  assert.match(aiRoute, /usage_events/);
  assert.match(checkoutRoute, /usage_events/);
  assert.match(webhookRoute, /subscriptions/);
});

test("profile page exposes subscription management entry point", () => {
  const source = read("src/app/(dashboard)/profile/profile-settings-client.tsx");

  assert.match(source, /\/api\/billing\/checkout/);
  assert.match(source, /구독/);
  assert.match(source, /결제/);
});

test("weather theme route maps weather and time into Mongree scenes", () => {
  const source = read("src/app/api/weather/theme/route.ts");

  assert.match(source, /rain/);
  assert.match(source, /snow/);
  assert.match(source, /night/);
  assert.match(source, /day/);
  assert.match(source, /theme/);
});

test("character assets use premium 3D cues instead of flat placeholders", () => {
  const component = read("src/components/layout/scene-character/index.tsx");

  assert.match(component, /맑은 날 Mongree 캐릭터/);
  assert.match(component, /프로필 보기/);

  for (const asset of ["day", "night", "rain", "snow"]) {
    const source = read(`public/characters/${asset}.svg`);

    assert.match(source, /linearGradient|radialGradient/, asset);
    assert.match(source, /filter|feDropShadow|feGaussianBlur/, asset);
    assert.match(source, /specular|rim|ambient|floorShadow/, asset);
  }
});
