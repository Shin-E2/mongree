import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");

test("AI report shared logic is split out of route and page action files", () => {
  const route = read("src/app/api/ai/reports/route.ts");
  const action = read("src/app/(dashboard)/ai-report/action.ts");
  const shared = read("src/lib/ai-report/core.ts");

  assert.ok(route.split(/\r?\n/).length < 280, "route file should stay focused");
  assert.match(route, /@\/lib\/ai-report\/core/);
  assert.match(action, /@\/lib\/ai-report\/core/);
  assert.match(shared, /export function getMonthRange/);
  assert.match(shared, /export function buildLocalReport/);
  assert.match(shared, /export function serializeStoredReport/);
  assert.doesNotMatch(route, /function buildLocalReport/);
  assert.doesNotMatch(route, /const reportSchema/);
});

test("AI report user-facing copy is readable Korean, not mojibake", () => {
  const files = [
    "src/app/api/ai/reports/route.ts",
    "src/app/(dashboard)/ai-report/action.ts",
    "src/app/(dashboard)/ai-report/page.tsx",
    "src/app/(dashboard)/ai-report/generate-report-button.tsx",
  ];

  for (const file of files) {
    const source = read(file);
    assert.doesNotMatch(source, /[�筌揶疫]/, file);
  }

  assert.match(read("src/lib/ai-report/core.ts"), /아직 분석할 일기가 없습니다/);
  assert.match(read("src/app/(dashboard)/ai-report/action.ts"), /기록 리듬/);
});

test("source files do not contain Korean mojibake leftovers", () => {
  const files = [
    "src/app/(dashboard)/calendar/action.ts",
    "src/app/(dashboard)/community/page.tsx",
    "src/app/(dashboard)/diary/action.ts",
    "src/app/(dashboard)/diary/[id]/page.tsx",
    "src/app/(dashboard)/profile/action.ts",
    "src/app/(dashboard)/statistics/action.ts",
    "src/app/api/billing/checkout/route.ts",
    "src/app/api/billing/portal/route.ts",
    "src/app/api/upload/route.ts",
    "src/commons/components/comment/action.ts",
    "src/commons/components/comment-form/action.ts",
    "src/components/home/(dashboard)/community/diary-card/action.ts",
    "src/components/home/(dashboard)/diary/detail/action.ts",
    "src/commons/utils/counselors-scraper.ts",
    "src/components/layout/topbar/index.tsx",
    "src/components/layout/topbar/styles.module.css",
    "src/components/layout/scene-character/index.tsx",
    "src/components/home/(dashboard)/community/diary-card/index.tsx",
    "src/components/home/(dashboard)/community/diary-card/styles.module.css",
  ];
  const mojibake = /(?:嚥|紐|袁|筌|疫|揶|獄|占|�|\?蹂|\?癒|\?\?\?\?癒|媛쒖씤|곗씠|쒓렇|湲곕줉|遺꾩꽍)/;

  for (const file of files) {
    assert.doesNotMatch(read(file), mojibake, file);
  }
});

test("community diary cards use the shared Mongree surface component", () => {
  const source = read("src/components/home/(dashboard)/community/diary-card/index.tsx");
  const styles = read("src/components/home/(dashboard)/community/diary-card/styles.module.css");

  assert.match(source, /@\/commons\/components\/surface-card/);
  assert.match(source, /label="공감"/);
  assert.match(source, /label="댓글"/);
  assert.doesNotMatch(styles, /bg-white|shadow-sm|rounded-xl|text-gray-/);
});

test("community feed handles missing feed RPC without exposing raw database errors", () => {
  const source = read("src/app/(dashboard)/community/action.ts");

  assert.match(source, /getPublicDiariesFallback/);
  assert.match(source, /get_public_diary_feed/);
  assert.match(source, /Could not find the function/);
  assert.doesNotMatch(source, /return \{[\s\S]*?error:\s*error\.message/);
});
