// Post-build step. For every route it renders the app to static HTML, and gives the page its own title,
// preview tags, robots directives and structured data. It also inlines the stylesheet (one less
// render-blocking request), preloads the single font file, and writes the sitemap and robots.txt.
// Crawlers, link previews and no-JS visitors get the full content.
import { readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const dist = path.join(root, 'dist')

// Absolute URLs (canonical, Open Graph, structured data, sitemap) must point at the host that is actually
// serving the site, or crawlers and link previews cannot fetch them. On Vercel that comes from the build
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
// Only set on the production deployment: a preview should never be indexed, so it gets noindex.
const isProduction = !vercelHost || process.env.VERCEL_ENV === 'production'
const VERIFY = process.env.GOOGLE_SITE_VERIFICATION || ''
const TODAY = new Date().toISOString().slice(0, 10)
console.log(`Site URL: ${SITE}${isProduction ? '' : ' (preview, noindex)'}`)

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

const ROBOTS_INDEX = 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'

/** Schema.org graph for one page. Every entity has a stable @id so pages reference the same organisation. */
function structuredData(route) {
  const url = SITE + route.path
  const org = {
    '@type': 'Organization',
    '@id': `${SITE}/#organization`,
    name: 'NoxQuantum',
    url: `${SITE}/`,
    logo: { '@type': 'ImageObject', url: `${SITE}/icon-192.png`, width: 192, height: 192 },
    image: `${SITE}/og-image.png`,
    email: 'hello@noxquantum.com',
    description:
      'A research company built from Africa developing quantum and quantum-inspired algorithms for hard computational problems, starting with compact AI models.',
    knowsAbout: [
      'Quantum algorithms',
      'Quantum-inspired algorithms',
      'Tensor networks',
      'Model compression',
      'Efficient AI inference',
    ],
    areaServed: 'Worldwide',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hello@noxquantum.com',
      contactType: 'research enquiries',
    },
  }
  const website = {
    '@type': 'WebSite',
    '@id': `${SITE}/#website`,
    url: `${SITE}/`,
    name: 'NoxQuantum',
    description:
      'Quantum and quantum-inspired algorithms for hard computational problems, built from Africa.',
    inLanguage: 'en',
    publisher: { '@id': `${SITE}/#organization` },
  }
  const title = route.title || 'NoxQuantum — Quantum algorithms for AI and beyond'
  const description =
    route.description ||
    'Quantum-inspired algorithms for hard computational problems, starting with compact AI models. Built from Africa.'
  const page = {
    '@type': route.published ? 'Article' : 'WebPage',
    '@id': `${url}#page`,
    url,
    name: title,
    headline: route.published ? title : undefined,
    description,
    inLanguage: 'en',
    isPartOf: { '@id': `${SITE}/#website` },
    about: { '@id': `${SITE}/#organization` },
    primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE}/og-image.png` },
    dateModified: TODAY,
    ...(route.published && {
      datePublished: route.published,
      author: { '@id': `${SITE}/#organization` },
      publisher: { '@id': `${SITE}/#organization` },
    }),
  }
  const graph = [org, website, page]
  if (route.section) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'NoxQuantum', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: route.section, item: url },
      ],
    })
  }
  for (const node of graph)
    for (const k of Object.keys(node)) if (node[k] === undefined) delete node[k]
  return { '@context': 'https://schema.org', '@graph': graph }
}

function withMeta(html, route) {
  const url = SITE + route.path
  if (route.title) {
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${route.title}</title>`)
    html = setContent(html, /(<meta\s+name="description"\s+content=")[^"]*(")/, route.description)
    html = setContent(html, /(<meta\s+property="og:title"\s+content=")[^"]*(")/, route.title)
    html = setContent(
      html,
      /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
      route.description,
    )
    html = setContent(html, /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/, route.title)
    html = setContent(
      html,
      /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/,
      route.description,
    )
  }
  html = setContent(html, /(<link\s+rel="canonical"\s+href=")[^"]*(")/, url)
  html = setContent(html, /(<meta\s+property="og:url"\s+content=")[^"]*(")/, url)

  // Robots: production pages are indexable and get large-preview rules; previews are kept out of search.
  const robots = isProduction ? ROBOTS_INDEX : 'noindex,nofollow'
  html = html.replace(
    '<meta name="theme-color" content="#000000" />',
    `<meta name="robots" content="${robots}" />\n    <meta name="theme-color" content="#000000" />`,
  )

  const data = structuredData(route)
  const script = `<script type="application/ld+json">${JSON.stringify(data)}</script>`
  if (!html.includes('<!--structured-data-->'))
    throw new Error('Structured-data placeholder missing')
  html = html.replace('<!--structured-data-->', script)

  if (VERIFY) {
    html = html.replace(
      '</head>',
      `    <meta name="google-site-verification" content="${VERIFY}" />\n  </head>`,
    )
  }
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

// Sitemap and robots.txt name the host and carry dates, so they are generated here, not kept as static files.
// Previews publish no sitemap: they are not for search.
const pages = [
  ...routes.map((r) => ({ path: r.path, lastmod: r.published || TODAY })),
  { path: '/privacy', lastmod: TODAY },
]
if (isProduction) {
  await writeFile(
    path.join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
      .map(
        (p) =>
          `  <url>\n    <loc>${SITE}${p.path}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n  </url>`,
      )
      .join('\n')}\n</urlset>\n`,
  )
  await writeFile(
    path.join(dist, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`,
  )
} else {
  await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nDisallow: /\n`)
  await rm(path.join(dist, 'sitemap.xml'), { force: true })
}

if (sheet) await rm(path.join(dist, sheet[1]))
await rm(path.join(root, 'dist-server'), { recursive: true, force: true })
