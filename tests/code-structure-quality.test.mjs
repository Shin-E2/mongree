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
