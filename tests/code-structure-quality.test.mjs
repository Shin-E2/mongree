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

test("repository defaults to UTF-8 for Korean text files", () => {
  const editorConfig = read(".editorconfig");
  const gitAttributes = read(".gitattributes");
  const vscodeSettings = JSON.parse(read(".vscode/settings.json"));

  assert.match(editorConfig, /charset\s*=\s*utf-8/);
  assert.match(gitAttributes, /\*\s+text=auto\s+eol=lf/);
  assert.match(gitAttributes, /\*\.tsx\s+text\s+working-tree-encoding=UTF-8/);
  assert.match(gitAttributes, /\*\.css\s+text\s+working-tree-encoding=UTF-8/);
  assert.match(gitAttributes, /\*\.md\s+text\s+working-tree-encoding=UTF-8/);
  assert.equal(vscodeSettings["files.encoding"], "utf8");
});

test("profile images allow existing OAuth and uploaded image hosts", () => {
  const config = read("next.config.ts");

  assert.match(config, /hostname:\s*"\*\*\.googleusercontent\.com"/);
  assert.match(config, /hostname:\s*"avatars\.githubusercontent\.com"/);
  assert.match(config, /hostname:\s*"\*\*\.kakaocdn\.net"/);
  assert.match(config, /protocol:\s*"http"[\s\S]*hostname:\s*"\*\*\.kakaocdn\.net"/);
  assert.match(config, /hostname:\s*"phinf\.pstatic\.net"/);
  assert.match(config, /hostname:\s*"\*\*\.supabase\.co"/);
  assert.match(config, /pathname:\s*"\/storage\/v1\/object\/public\/\*\*"/);
  assert.match(config, /hostname:\s*"\*\*\.s3\.ap-northeast-2\.amazonaws\.com"/);
  assert.doesNotMatch(config, /pathname:\s*"\/users\/\*\*"/);
  assert.match(config, /pathname:\s*"\/\*\*"/);
});

test("dashboard topbar stays functional without duplicating page headers", () => {
  const topbar = read("src/components/layout/topbar/index.tsx");

  assert.match(topbar, /usePageTitle/);
  assert.doesNotMatch(topbar, /Search/);
  assert.doesNotMatch(topbar, /aria-label="일기 검색 열기"/);
  assert.match(topbar, /<strong className=\{styles\.pageTitle\}/);
  assert.match(topbar, /Mongree/);

  const dashboardPages = [
    "src/app/(dashboard)/profile/page.tsx",
    "src/app/(dashboard)/diary/page.tsx",
    "src/app/(dashboard)/community/page.tsx",
    "src/app/(dashboard)/calendar/page.tsx",
    "src/app/(dashboard)/statistics/page.tsx",
    "src/app/(dashboard)/ai-report/page.tsx",
    "src/app/(dashboard)/counselors/page.tsx",
    "src/app/(dashboard)/counselors/[id]/page.tsx",
  ];

  for (const page of dashboardPages) {
    assert.doesNotMatch(read(page), /HeaderStandardMFull/, page);
  }
});

test("search inputs and community controls keep icons readable in current styling", () => {
  const input = read("src/commons/components/input/index.tsx");
  const inputStyles = read("src/commons/components/input/styles.module.css");
  const communityStyles = read(
    "src/components/home/(dashboard)/community/diary-section/styles.module.css"
  );
  const dropdownStyles = read("src/commons/components/filter-dropdown/styles.module.css");

  assert.match(input, /styles\.withLeftIcon/);
  assert.match(inputStyles, /\.withLeftIcon/);
  assert.match(inputStyles, /\.search\.withLeftIcon/);
  assert.match(inputStyles, /padding-left:\s*3rem/);
  assert.doesNotMatch(communityStyles, /bg-white|text-gray-|border-gray-|hover:bg-gray-/);
  assert.match(communityStyles, /var\(--mongree-surface/);
  assert.doesNotMatch(dropdownStyles, /bg-white|shadow-lg/);
  assert.match(dropdownStyles, /var\(--mongree-surface/);
});

test("diary and community feeds share full-width themed surfaces", () => {
  const diaryPage = read("src/app/(dashboard)/diary/page.tsx");
  const diaryStyles = read("src/app/(dashboard)/diary/styles.module.css");
  const communityStyles = read("src/app/(dashboard)/community/styles.module.css");
  const surfaceCard = read("src/commons/components/surface-card/styles.module.css");
  const diaryList = read(
    "src/components/home/(dashboard)/diary/list/diary-section/styles.module.css"
  );
  const communityList = read(
    "src/components/home/(dashboard)/community/diary-list/styles.module.css"
  );
  const emotionFilter = read(
    "src/components/home/(dashboard)/diary/list/emotion-filter/styles.module.css"
  );

  assert.doesNotMatch(diaryPage, /MongiCompanion/);
  assert.doesNotMatch(diaryPage, /URL\(\)\.DIARY_NEW/);
  assert.doesNotMatch(diaryStyles, /bg-gray-50|md:mx-32/);
  assert.doesNotMatch(communityStyles, /md:mx-32/);
  assert.match(diaryStyles, /max-w-\[72rem\]/);
  assert.match(communityStyles, /max-w-\[72rem\]/);
  assert.doesNotMatch(surfaceCard, /::before/);
  assert.match(diaryList, /items-start/);
  assert.match(communityList, /column-count:\s*3/);
  assert.match(communityList, /break-inside:\s*avoid/);
  assert.doesNotMatch(emotionFilter, /bg-white|text-indigo|hover:bg-gray/);
  assert.match(emotionFilter, /var\(--mongree-surface/);
});

test("snow theme is bright and visually distinct from rain", () => {
  const globals = read("src/app/globals.css");

  assert.match(globals, /\[data-theme-scene="snow"\][\s\S]*--scene-bg:\s*oklch\(0\.94/);
  assert.match(globals, /\[data-theme-scene="snow"\][\s\S]*--scene-surface:\s*oklch\(0\.985/);
  assert.match(globals, /\[data-theme-scene="snow"\][\s\S]*--scene-accent:\s*oklch\(0\.76/);
  assert.match(
    read("src/components/theme/weather-scene.module.css"),
    /\.scene\[data-scene="snow"\] \.sun[\s\S]*radial-gradient/
  );
});

test("core dashboard pages use Mongree scene tokens instead of legacy white SaaS styling", () => {
  const files = [
    "src/app/(dashboard)/ai-report/styles.module.css",
    "src/app/(dashboard)/statistics/styles.module.css",
    "src/app/(dashboard)/profile/styles.module.css",
  ];
  const legacyPattern =
    /\b(bg-white|text-gray-\d+|border-gray-\d+|shadow-sm|text-indigo-\d+|bg-indigo-\d+|border-indigo-\d+|hover:bg-indigo-\d+|hover:text-indigo-\d+)\b/;

  for (const file of files) {
    const source = read(file);
    assert.match(source, /var\(--mongree-surface/);
    assert.match(source, /var\(--mongree-text/);
    assert.match(source, /var\(--scene-accent/);
    assert.doesNotMatch(source, legacyPattern, file);
  }
});

test("auth pages and shared form controls use Mongree scene styling", () => {
  const files = [
    "src/components/layout/auth-page-layout/styles.module.css",
    "src/commons/components/card/styles.module.css",
    "src/commons/components/button-text/styles.module.css",
    "src/components/login/form-title/styles.module.css",
    "src/components/login/social-section/styles.module.css",
    "src/components/login/signup-section/styles.module.css",
    "src/app/(auth)/signup/styles.module.css",
    "src/app/(auth)/confirm/styles.module.css",
    "src/app/(auth)/reset-password/page.tsx",
  ];
  const legacyPattern =
    /\b(bg-white|bg-gray-\d+|text-gray-\d+|border-gray-\d+|shadow-sm|text-indigo-\d+|bg-indigo-\d+|hover:bg-indigo-\d+|hover:text-indigo-\d+)\b/;

  for (const file of files) {
    const source = read(file);
    assert.match(source, /mongree|scene/, file);
    assert.doesNotMatch(source, legacyPattern, file);
  }
});

test("counselor pages use readable Korean copy and current Mongree styling", () => {
  const files = [
    "src/app/(dashboard)/counselors/page.tsx",
    "src/app/(dashboard)/counselors/[id]/page.tsx",
    "src/app/(dashboard)/counselors/data.ts",
    "src/app/(dashboard)/counselors/styles.module.css",
  ];
  const legacyPattern =
    /\b(bg-white|bg-gray-\d+|text-gray-\d+|border-gray-\d+|shadow-sm|text-indigo-\d+|bg-indigo-\d+|hover:bg-indigo-\d+|hover:text-indigo-\d+)\b/;
  const mojibakePattern = /[�]|(?:鍮|踰|덊|곷|떞|쒓|媛|遺|筌|占|諛|紐|源|猷|願)/;

  for (const file of files) {
    const source = read(file);
    assert.doesNotMatch(source, mojibakePattern, file);
    assert.doesNotMatch(source, legacyPattern, file);
  }

  assert.match(read("src/app/(dashboard)/counselors/styles.module.css"), /var\(--mongree-surface/);
  assert.ok(
    !fs.existsSync(path.join(root, "src/app/(dashboard)/counselors/[id]/styles.module.css")),
    "unused detail-only counselor styles should be removed"
  );
});

test("dashboard mobile shell reserves space for fixed navigation and companion", () => {
  const layoutStyles = read("src/components/layout/styles.module.css");
  const sidebarStyles = read("src/components/layout/sidebar/styles.module.css");
  const characterStyles = read("src/components/layout/scene-character/styles.module.css");

  assert.match(layoutStyles, /--mobile-nav-reserved-height/);
  assert.match(layoutStyles, /env\(safe-area-inset-bottom\)/);
  assert.match(layoutStyles, /padding-bottom:\s*var\(--mobile-nav-reserved-height\)/);
  assert.match(sidebarStyles, /--mobile-nav-reserved-height/);
  assert.match(sidebarStyles, /bottom:\s*calc\(0\.75rem \+ env\(safe-area-inset-bottom\)\)/);
  assert.match(sidebarStyles, /pointer-events:\s*none/);
  assert.match(sidebarStyles, /linear-gradient\(\s*to top/);
  assert.match(sidebarStyles, /pointer-events:\s*auto/);
  assert.match(
    read("src/components/layout/sidebar/navigation/mobile-navigation/styles.module.css"),
    /background:\s*var\(--scene-nav-bg\)/
  );
  assert.match(characterStyles, /display:\s*none/);
  assert.match(characterStyles, /min-width:\s*640px/);
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
