import { test, expect, type Page } from "@playwright/test";

/**
 * Integration contract for the homepage: section order, card counts, the
 * duotone pipeline, nav anchor integrity, the nominate form, and the blog.
 * If a refactor drops a section or breaks the SVG filter, this fails first.
 */

async function scrollThroughPage(page: Page) {
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
}

test("sections render in the intended order", async ({ page }) => {
  await page.goto("/");
  const ids = await page.$$eval("main section[id]", (els) => els.map((e) => e.id));
  expect(ids).toEqual([
    "about",
    "why",
    "who",
    "themes",
    "format",
    "location",
    "outcomes",
    "nominate",
    "contact",
  ]);
});

test("every nav anchor resolves to an element on the page", async ({ page }) => {
  await page.goto("/");
  const hrefs = await page.$$eval("nav a[href*='#']", (as) =>
    as.map((a) => a.getAttribute("href")!)
  );
  expect(hrefs.length).toBeGreaterThan(0);
  for (const href of hrefs) {
    const id = href.split("#")[1];
    await expect(page.locator(`#${id}`), `nav target #${id}`).toHaveCount(1);
  }
});

test("ticker renders composed strings, never [object Object]", async ({ page }) => {
  await page.goto("/");
  const ticker = page.locator(".ticker");
  await expect(ticker).toBeVisible();
  const text = await ticker.innerText();
  expect(text).not.toContain("[object Object]");
  expect(text).toContain("GOA, INDIA");
});

test("hero card carries the floating badge and gradient", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".hero-card .pill-float")).toBeVisible();
  await expect(page.locator(".hero-card .gradient-bg")).toHaveCount(1);
});

test("card inventory matches the content model", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".mosaic .tile")).toHaveCount(8);
  await expect(page.locator("#who .who-card")).toHaveCount(3);
  await expect(page.locator("#themes .theme")).toHaveCount(6);
  await expect(page.locator("#outcomes .out")).toHaveCount(6);
  await expect(page.locator("#location .loc-card")).toHaveCount(2);
  // Exactly two full-width colour panels: Themes and Nominate
  await expect(page.locator("main .panel")).toHaveCount(2);
});

test("all photos load and pass through the duotone filter", async ({ page }) => {
  await page.goto("/");
  await scrollThroughPage(page);
  const imgs = page.locator(".duotone img");
  const count = await imgs.count();
  expect(count).toBeGreaterThanOrEqual(9); // 8 mosaic tiles + why portrait
  for (let i = 0; i < count; i++) {
    const img = imgs.nth(i);
    await expect(img, `image ${i} should load`).toHaveJSProperty("complete", true);
    const loaded = await img.evaluate((el: HTMLImageElement) => el.naturalWidth > 0);
    expect(loaded, `image ${i} naturalWidth`).toBe(true);
    const filter = await img.evaluate((el) => getComputedStyle(el).filter);
    expect(filter, `image ${i} must use the duotone SVG filter`).toContain("duotone-cyan");
  }
});

test("the #duotone-cyan SVG filter definition exists exactly once", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("filter#duotone-cyan")).toHaveCount(1);
});

test("nominate form has the fields the mailto script needs", async ({ page }) => {
  await page.goto("/");
  const form = page.locator("form[data-nominate]");
  await expect(form).toHaveCount(1);
  await expect(form).toHaveAttribute("data-email", /@/);
  for (const name of ["name", "role", "why", "from"]) {
    await expect(form.locator(`[name='${name}']`), `field ${name}`).toHaveCount(1);
  }
  await expect(form.locator("button[type='submit']")).toBeVisible();
});

test("blog index and first post render", async ({ page }) => {
  await page.goto("/blog");
  const firstPost = page.locator("a[href^='/blog/']").first();
  await expect(firstPost).toBeVisible();
  const href = await firstPost.getAttribute("href");
  await page.goto(href!);
  await expect(page.locator("h1").first()).toBeVisible();
});
