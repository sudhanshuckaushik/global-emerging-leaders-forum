import { test, expect, type Page } from "@playwright/test";

/**
 * Visual regression: full-page snapshots at the two design breakpoints.
 * Deterministic because reducedMotion (playwright.config.ts) freezes the
 * shader (static CSS gradient fallback), reveal transitions, and the ticker.
 * Refresh baselines intentionally with:  npm run test:e2e:update
 */

async function settle(page: Page) {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  // Walk the page so every lazy image decodes before we rasterize
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 80));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForFunction(() =>
    [...document.images].every((img) => img.complete && img.naturalWidth > 0)
  );
  await page.waitForTimeout(400);
}

test("desktop full page", async ({ page }) => {
  await settle(page);
  await expect(page).toHaveScreenshot("home-desktop.png", { fullPage: true });
});

test.describe("mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test("mobile full page", async ({ page }) => {
    await settle(page);
    await expect(page).toHaveScreenshot("home-mobile.png", { fullPage: true });
  });
});

test("themes panel (full-colour shader, no scrim)", async ({ page }) => {
  await settle(page);
  await expect(page.locator("#themes .panel")).toHaveScreenshot("themes-panel.png");
});

test("nominate panel", async ({ page }) => {
  await settle(page);
  await expect(page.locator("#nominate .panel")).toHaveScreenshot("nominate-panel.png");
});
