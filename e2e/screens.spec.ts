import { test, expect, type Page } from "@playwright/test";

const NODE = "report_2026-05-14_0556";
const PYTHON = "report_2026-05-11_143026";

async function useLightTheme(page: Page) {
  await page.addInitScript(() => localStorage.setItem("theme", "light"));
}

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

test.describe("Report and comparison screens", () => {
  test("the report explains a metric in a panel", async ({ page }) => {
    await page.goto(`/report/${NODE}`);
    await page.getByRole("button", { name: "Saiba mais sobre CC Média" }).click();
    const panel = page.getByRole("dialog", { name: "Complexidade ciclomática" });
    await expect(panel).toBeVisible();
    await expect(panel.getByText("A · Simples")).toBeVisible();
  });

  test("the report charts take their colors from the theme tokens", async ({ page }) => {
    await page.goto(`/report/${NODE}`);
    const bars = page.locator(".recharts-bar-rectangle path");
    await bars.first().waitFor();
    const fills = await bars.evaluateAll((paths) => paths.map((p) => p.getAttribute("fill")));
    expect(fills.length).toBeGreaterThan(0);
    for (const fill of fills) expect(fill).toMatch(/^var\(--/);
  });

  test("the report follows the light theme", async ({ page }) => {
    await useLightTheme(page);
    await page.goto(`/report/${PYTHON}`);
    await expect(page.locator("html")).not.toHaveClass(/dark/);
    // Reads the painted color through a canvas, whatever color syntax the browser reports.
    const luminance = await page.evaluate(() => {
      const context = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!;
      context.fillStyle = getComputedStyle(document.body).backgroundColor;
      context.fillRect(0, 0, 1, 1);
      const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
      return (r + g + b) / (3 * 255);
    });
    // The light background is almost white; the dark one is close to black.
    expect(luminance).toBeGreaterThan(0.9);
  });

  test("the comparison shows both reports and their change", async ({ page }) => {
    await page.goto(`/compare?a=${PYTHON}&b=${NODE}`);
    await expect(page.getByRole("heading", { level: 1, name: "Comparativo" })).toBeVisible();
    const sides = page.getByRole("region", { name: "Relatórios comparados" });
    await expect(sides.getByText("python-fastapi-boilerplate")).toBeVisible();
    await expect(sides.getByText("node-fastify-boilerplate")).toBeVisible();
    await expect(page.getByRole("region", { name: "Resumo" }).getByText("↑ 4.5%")).toBeVisible();
    await expect(page.getByRole("region", { name: "Diff por arquivo" })).toBeVisible();
  });

  for (const [name, path] of [
    ["dashboard", "/dashboard"],
    ["report", `/report/${PYTHON}`],
    ["comparison", `/compare?a=${PYTHON}&b=${NODE}`],
  ] as const) {
    test(`the ${name} has no horizontal scroll on a 375px screen`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 800 });
      await page.goto(path);
      await expect(page.getByRole("banner")).toBeVisible();
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
    });
  }
});

test.describe("Chart export", () => {
  async function download(page: Page, name: RegExp) {
    const [file] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name }).click(),
    ]);
    return file;
  }

  async function pngStats(path: string) {
    const fs = await import("node:fs");
    const bytes = fs.readFileSync(path);
    return { signature: bytes.subarray(0, 8).toString("hex"), size: bytes.length };
  }

  for (const theme of ["dark", "light"] as const) {
    test(`downloads a ${theme} theme chart as a real PNG, not a blank image`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
      await page.goto(`/report/${NODE}`);
      await page.locator(".recharts-bar-rectangle path").first().waitFor();

      const file = await download(page, /Exportar PNG: Cobertura de testes/);
      expect(file.suggestedFilename()).toBe("node-fastify-boilerplate-cobertura-de-testes.png");

      const path = await file.path();
      const { signature, size } = await pngStats(path);
      expect(signature).toBe("89504e470d0a1a0a");
      expect(size).toBeGreaterThan(8_000);

      // The image must contain the chart colors, so the CSS variables were resolved.
      const colors = await page.evaluate(async (dataUrl) => {
        const image = new Image();
        image.src = dataUrl;
        await image.decode();
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext("2d", { willReadFrequently: true })!;
        context.drawImage(image, 0, 0);
        const data = context.getImageData(0, 0, image.width, image.height).data;
        const seen = new Set<string>();
        for (let i = 0; i < data.length; i += 4 * 97) {
          seen.add(`${data[i] >> 4},${data[i + 1] >> 4},${data[i + 2] >> 4}`);
        }
        const background = `${data[0] >> 4},${data[1] >> 4},${data[2] >> 4}`;
        return { distinct: seen.size, background, width: image.width };
      }, "data:image/png;base64," + (await import("node:fs")).readFileSync(path).toString("base64"));
      expect(colors.distinct).toBeGreaterThan(4);
      expect(colors.width).toBeGreaterThan(800); // 2x of a ~500px chart
      if (theme === "dark") expect(colors.background.split(",").every((c) => Number(c) < 4)).toBeTruthy();
      else expect(colors.background.split(",").every((c) => Number(c) > 12)).toBeTruthy();
    });
  }

  test("exports a chart of the comparison", async ({ page }) => {
    await page.goto(`/compare?a=${PYTHON}&b=${NODE}`);
    const file = await download(page, /Exportar PNG: node-fastify-boilerplate · CC/);
    expect(file.suggestedFilename()).toBe("node-fastify-boilerplate-cc.png");
  });
});
