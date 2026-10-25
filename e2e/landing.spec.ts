import { test, expect } from "@playwright/test";

test.describe("Landing", () => {
  test("shows the proposal and sends the visitor to the dashboard", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: "Qualidade de código à vista" }),
    ).toBeVisible();

    await page.getByRole("banner").getByRole("link", { name: "Abrir dashboard" }).click();
    await expect(page).toHaveURL("/dashboard");
  });

  test("jumps to the tutorial from the hero", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("main").getByRole("link", { name: "Como usar" }).first().click();
    await expect(page).toHaveURL(/#como-usar$/);
    await expect(page.getByRole("heading", { level: 2, name: "Como usar" })).toBeInViewport();
  });

  test("opens a FAQ answer", async ({ page }) => {
    await page.goto("/");
    const question = page.getByRole("button", { name: "Como falo com a equipe?" });
    await question.click();
    await expect(page.getByRole("main").getByRole("link", { name: "kaiserinc.tech@gmail.com" })).toBeVisible();
  });

  test("switches to the light theme and remembers it after a reload", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.getByRole("combobox", { name: "Tema" }).click();
    await page.getByRole("option", { name: "Claro" }).click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);

    await page.reload();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
    await expect(page.getByRole("combobox", { name: "Tema" })).toContainText("Claro");
  });

  test("has no horizontal scroll on a 375px screen", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
