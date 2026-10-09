# NoxQuantum — website

Research-company landing page for NoxQuantum. Vite + React 19 + TypeScript, pre-rendered to static HTML at build time.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173/
```

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
about 61 KB, of which the JavaScript is 19 KB gzipped. Lighthouse scores 100 on performance,
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

Serving this to millions of people at once comes down to the CDN, not the code. Roughly 61 KB
per first visit is about 0.6 TB for 10 million first visits (repeat visits only refetch the
HTML), so check that your Vercel plan's bandwidth allowance covers a spike, or put a CDN such as
Cloudflare in front. This has not been load-tested against the live deployment.

## Before launch

- The site assumes the domain `https://noxquantum.com`. It appears in `index.html`,
  `public/robots.txt` and `public/sitemap.xml`.
- Confirm `hello@noxquantum.com` receives mail.
- `public/og-image.png` is the social preview (1200×630).
- `src/components/reactbits/` holds components from [React Bits](https://reactbits.dev), used under its MIT + Commons Clause license (see `LICENSE.md` there).
- The hero's base drawing (`paintField` in `visuals.ts`) is intentionally frozen and excluded from Prettier. The cursor spotlight lives in `heroHover.ts`.
