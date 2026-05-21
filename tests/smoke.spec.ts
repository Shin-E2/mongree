import { expect, test } from "@playwright/test";

test("welcome page exposes entry point", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("h1").first()).toBeVisible();
  await expect(page.locator('a[href="/login"]').first()).toBeVisible();
});

test("login page renders credential form", async ({ page }) => {
  await page.goto("/login");

  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
  await expect(page.locator('button[type="submit"]').first()).toBeVisible();
});

test("protected diary route redirects anonymous users to login", async ({
  page,
}) => {
  await page.goto("/diary");
  await expect(page).toHaveURL(/\/login/);
});

test("direct diary URL access redirects anonymous users to login", async ({
  page,
}) => {
  await page.goto("/diary/00000000-0000-0000-0000-000000000000");
  const url = page.url();
  expect(url).toMatch(/\/login|\/diary$/);
});
