import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { site, LOGO_META } from "../../src/data/site";
import { photos, photo } from "../../src/lib/photos";

/**
 * Content-layer invariants. Two real bugs shipped here already:
 *  - a duplicate `location` key shadowed the venue string ("[object Object]"
 *    rendered in the ticker), and
 *  - photo keys in site.ts can silently drift from src/assets/photos/*.
 * These tests pin both classes down.
 */

const referencedPhotoKeys = [
  ...site.mosaic.tiles.map((t) => t.name),
  site.why.heroPhoto.name,
  site.why.statPhoto.name,
];

describe("photo library", () => {
  it("has at least the photos the content references", () => {
    expect(Object.keys(photos).length).toBeGreaterThan(0);
  });

  it("resolves every photo key referenced in site.ts", () => {
    for (const key of referencedPhotoKeys) {
      expect(photos[key], `missing photo asset for key "${key}"`).toBeDefined();
    }
  });

  it("property: photo() succeeds for exactly the known keys", () => {
    fc.assert(
      fc.property(fc.constantFrom(...Object.keys(photos)), (key) => {
        expect(photo(key)).toBeDefined();
      })
    );
    fc.assert(
      fc.property(
        fc.string().filter((s) => !(s in photos)),
        (key) => {
          expect(() => photo(key)).toThrow(/Unknown photo/);
        }
      )
    );
  });
});

describe("site content shape", () => {
  it("top-level display fields are strings (the [object Object] regression)", () => {
    for (const field of ["name", "shortName", "dates", "venue"] as const) {
      expect(typeof site[field], `site.${field} must be a string`).toBe("string");
    }
  });

  it("has no undefined leaves anywhere in the content tree", () => {
    const walk = (value: unknown, path: string) => {
      expect(value, `undefined at site.${path}`).not.toBeUndefined();
      if (value && typeof value === "object") {
        for (const [k, v] of Object.entries(value)) walk(v, path ? `${path}.${k}` : k);
      }
    };
    walk(site, "");
  });

  it("every partner has logo metadata", () => {
    for (const p of site.partners) {
      expect(LOGO_META[p], `LOGO_META missing entry "${p}"`).toBeDefined();
    }
  });

  it("nav links are root-relative", () => {
    for (const item of site.nav) expect(item.href).toMatch(/^\//);
  });

  it("mosaic tiles are unique photos", () => {
    const names = site.mosaic.tiles.map((t) => t.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
