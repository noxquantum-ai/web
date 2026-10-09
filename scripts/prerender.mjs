// Post-build step. For every route it renders the app to static HTML, gives the page its own
// title and preview tags, inlines the stylesheet (one less render-blocking request) and preloads
// the single font file the page uses. Crawlers, link previews and no-JS visitors get full content.
import { readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const dist = path.join(root, 'dist')

// Absolute URLs (canonical, Open Graph image, sitemap) must point at the host that is actually serving the
// site, or link previews (WhatsApp, Slack, X) cannot fetch the image. On Vercel that comes from the build
// environment: the production domain (a custom domain once one is attached) or this deployment's URL.
// SITE_URL overrides it; with neither, it falls back to the intended domain.
const DEFAULT_SITE = 'https://noxquantum.com'
const vercelHost =
  process.env.VERCEL_ENV === 'production'
    ? process.env.VERCEL_PROJECT_PRODUCTION_URL
    : process.env.VERCEL_URL
const SITE = (
  process.env.SITE_URL || (vercelHost ? `https://${vercelHost}` : DEFAULT_SITE)
).replace(/\/$/, '')

const { render, routes } = await import(
  pathToFileURL(path.join(root, 'dist-server', 'entry-server.js')).href
)
const template = (await readFile(path.join(dist, 'index.html'), 'utf8')).replaceAll(
  DEFAULT_SITE,
  SITE,
)
if (!template.includes('<!--app-html-->')) throw new Error('Placeholder missing in dist/index.html')

// Stylesheet and font are the same for every page.
const sheet = template.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/)
const css = sheet ? await readFile(path.join(dist, sheet[1]), 'utf8') : ''
const assets = await readdir(path.join(dist, 'assets'))
const font = assets.find((f) => /^inter-latin-wght-normal-.*\.woff2$/.test(f))

const setContent = (html, pattern, value) => {
  const next = html.replace(pattern, (_, a, b) => `${a}${value}${b}`)
  if (next === html && !html.includes(value)) throw new Error(`Tag not found: ${pattern}`)
  return next
}

function withMeta(html, route) {
  if (!route.title) return html
  const url = SITE + route.path
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${route.title}</title>`)
  html = setContent(html, /(<meta\s+name="description"\s+content=")[^"]*(")/, route.description)
  html = setContent(html, /(<link\s+rel="canonical"\s+href=")[^"]*(")/, url)
  html = setContent(html, /(<meta\s+property="og:title"\s+content=")[^"]*(")/, route.title)
  html = setContent(
    html,
    /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
    route.description,
  )
  html = setContent(html, /(<meta\s+property="og:url"\s+content=")[^"]*(")/, url)
  html = setContent(html, /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/, route.title)
  html = setContent(
    html,
    /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/,
    route.description,
  )
  return html
}

for (const route of routes) {
  let html = withMeta(template, route).replace('<!--app-html-->', render(route.path))
  if (sheet) html = html.replace(sheet[0], `<style>${css}</style>`)
  if (font) {
    const tag = `<link rel="preload" href="/assets/${font}" as="font" type="font/woff2" crossorigin />`
    html = html.replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" />\n    ${tag}`)
  }
  await writeFile(path.join(dist, route.file), html)
  console.log(`Pre-rendered ${route.file} (${route.path})`)
}

// Sitemap and robots.txt name the host too, so they are written here instead of kept as static files.
const urls = [...routes.map((r) => r.path), '/privacy']
await writeFile(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${SITE}${u === '/' ? '/' : u}</loc></url>`)
    .join('\n')}\n</urlset>\n`,
)
await writeFile(
  path.join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`,
)
console.log(`Site URL: ${SITE}`)

if (sheet) await rm(path.join(dist, sheet[1]))
await rm(path.join(root, 'dist-server'), { recursive: true, force: true })
