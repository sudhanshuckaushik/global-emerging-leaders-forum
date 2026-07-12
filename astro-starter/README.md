# Studio Site Starter — Astro + Brand Kit + Sveltia CMS

A reproducible template for building client sites in the **Global Emerging
Leaders Forum** visual language. One design system, swappable per client,
with a git-based CMS so clients publish blog posts themselves.

## The three layers (why this is reproducible)

| Layer | Files | Who changes it |
|-------|-------|----------------|
| **Design tokens** | `brand-kit/`, `src/styles/tokens.css` | You, once per brand |
| **Components** | `src/components/`, `src/layouts/` | You, rarely — improves all sites |
| **Content** | `src/data/site.ts`, `src/content/blog/*.md` | You + the client |

To reskin for a new client: swap `brand-kit/`, re-derive `tokens.css`, edit
`src/data/site.ts`. The components don't change.

## The brand kit is the source of truth

`brand-kit/` is copied verbatim from the branding tool's export.
`src/styles/tokens.css` is *derived* from `brand-kit/tokens.json`, and
`GradientBackground.astro` imports `brand-kit/shaders/linear-gradient.frag`
directly. Sacred rules (duotone imagery, locked type ratios, brand colors)
live in `brand-kit/llms.txt`.

## Commands

```bash
npm install       # install Astro
npm run dev        # local dev at http://localhost:4321
npm run build      # static build → dist/
npm run preview    # preview the production build
```

## Blog / CMS

- Posts are Markdown in `src/content/blog/`, validated by the Zod schema in
  `src/content/config.ts`.
- Clients edit at **`/admin`** (Sveltia CMS). On save it commits Markdown to
  the repo; the host (Vercel/Netlify) rebuilds and redeploys automatically.
- Before going live: set `backend.repo` in `public/admin/config.yml` to the
  client's GitHub repo and enable a GitHub auth path (GitHub OAuth app, or a
  proxy) so editors can log in.

## New client in 3 steps

```bash
npx degit your-studio/site-starter clients/acme
# 1. edit brand-kit/ + src/styles/tokens.css   (identity)
# 2. edit src/data/site.ts                       (words)
# 3. set repo in public/admin/config.yml, deploy (Vercel)
```
