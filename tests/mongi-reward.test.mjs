import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));

// 회귀: 일기 작성 보상이 mongi_profiles 에 쓰이는데, DB 쓰기가 실패해도
// reward.ts 가 에러를 무시하고 xpGained 를 반환하면 일기 화면엔 포인트가 뜨지만
// /mongi 에는 0 으로 보이는 무음 실패가 발생한다. (2026-06-04 실사고)
test("Mongi diary reward surfaces DB write failures instead of swallowing them", () => {
  const rewardPath = "src/lib/mongi/reward.ts";
  assert.equal(exists(rewardPath), true);

  const reward = read(rewardPath);

  // 조회 에러를 캡처하고 표면화한다
  assert.match(reward, /error:\s*selectError/);
  assert.match(reward, /몽이 보상 조회 실패/);

  // update / insert 에러를 캡처하고 throw 한다
  assert.match(reward, /error:\s*updateError/);
  assert.match(reward, /몽이 보상 갱신 실패/);
  assert.match(reward, /error:\s*insertError/);
  assert.match(reward, /몽이 보상 생성 실패/);

  // 보상 함수는 여전히 일기당 XP 와 cloud_points 를 기록한다
  assert.match(reward, /last_rewarded_diary_date/);
  assert.match(reward, /cloud_points/);
});

// 회귀: reward 쓰기와 /api/mongi/profile 읽기가 참조하는 컬럼이
// 마이그레이션에 선언돼 있어야 fresh DB(`supabase db push`)에 누락되지 않는다.
// 프로덕션에서 이 두 마이그레이션이 미적용되어 컬럼이 없자 모든 쓰기/읽기가
// 무음 실패하고 포인트가 0 으로 보였다. (2026-06-04 근본 원인)
test("Mongi point columns are declared by migrations", () => {
  const cloudPointsMigration =
    "supabase/migrations/20260524000000_shop_and_cloud_points.sql";
  const multiSlotMigration =
    "supabase/migrations/20260525000000_multi_slot_equip.sql";

  assert.equal(exists(cloudPointsMigration), true);
  assert.equal(exists(multiSlotMigration), true);

  const cloudPoints = read(cloudPointsMigration);
  const multiSlot = read(multiSlotMigration);

  // cloud_points 컬럼 추가
  assert.match(
    cloudPoints,
    /alter table public\.mongi_profiles[\s\S]*?add column if not exists cloud_points/
  );

  // 슬롯별 장착 컬럼 추가 (profile route 가 select 하는 컬럼들)
  assert.match(multiSlot, /add column if not exists equipped_head_id/);
  assert.match(multiSlot, /add column if not exists equipped_neck_id/);
  assert.match(multiSlot, /add column if not exists equipped_body_id/);
  assert.match(multiSlot, /add column if not exists equipped_face_id/);
});

// 회귀: /api/mongi/profile 이 select 하는 컬럼 집합과 reward 가 쓰는 컬럼이
// 실제 코드에 존재해야 한다.
test("Mongi profile API reads the point and equip columns", () => {
  const profileRoutePath = "src/app/api/mongi/profile/route.ts";
  assert.equal(exists(profileRoutePath), true);

  const profileRoute = read(profileRoutePath);

  assert.match(profileRoute, /cloud_points/);
  assert.match(profileRoute, /equipped_head_id/);
  assert.match(profileRoute, /equipped_neck_id/);
  assert.match(profileRoute, /equipped_body_id/);
  assert.match(profileRoute, /equipped_face_id/);
  assert.match(profileRoute, /cloudPoints:\s*mongi\?\.cloud_points/);
});
