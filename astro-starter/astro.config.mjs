// @ts-check
import { defineConfig } from 'astro/config';

// One config, reused by every client site.
// Set `site` per client (used for sitemaps, canonical URLs, OG tags).
export default defineConfig({
  site: 'https://gelfd-forum.vercel.app',
  // Static output — no server needed. Perfect for a git-based CMS
  // where every published post triggers a rebuild + redeploy.
  output: 'static',
});
