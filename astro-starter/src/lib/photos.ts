import type { ImageMetadata } from "astro";

// Eagerly map every extracted photo → its optimized ImageMetadata, keyed by
// filename stem (e.g. "photo-89cf5da0"). Components look photos up by key so
// site.ts can reference them as plain strings.
const files = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/photos/*.jpg",
  { eager: true }
);

export const photos: Record<string, ImageMetadata> = {};
for (const path in files) {
  const key = path.split("/").pop()!.replace(".jpg", "");
  photos[key] = files[path].default;
}

export function photo(key: string): ImageMetadata {
  const p = photos[key];
  if (!p) throw new Error(`Unknown photo "${key}". Have: ${Object.keys(photos).join(", ")}`);
  return p;
}
