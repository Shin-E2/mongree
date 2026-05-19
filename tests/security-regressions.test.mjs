import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");

test("upload route requires an authenticated user and scoped UUID object keys", () => {
  const source = read("src/app/api/upload/route.ts");

  assert.match(source, /getCurrentProfile/);
  assert.match(source, /status:\s*401/);
  assert.match(source, /randomUUID/);
  assert.match(source, /users\/\$\{user\.id\}\/uploads/);
  assert.doesNotMatch(source, /Date\.now\(\)-\$\{fileName\}/);
});

test("billing portal derives Stripe customer from the current user's subscription", () => {
  const source = read("src/app/api/billing/portal/route.ts");

  assert.match(source, /\.from\("subscriptions"\)/);
  assert.match(source, /stripe_customer_id/);
  assert.match(source, /\.eq\("user_id", user\.id\)/);
  assert.doesNotMatch(source, /customerId\?:/);
  assert.doesNotMatch(source, /customer:\s*body\.customerId/);
});

test("Supabase SSR middleware refreshes auth cookies for protected routes", () => {
  const source = read("middleware.ts");

  assert.match(source, /createServerClient/);
  assert.match(source, /supabase\.auth\.getUser\(\)/);
  assert.match(source, /request\.cookies\.getAll/);
  assert.match(source, /response\.cookies\.set/);
  assert.match(source, /protectedRoutes/);
  assert.match(source, /"\/home"/);
  assert.match(source, /"\/diary"/);
  assert.match(source, /"\/profile"/);
  assert.match(source, /request\.nextUrl\.pathname === route/);
});

test("profile private fields are split away from publicly readable profiles", () => {
  const migration = read(
    "supabase/migrations/20260519000000_security_hardening.sql"
  );
  const getUser = read("src/lib/get-user.ts");

  assert.match(migration, /create table if not exists public\.profile_private/);
  assert.match(migration, /drop column if exists zone_code/);
  assert.match(migration, /drop policy if exists "profiles_select_public"/);
  assert.match(migration, /profiles_select_visible/);
  assert.match(getUser, /select\("id, nickname, profile_image, created_at, updated_at, is_profile_complete"\)/);
  assert.doesNotMatch(getUser, /select\("\*"\)/);
});

test("diary and community list queries avoid deleted rows and raw PostgREST search injection", () => {
  const diary = read("src/app/(dashboard)/diary/action.ts");
  const community = read("src/app/(dashboard)/community/action.ts");
  const filterHelper = read("src/lib/supabase/filters.ts");

  assert.match(diary, /\.is\("deleted_at", null\)/);
  assert.match(diary, /buildDiarySearchOrFilter/);
  assert.match(community, /escapePostgrestLikePattern/);
  assert.match(filterHelper, /POSTGREST_OR_RESERVED_CHARS = \/\[,\(\)\]\/g/);
  assert.doesNotMatch(diary, /title\.ilike\.\%\$\{searchTerm\}/);
  assert.doesNotMatch(community, /title\.ilike\.\%\$\{keyword\}/);
});

test("diary image sort updates have an owner RLS policy", () => {
  const migration = read(
    "supabase/migrations/20260519000000_security_hardening.sql"
  );

  assert.match(migration, /diary_images_update_owner/);
  assert.match(migration, /for update to authenticated/);
  assert.match(migration, /with check/);
});
