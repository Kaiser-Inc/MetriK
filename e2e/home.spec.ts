import { test, expect } from "@playwright/test";

test.describe("Home — report grid", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("page loads with MetriK branding", async ({ page }) => {
    await expect(page.locator("text=MetriK").first()).toBeVisible();
  });

  test("stack filter bar renders all buttons", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Todas" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Python/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Node/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Ruby/ })).toBeVisible();
  });

  test("report cards render with stack badges", async ({ page }) => {
    await expect(page.locator("text=Python").first()).toBeVisible();
    await expect(page.locator("text=Node").first()).toBeVisible();
    await expect(page.locator("text=Ruby").first()).toBeVisible();
  });

  test("filter Node → badge shows filtered fraction (X / Y)", async ({ page }) => {
    await page.getByRole("button", { name: /Node/ }).click();
    // Badge format "X / Y" where X < Y
    await expect(page.locator("text=/ ").first()).toBeVisible();
    // Only Node stack cards visible
    await expect(page.locator("text=Node").first()).toBeVisible();
    await expect(page.locator("text=Python")).not.toBeVisible();
    await expect(page.locator("text=Ruby")).not.toBeVisible();
  });

  test("filter Ruby → only Ruby cards visible", async ({ page }) => {
    await page.getByRole("button", { name: /Ruby/ }).click();
    await expect(page.locator("text=Ruby").first()).toBeVisible();
    await expect(page.locator("text=Python")).not.toBeVisible();
    await expect(page.locator("text=Node")).not.toBeVisible();
  });

  test("filter Python → only Python cards visible", async ({ page }) => {
    await page.getByRole("button", { name: /Python/ }).click();
    await expect(page.locator("text=Python").first()).toBeVisible();
    await expect(page.locator("text=Node")).not.toBeVisible();
    await expect(page.locator("text=Ruby")).not.toBeVisible();
  });

  test("Todas resets filter — all stacks visible again", async ({ page }) => {
    await page.getByRole("button", { name: /Node/ }).click();
    await expect(page.locator("text=Python")).not.toBeVisible();
    await page.getByRole("button", { name: "Todas" }).click();
    await expect(page.locator("text=Python").first()).toBeVisible();
    await expect(page.locator("text=Node").first()).toBeVisible();
    await expect(page.locator("text=Ruby").first()).toBeVisible();
    // Fraction badge gone
    await expect(page.locator("text=/ ")).not.toBeVisible();
  });

  test("filter persists on reload via sessionStorage", async ({ page }) => {
    await page.getByRole("button", { name: /Ruby/ }).click();
    await expect(page.locator("text=Ruby").first()).toBeVisible();
    await expect(page.locator("text=Python")).not.toBeVisible();
    await page.reload();
    // After reload Ruby filter still active
    await expect(page.locator("text=Python")).not.toBeVisible();
    await expect(page.locator("text=Ruby").first()).toBeVisible();
    // cleanup
    await page.getByRole("button", { name: "Todas" }).click();
  });
});
