import { defineConfig } from "@playwright/test";

/**
 * E2E + visual-regression config.
 * Builds the site and serves the production output on :4322 (the dev server
 * conventionally holds :4321), so tests exercise what actually ships.
 * reducedMotion is forced globally: the brand shader falls back to its static
 * CSS gradient and .reveal/.ticker animations freeze — deterministic pixels.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  fullyParallel: true,
  use: {
    baseURL: "http://localhost:4322",
    viewport: { width: 1440, height: 900 },
    contextOptions: { reducedMotion: "reduce" },
  },
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
  },
  webServer: {
    command: "npm run build && npm run preview -- --port 4322",
    url: "http://localhost:4322",
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
