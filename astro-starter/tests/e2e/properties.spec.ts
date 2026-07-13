import { test, expect } from "@playwright/test";
import fc from "fast-check";

/**
 * Property-based layout invariants: fast-check samples viewport widths across
 * the whole phone→desktop range and asserts rules that must hold at EVERY
 * width, not just the two we eyeball. Seeded for reproducible runs.
 */

const WIDTHS = fc.integer({ min: 320, max: 1920 });
const RUNS = { numRuns: 10, seed: 4242 };

test("no horizontal overflow at any viewport width", async ({ page }) => {
  await page.goto("/");
  await fc.assert(
    fc.asyncProperty(WIDTHS, async (width) => {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(120);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow, `overflow at ${width}px`).toBeLessThanOrEqual(0);
    }),
    RUNS
  );
});

test("cards stay rounded and inside the 1280px container at any width", async ({ page }) => {
  await page.goto("/");
  await fc.assert(
    fc.asyncProperty(WIDTHS, async (width) => {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(120);
      const result = await page.evaluate(() => {
        const cards = [...document.querySelectorAll<HTMLElement>("main .card")];
        const minRadius = Math.min(
          ...cards.map((c) => parseFloat(getComputedStyle(c).borderRadius))
        );
        const container = document.querySelector<HTMLElement>(".container")!;
        return { cardCount: cards.length, minRadius, containerWidth: container.offsetWidth };
      });
      expect(result.cardCount).toBeGreaterThan(10);
      expect(result.minRadius, `card radius at ${width}px`).toBeGreaterThanOrEqual(12);
      expect(result.containerWidth, `container at ${width}px`).toBeLessThanOrEqual(1280);
    }),
    RUNS
  );
});

test("section titles obey the fluid type clamp at any width", async ({ page }) => {
  await page.goto("/");
  // clamp(2.2rem, 3vw + 1.2rem, 3.4rem) → 35.2px … 54.4px
  await fc.assert(
    fc.asyncProperty(WIDTHS, async (width) => {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(120);
      const sizes = await page.evaluate(() =>
        [...document.querySelectorAll(".sh .title")].map((el) =>
          parseFloat(getComputedStyle(el).fontSize)
        )
      );
      for (const size of sizes) {
        expect(size, `title size at ${width}px`).toBeGreaterThanOrEqual(35.2 - 0.5);
        expect(size, `title size at ${width}px`).toBeLessThanOrEqual(54.4 + 0.5);
      }
    }),
    RUNS
  );
});

test("photo grid is 2-up on phones, 3-up on desktop", async ({ page }) => {
  await page.goto("/");
  const tilesPerRow = async () => {
    return page.evaluate(() => {
      const tiles = [...document.querySelectorAll<HTMLElement>(".mosaic .tile")];
      const firstTop = tiles[0].getBoundingClientRect().top;
      return tiles.filter((t) => Math.abs(t.getBoundingClientRect().top - firstTop) < 2).length;
    });
  };
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(120);
  expect(await tilesPerRow()).toBe(2);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(120);
  expect(await tilesPerRow()).toBe(3);
});
