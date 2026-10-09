// Post-build step: injects the server-rendered app into dist/index.html (so crawlers, link
// previews and no-JS visitors get the full content), inlines the stylesheet (one less
// render-blocking request) and preloads the single font file the page uses.
import { readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const dist = path.join(root, 'dist')
const htmlPath = path.join(dist, 'index.html')
const serverEntry = path.join(root, 'dist-server', 'entry-server.js')

const { render } = await import(pathToFileURL(serverEntry).href)
let html = await readFile(htmlPath, 'utf8')
if (!html.includes('<!--app-html-->')) throw new Error('Placeholder missing in dist/index.html')
html = html.replace('<!--app-html-->', render())

// Inline the stylesheet.
const sheet = html.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/)
if (sheet) {
  const css = await readFile(path.join(dist, sheet[1]), 'utf8')
  html = html.replace(sheet[0], `<style>${css}</style>`)
  await rm(path.join(dist, sheet[1]))
}

// Preload the Latin subset, which covers the whole page; other subsets load only if needed.
const assets = await readdir(path.join(dist, 'assets'))
const font = assets.find((f) => /^manrope-latin-wght-normal-.*\.woff2$/.test(f))
if (font) {
  const tag = `<link rel="preload" href="/assets/${font}" as="font" type="font/woff2" crossorigin />`
  html = html.replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" />\n    ${tag}`)
}

await writeFile(htmlPath, html)
await rm(path.join(root, 'dist-server'), { recursive: true, force: true })
console.log(
  `Pre-rendered dist/index.html${sheet ? ', inlined CSS' : ''}${font ? ', preloaded font' : ''}`,
)
