import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem("lfi-intro-seen", "1");
  });
});

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Light for Immigrants" })).toBeVisible();
});

test("services page loads", async ({ page }) => {
  await page.goto("/services");
  await expect(page).toHaveURL(/\/services/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("contact page has form", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.getByText("First name")).toBeVisible({ timeout: 15000 });
});

test("admin login page", async ({ page }) => {
  await page.goto("/admin/login");
  await expect(page.getByRole("heading", { name: "Admin Login" })).toBeVisible();
});
