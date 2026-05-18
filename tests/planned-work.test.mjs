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
];

const mojibakePattern = /[\uFFFD\u4E00-\u9FFF]/;

test("planned Korean copy files do not contain mojibake", () => {
  const brokenFiles = plannedKoreanCopyFiles.filter((file) =>
    mojibakePattern.test(read(file))
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

test("planned production API routes exist", () => {
  for (const routeFile of [
    "src/app/api/ai/reports/route.ts",
    "src/app/api/billing/checkout/route.ts",
    "src/app/api/billing/portal/route.ts",
    "src/app/api/webhooks/stripe/route.ts",
    "src/app/api/weather/theme/route.ts",
  ]) {
    assert.equal(fs.existsSync(path.join(root, routeFile)), true, routeFile);
  }
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

test("character assets use depth cues instead of flat placeholders", () => {
  for (const asset of ["day", "night", "rain", "snow"]) {
    const source = read(`public/characters/${asset}.svg`);

    assert.match(source, /linearGradient|radialGradient/, asset);
    assert.match(source, /filter|feDropShadow|feGaussianBlur/, asset);
  }
});
