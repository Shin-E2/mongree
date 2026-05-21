import { test, expect } from "@playwright/test";

test.describe("인증 보호", () => {
  test("미인증 사용자는 대시보드 홈 진입 시 로그인 페이지로 redirect", async ({ page }) => {
    await page.goto("/home");
    await expect(page).toHaveURL(/\/login/);
  });

  test("미인증 사용자는 일기 목록 진입 시 로그인 페이지로 redirect", async ({ page }) => {
    await page.goto("/diary");
    await expect(page).toHaveURL(/\/login/);
  });

  test("미인증 사용자는 AI 리포트 진입 시 로그인 페이지로 redirect", async ({ page }) => {
    await page.goto("/ai-report");
    await expect(page).toHaveURL(/\/login/);
  });

  test("미인증 사용자는 감정 캘린더 진입 시 로그인 페이지로 redirect", async ({ page }) => {
    await page.goto("/calendar");
    await expect(page).toHaveURL(/\/login/);
  });

  test("미인증 사용자는 개별 일기 URL로 직접 접근 시 로그인 페이지로 redirect", async ({ page }) => {
    await page.goto("/diary/00000000-0000-0000-0000-000000000000");
    await expect(page).toHaveURL(/\/login/);
  });
});
