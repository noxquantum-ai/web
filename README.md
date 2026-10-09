# NoxQuantum — website

Website for NoxQuantum: a short landing page and a black, article-style `/research` page. Vite + Preact + TypeScript, pre-rendered to static HTML at build time.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173/
```

## Pages

| Route       | What it is                                                                       |
| ----------- | -------------------------------------------------------------------------------- |
| `/`         | Hero, thesis, why Africa and the first problem (compact models)                  |
| `/research` | Long-form: the three research threads, how we work, how we compare, where we are |
| `/privacy`  | Static privacy note                                                              |

Routes are listed in `src/routes.ts`. There is no client-side router: each route is rendered to its
own HTML file at build time (`scripts/prerender.mjs`), with its own title, description and preview
tags, and Vercel serves `/research` from `research.html` (`cleanUrls`). To add a page, add a route,
a component under `src/pages/`, and a case in `src/App.tsx`.

## Check and build

```bash
npm run typecheck
npm run lint
npm run format:check
npm run build    # typecheck, client build, SSR build, then pre-render into dist/
npm run preview
```

Deploys on Vercel as a static site. `vercel.json` sets the build, clean URLs, security headers
(including a strict CSP) and long-lived caching for `/assets`.

## Performance and scale

The site is fully static: no server code, no database, no third-party requests. A first visit
makes five requests (HTML, one script, one font, a manifest and the favicon) and transfers
about 75 KB, of which the JavaScript is under 20 KB gzipped. Lighthouse scores 100 on performance,
accessibility, best practices and SEO, on both mobile and desktop presets.

What keeps it that way:

- Preact instead of React (`react` is aliased to `preact/compat`), and no runtime dependencies
  beyond that.
- The app is pre-rendered, the stylesheet is inlined and the single font file is preloaded
  (`scripts/prerender.mjs`).
- Hashed assets are cached for a year; the HTML is cached at the edge for a day with
  stale-while-revalidate (`vercel.json`).
- Scroll-driven sections only do work while they are near the viewport, and below-the-fold
  sections use `content-visibility`.

Serving this to millions of people at once comes down to the CDN, not the code. Roughly 75 KB
per first visit is about 0.75 TB for 10 million first visits (repeat visits only refetch the
HTML), so check that your Vercel plan's bandwidth allowance covers a spike, or put a CDN such as
Cloudflare in front. This has not been load-tested against the live deployment.

## Before launch

- The site assumes the domain `https://noxquantum.com`. It appears in `index.html`,
  `public/robots.txt` and `public/sitemap.xml`.
- Confirm `hello@noxquantum.com` receives mail.
- `public/og-image.png` is the social preview (1200×630).
