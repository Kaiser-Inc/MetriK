import { test, expect } from "@playwright/test";

test.describe("Dashboard — report list", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
  });

  test("page loads with MetriK branding and the report heading", async ({ page }) => {
    await expect(page.getByRole("banner").getByRole("link", { name: "MetriK" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1, name: /Relatórios/ })).toBeVisible();
  });

  test("stack filter bar renders all buttons", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Todas" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Python" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Node" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Ruby" })).toBeVisible();
  });

  test("lists one row per stack", async ({ page }) => {
    const table = page.getByRole("table");
    await expect(table.getByRole("row")).toHaveCount(4);
    await expect(table.getByRole("cell", { name: "Python", exact: true })).toBeVisible();
    await expect(table.getByRole("cell", { name: "Node", exact: true })).toBeVisible();
    await expect(table.getByRole("cell", { name: "Ruby", exact: true })).toBeVisible();
  });

  test("filter Node shows only Node rows and the filtered fraction", async ({ page }) => {
    await page.getByRole("button", { name: "Node" }).click();
    const table = page.getByRole("table");
    await expect(table.getByRole("row")).toHaveCount(2);
    await expect(table.getByRole("cell", { name: "Node", exact: true })).toBeVisible();
    await expect(table.getByRole("cell", { name: "Python", exact: true })).toHaveCount(0);
    await expect(page.getByText("1 / 3")).toBeVisible();
  });

  test("filter Ruby shows only Ruby rows", async ({ page }) => {
    await page.getByRole("button", { name: "Ruby" }).click();
    const table = page.getByRole("table");
    await expect(table.getByRole("cell", { name: "Ruby", exact: true })).toBeVisible();
    await expect(table.getByRole("cell", { name: "Node", exact: true })).toHaveCount(0);
    await expect(table.getByRole("cell", { name: "Python", exact: true })).toHaveCount(0);
  });

  test("filter Python shows only Python rows", async ({ page }) => {
    await page.getByRole("button", { name: "Python" }).click();
    const table = page.getByRole("table");
    await expect(table.getByRole("cell", { name: "Python", exact: true })).toBeVisible();
    await expect(table.getByRole("cell", { name: "Node", exact: true })).toHaveCount(0);
    await expect(table.getByRole("cell", { name: "Ruby", exact: true })).toHaveCount(0);
  });

  test("Todas resets the filter", async ({ page }) => {
    await page.getByRole("button", { name: "Node" }).click();
    await expect(page.getByRole("table").getByRole("row")).toHaveCount(2);
    await page.getByRole("button", { name: "Todas" }).click();
    await expect(page.getByRole("table").getByRole("row")).toHaveCount(4);
    await expect(page.getByText("1 / 3")).toHaveCount(0);
  });

  test("filter persists on reload via sessionStorage", async ({ page }) => {
    await page.getByRole("button", { name: "Ruby" }).click();
    await expect(page.getByRole("table").getByRole("row")).toHaveCount(2);
    await page.reload();
    await expect(page.getByRole("table").getByRole("row")).toHaveCount(2);
    await expect(page.getByRole("button", { name: "Ruby" })).toHaveAttribute("aria-pressed", "true");
  });

  test("opens a report from its row", async ({ page }) => {
    await page.getByRole("link", { name: "node-fastify-boilerplate" }).click();
    await expect(page).toHaveURL(/\/report\/report_2026-05-14_0556$/);
  });

  test("compares two selected reports", async ({ page }) => {
    await page.getByRole("checkbox", { name: /python-fastapi-boilerplate/ }).click();
    await expect(page.getByText("1 selecionado, escolha mais 1")).toBeVisible();
    await page.getByRole("checkbox", { name: /node-fastify-boilerplate/ }).click();
    await page.getByRole("button", { name: "Ver comparativo" }).click();
    await expect(page).toHaveURL(/\/compare\?a=.+&b=.+/);
  });

  test("opens the help sheet with the multi-stack tutorial", async ({ page }) => {
    await page.getByRole("button", { name: "Como usar" }).click();
    const sheet = page.getByRole("dialog", { name: "Como usar o MetriK" });
    await expect(sheet).toBeVisible();
    await expect(sheet.getByRole("tab", { name: "Ruby on Rails" })).toBeVisible();
  });

  test("switches the whole dashboard to the light theme", async ({ page }) => {
    await expect(page.locator("html")).toHaveClass(/dark/);
    await page.getByRole("combobox", { name: "Tema" }).click();
    await page.getByRole("option", { name: "Claro" }).click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });
});
