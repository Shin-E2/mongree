import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");

test("AI report API supports owner-only deletion and readable Korean responses", () => {
  const route = read("src/app/api/ai/reports/route.ts");
  const migration = read(
    "supabase/migrations/20260519020000_ai_report_product_completion.sql"
  );

  assert.match(route, /export async function DELETE/);
  assert.match(route, /\.from\("ai_reports"\)[\s\S]*?\.delete\(\)/);
  assert.match(route, /리포트를 삭제했습니다/);
  assert.match(route, /로그인이 필요합니다/);
  assert.match(migration, /ai_reports_delete_owner/);
  assert.match(migration, /for delete/);
  assert.doesNotMatch(route, /[�]/);
  assert.doesNotMatch(route, /[筌揶疫]/);
});

test("AI report UI provides safe share, export, and delete controls", () => {
  const page = read("src/app/(dashboard)/ai-report/page.tsx");
  const actions = read("src/app/(dashboard)/ai-report/report-actions.tsx");
  const button = read("src/app/(dashboard)/ai-report/generate-report-button.tsx");

  assert.match(page, /ReportActions/);
  assert.match(page, /원문 제외/);
  assert.match(actions, /navigator\.clipboard\.writeText/);
  assert.match(actions, /Blob/);
  assert.match(actions, /application\/json/);
  assert.match(actions, /method: "DELETE"/);
  assert.match(button, /외부 AI API로 전송/);
  assert.match(button, /저장된 리포트/);
  assert.doesNotMatch(page, /[�]/);
  assert.doesNotMatch(page, /[筌揶疫]/);
  assert.doesNotMatch(button, /[�]/);
  assert.doesNotMatch(button, /[筌揶疫]/);
});

