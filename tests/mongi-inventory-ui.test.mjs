import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));

test("profile page exposes Mongi inventory UI", () => {
  const page = read("src/app/(dashboard)/profile/page.tsx");
  const styles = read("src/app/(dashboard)/profile/styles.module.css");
  const componentPath = "src/app/(dashboard)/profile/mongi-inventory-client.tsx";

  assert.equal(exists(componentPath), true);

  const component = read(componentPath);

  assert.match(page, /MongiInventoryClient/);
  assert.match(component, /몽이 꾸미기/);
  assert.match(component, /\/api\/mongi\/inventory/);
  assert.match(component, /\/api\/mongi\/equip/);
  assert.match(component, /장착/);
  assert.match(component, /장착 중/);
  assert.match(component, /보유 아이템/);
  assert.match(styles, /\.inventoryPanel/);
  assert.match(styles, /\.inventoryGrid/);
  assert.match(styles, /\.inventoryItemEquipped/);
});

test("layout Mongi character opens dedicated Mongi page", () => {
  const layoutCharacter = read("src/components/layout/scene-character/index.tsx");
  const globalUrl = read("src/commons/constants/global-url.ts");
  const profileComponent = read(
    "src/app/(dashboard)/profile/mongi-inventory-client.tsx"
  );
  const mongiPagePath = "src/app/(dashboard)/mongi/page.tsx";
  const middleware = read("middleware.ts");

  assert.equal(exists(mongiPagePath), true);
  assert.match(profileComponent, /id="mongi-customize"/);
  assert.match(read(mongiPagePath), /MongiInventoryClient/);
  assert.match(read(mongiPagePath), /몽이 꾸미기/);
  assert.match(middleware, /"\/mongi"/);
  assert.match(globalUrl, /MONGI: `\/mongi`/);
  assert.match(layoutCharacter, /href={URL\(\)\.MONGI}/);
  assert.match(layoutCharacter, /aria-label="몽이 꾸미기"/);
  assert.doesNotMatch(layoutCharacter, /href={URL\(\)\.PROFILE}/);
});
