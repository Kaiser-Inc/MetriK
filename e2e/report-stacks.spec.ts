import { test, expect } from "@playwright/test";

// Slugs confirmed from data/ directory
const NODE_SLUG = "report_2026-05-14_0556";
const RUBY_SLUG = "report_2026-05-14_025644";
const PYTHON_SLUG = "report_2026-05-11_143026";

test.describe("Report dashboard — stack-aware labels", () => {
  test("Node report shows Biome + pnpm audit labels", async ({ page }) => {
    await page.goto(`/report/${NODE_SLUG}`);
    // Stack badge in header
    await expect(page.locator("text=Node").first()).toBeVisible();
    // Lint section — "Biome" not "Pylint"
    await expect(page.getByText("Biome", { exact: false }).first()).toBeVisible();
    // Security section — "pnpm audit"
    await expect(page.getByText("pnpm audit", { exact: false }).first()).toBeVisible();
    // Pylint word must NOT appear as section label
    await expect(page.getByText("Pylint Score")).not.toBeVisible();
  });

  test("Ruby report shows RuboCop + bundler-audit labels", async ({ page }) => {
    await page.goto(`/report/${RUBY_SLUG}`);
    await expect(page.locator("text=Ruby").first()).toBeVisible();
    await expect(page.getByText("RuboCop", { exact: false }).first()).toBeVisible();
    await expect(page.getByText("bundler-audit", { exact: false }).first()).toBeVisible();
    await expect(page.getByText("Pylint Score")).not.toBeVisible();
  });

  test("Python report shows Pylint + Xenon labels", async ({ page }) => {
    await page.goto(`/report/${PYTHON_SLUG}`);
    await expect(page.locator("text=Python").first()).toBeVisible();
    await expect(page.getByText("Pylint Score")).toBeVisible();
    await expect(page.getByText("Xenon", { exact: false }).first()).toBeVisible();
    await expect(page.getByText("Biome")).not.toBeVisible();
    await expect(page.getByText("RuboCop")).not.toBeVisible();
  });

  test("Node dashboard renders all 6 summary cards", async ({ page }) => {
    await page.goto(`/report/${NODE_SLUG}`);
    await expect(page.getByText("CC Média").first()).toBeVisible();
    await expect(page.getByText("Manutenibilidade").first()).toBeVisible();
    await expect(page.getByText("Cobertura").first()).toBeVisible();
    await expect(page.getByText("Biome Score").first()).toBeVisible();
    await expect(page.getByText("Bugs Estimados").first()).toBeVisible();
    await expect(page.getByText("pnpm audit").first()).toBeVisible();
  });

  test("Ruby dashboard renders all 6 summary cards", async ({ page }) => {
    await page.goto(`/report/${RUBY_SLUG}`);
    await expect(page.getByText("CC Média").first()).toBeVisible();
    await expect(page.getByText("RuboCop Score").first()).toBeVisible();
    await expect(page.getByText("bundler-audit").first()).toBeVisible();
  });

  test("back navigation from report returns to home", async ({ page }) => {
    await page.goto(`/report/${NODE_SLUG}`);
    await page.getByRole("link", { name: /Voltar/ }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("button", { name: "Todas" })).toBeVisible();
  });
});
