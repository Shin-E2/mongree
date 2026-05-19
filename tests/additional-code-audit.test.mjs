import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");

test("signup validates and creates auth user before uploading profile image", () => {
  const source = read("src/components/signup/form-steps/action.ts");
  const validateIndex = source.indexOf("SignupFormSchema.safeParseAsync");
  const signupIndex = source.indexOf("supabase.auth.signUp");
  const uploadIndex = source.indexOf("await uploadImageServer");

  assert.notEqual(validateIndex, -1);
  assert.notEqual(signupIndex, -1);
  assert.notEqual(uploadIndex, -1);
  assert.equal(validateIndex < signupIndex, true);
  assert.equal(signupIndex < uploadIndex, true);
  assert.match(source, /deleteImageFromS3/);
  assert.match(source, /\.from\("profiles"\)[\s\S]*\.update\(\{ profile_image: profileImageUrl \}\)/);
});

test("current profile helper name matches returned data and app imports use it", () => {
  const helper = read("src/lib/get-user.ts");
  assert.match(helper, /export async function getCurrentProfile/);
  assert.match(helper, /export async function getCurrentAuthUser/);
  assert.match(helper, /export const getUser = getCurrentProfile/);

  const srcDir = path.join(root, "src");
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const filePath = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(filePath);
      if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) files.push(filePath);
    }
  };
  walk(srcDir);

  const staleImports = files
    .filter((filePath) => !filePath.endsWith(path.join("lib", "get-user.ts")))
    .filter((filePath) =>
      fs.readFileSync(filePath, "utf8").includes("import { getUser }")
    )
    .map((filePath) => path.relative(root, filePath));

  assert.deepEqual(staleImports, []);
});

test("health route avoids exposing operational readiness unless explicitly authorized", () => {
  const route = read("src/app/api/health/route.ts");
  const script = read("scripts/check-production-health.mjs");

  assert.match(route, /HEALTH_CHECK_SECRET/);
  assert.match(route, /authorization/);
  assert.match(route, /status:\s*401/);
  assert.match(script, /MONGREE_HEALTH_SECRET/);
  assert.match(script, /Authorization/);
});
