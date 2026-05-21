import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));

test("Mongi inventory persistence is modeled with owner-safe policies", () => {
  const migrationPath = "supabase/migrations/20260521043000_mongi_inventory_mvp.sql";

  assert.equal(exists(migrationPath), true);

  const migration = read(migrationPath);

  assert.match(migration, /create table if not exists public\.mongi_items/);
  assert.match(migration, /create table if not exists public\.user_mongi_items/);
  assert.match(migration, /alter table public\.mongi_profiles[\s\S]*?equipped_item_id/);
  assert.match(migration, /mongi_items_select_all/);
  assert.match(migration, /user_mongi_items_select_own/);
  assert.match(migration, /user_mongi_items_insert_own/);
  assert.match(migration, /mongi_default_leaf_hat/);
  assert.match(migration, /mongi_default_scarf/);
});

test("Mongi inventory API returns owned items and equips owned items only", () => {
  const helperPath = "src/lib/mongi/inventory.ts";
  const inventoryRoutePath = "src/app/api/mongi/inventory/route.ts";
  const equipRoutePath = "src/app/api/mongi/equip/route.ts";

  assert.equal(exists(helperPath), true);
  assert.equal(exists(inventoryRoutePath), true);
  assert.equal(exists(equipRoutePath), true);

  const helper = read(helperPath);
  const inventoryRoute = read(inventoryRoutePath);
  const equipRoute = read(equipRoutePath);

  assert.match(helper, /export async function getMongiInventory/);
  assert.match(helper, /export async function equipMongiItem/);
  assert.match(helper, /user_mongi_items/);
  assert.match(helper, /equipped_item_id/);
  assert.match(helper, /보유한 몽이 아이템만 장착할 수 있습니다/);
  assert.match(inventoryRoute, /export async function GET/);
  assert.match(inventoryRoute, /getMongiInventory/);
  assert.match(equipRoute, /export async function POST/);
  assert.match(equipRoute, /equipMongiItem/);
  assert.match(equipRoute, /itemId/);
});

