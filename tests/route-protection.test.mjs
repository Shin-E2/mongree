import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");

test("middleware protects actual dashboard route-group URLs", () => {
  const middleware = read("middleware.ts");

  for (const route of [
    "/home",
    "/diary",
    "/calendar",
    "/statistics",
    "/community",
    "/ai-report",
    "/profile",
  ]) {
    assert.match(middleware, new RegExp(`\"${route}\"`));
  }

  assert.match(middleware, /protectedRoutes\.some/);
  assert.match(middleware, /request\.nextUrl\.pathname === route/);
  assert.match(middleware, /request\.nextUrl\.pathname\.startsWith\(`\$\{route\}\/`\)/);
  assert.doesNotMatch(middleware, /startsWith\("\/dashboard"\)/);
});

