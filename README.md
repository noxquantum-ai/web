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

## Before launch

- The site assumes the domain `https://noxquantum.com`. It appears in `index.html`,
  `public/robots.txt` and `public/sitemap.xml`.
- Confirm `hello@noxquantum.com` receives mail.
- `public/og-image.png` is the social preview (1200×630).
- `src/components/reactbits/` holds components from [React Bits](https://reactbits.dev), used under its MIT + Commons Clause license (see `LICENSE.md` there).
- The hero's base drawing (`paintField` in `visuals.ts`) is intentionally frozen and excluded from Prettier. The cursor spotlight lives in `heroHover.ts`.
