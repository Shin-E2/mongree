import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");

test("diary detail uses the global dashboard topbar and scene surfaces", () => {
  const layoutHook = read("src/components/layout/hook.ts");
  const detailRootStyles = read(
    "src/components/home/(dashboard)/diary/detail/styles.module.css"
  );
  const headerStyles = read(
    "src/components/home/(dashboard)/diary/detail/header/styles.module.css"
  );
  const contentStyles = read(
    "src/components/home/(dashboard)/diary/detail/content-display/styles.module.css"
  );
  const commentStyles = read(
    "src/components/home/(dashboard)/diary/detail/comment-section/styles.module.css"
  );
  const empathyStyles = read(
    "src/components/home/(dashboard)/diary/detail/empathy-section/styles.module.css"
  );

  assert.doesNotMatch(layoutHook, /HIDE_PARTIAL_LAYOUT_PATTERN/);
  assert.doesNotMatch(detailRootStyles, /bg-gray-50/);
  assert.doesNotMatch(commentStyles, /bg-white|border-t/);
  assert.doesNotMatch(empathyStyles, /bg-gray-50|text-indigo|text-gray/);
  assert.match(headerStyles, /var\(--scene-accent\)/);
  assert.match(contentStyles, /radial-gradient/);
  assert.match(commentStyles, /var\(--mongree-surface/);
});

test("diary feeds use the same masonry layout for image and text cards", () => {
  const personalList = read(
    "src/components/home/(dashboard)/diary/list/diary-section/styles.module.css"
  );
  const publicList = read(
    "src/components/home/(dashboard)/community/diary-list/styles.module.css"
  );

  for (const source of [personalList, publicList]) {
    assert.match(source, /column-count:\s*1/);
    assert.match(source, /break-inside:\s*avoid/);
    assert.match(source, /column-count:\s*3/);
    assert.doesNotMatch(source, /grid-cols|bg-white|text-gray/);
  }
});

test("calendar, statistics, and AI report emphasize theme-aware reading areas", () => {
  const calendar = read("src/app/(dashboard)/calendar/styles.module.css");
  const stats = read("src/app/(dashboard)/statistics/styles.module.css");
  const aiReport = read("src/app/(dashboard)/ai-report/styles.module.css");

  assert.match(calendar, /text-shadow/);
  assert.match(calendar, /var\(--scene-accent\)/);
  assert.match(stats, /distributionPanel/);
  assert.match(stats, /grid-template-columns:\s*minmax\(0,\s*0\.95fr\) minmax\(360px,\s*1\.05fr\)/);
  assert.match(aiReport, /generatedReportBody/);
  assert.match(aiReport, /recommendationList/);
  assert.match(aiReport, /max-width:\s*52rem/);
});
