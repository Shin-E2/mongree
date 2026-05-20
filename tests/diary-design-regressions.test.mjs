import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");

test("personal and public diary cards use the same feed card component", () => {
  const personalCard = read(
    "src/components/home/(dashboard)/diary/list/diary-card/index.tsx"
  );
  const publicCard = read(
    "src/components/home/(dashboard)/community/diary-card/index.tsx"
  );

  assert.match(personalCard, /DiaryFeedCard/);
  assert.match(publicCard, /DiaryFeedCard/);
  assert.equal(
    fs.existsSync(path.join(root, "src/commons/components/diary-feed-card/index.tsx")),
    true
  );
});

test("filter dropdown layers stay below the global dashboard header", () => {
  const filterStyles = read("src/commons/components/filter-dropdown/styles.module.css");
  const topbarStyles = read(
    "src/components/layout/topbar/styles.module.css"
  );

  assert.match(topbarStyles, /z-index:\s*70/);
  assert.match(filterStyles, /z-index:\s*20/);
  assert.match(filterStyles, /z-index:\s*30/);
  assert.doesNotMatch(filterStyles, /z-50/);
});

test("diary write step uses fixed textarea and Space or Enter tag chips", () => {
  const component = read(
    "src/components/home/(dashboard)/diary/new/step-write-diary/index.tsx"
  );
  const styles = read(
    "src/components/home/(dashboard)/diary/new/step-write-diary/styles.module.css"
  );

  assert.match(styles, /resize-none/);
  assert.doesNotMatch(styles, /resize-y/);
  assert.match(component, /handleTagKeyDown/);
  assert.match(component, /event\.key === "Enter"/);
  assert.match(component, /event\.key === " "/);
  assert.match(component, /tagChip/);
  assert.doesNotMatch(component, /쉼표로 구분/);
});

test("diary creation falls back when deployed database is missing the RPC", () => {
  const action = read("src/app/(dashboard)/diary/new/action.ts");

  assert.match(action, /isMissingCreateDiaryRpc/);
  assert.match(action, /createDiaryWithoutRpc/);
  assert.match(action, /Could not find the function/);
  assert.match(action, /\.from\("diaries"\)\s*\.insert/);
  assert.match(action, /\.from\("diary_images"\)\s*\.insert/);
});

test("profile page exposes private and public diary management actions", () => {
  const action = read("src/app/(dashboard)/profile/action.ts");
  const client = read("src/app/(dashboard)/profile/profile-settings-client.tsx");

  assert.match(action, /deleteProfileDiaries/);
  assert.match(action, /makePublicDiariesPrivate/);
  assert.match(action, /ProfileDiaryItem/);
  assert.match(client, /내 일기 관리/);
  assert.match(client, /비공개 일기 삭제/);
  assert.match(client, /공개 일기 삭제/);
  assert.match(client, /모든 일기 삭제/);
  assert.match(client, /공개 일기 비공개 전환/);
});
