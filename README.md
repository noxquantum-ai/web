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

## Search

Built in (see `scripts/prerender.mjs`):

- Every page has its own title, description, canonical URL, Open Graph and Twitter tags, and robots
  directives that allow large image previews and full-length snippets.
- Structured data (JSON-LD) per page: an Organization, a WebSite, a WebPage (or an Article with dates for
  `/research`) and a breadcrumb trail. The entities share stable `@id`s, so they reference each other.
- A sitemap with dates, and a robots.txt that points at it. Preview deployments publish no sitemap and are
  disallowed in robots.txt, so search engines only see production.
- Server-rendered content: every page's text and headings exist in the HTML itself, not after JavaScript.

What only you can do, once the domain is live:

1. Add the property `https://noxquantum.com` in [Google Search Console](https://search.google.com/search-console).
   Copy the token from the "HTML tag" option and set it as the `GOOGLE_SITE_VERIFICATION` environment variable in
   Vercel; the next build adds the verification tag. Then submit `https://noxquantum.com/sitemap.xml`.
2. Use the URL Inspection tool on `/` and `/research` and press "Request indexing".
3. Check the [Rich Results Test](https://search.google.com/test/rich-results) on `/research`.
4. Decide on AI crawlers. robots.txt currently allows all crawlers, including AI training crawlers. To opt
   out of model training while staying in search, add `User-agent: Google-Extended` with `Disallow: /`.

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

- **Absolute URLs follow the host.** The canonical URL, Open Graph image, sitemap and robots.txt are written at
  build time (`scripts/prerender.mjs`) from the Vercel environment: the production domain (a custom domain once
  one is attached) or the deployment's own URL. Set `SITE_URL` to override it. Link previews (WhatsApp, Slack, X)
  only show the image if it is served from the address in the tag. Vercel's per-deployment preview links are
  behind a login, so crawlers cannot preview them; share the production domain. Previews are cached, so a new
  link (or the Facebook Sharing Debugger) is needed to refresh one.
- Confirm `hello@noxquantum.com` receives mail.
- `public/og-image.png` is the social preview (1200×630).
