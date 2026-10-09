// Injects the server-rendered app into dist/index.html so crawlers, link previews
// and no-JS visitors get the full content. Run after both vite builds.
import { readFile, rm, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const htmlPath = path.join(root, 'dist', 'index.html')
const serverEntry = path.join(root, 'dist-server', 'entry-server.js')

const { render } = await import(pathToFileURL(serverEntry).href)
const template = await readFile(htmlPath, 'utf8')
if (!template.includes('<!--app-html-->')) throw new Error('Placeholder missing in dist/index.html')

await writeFile(htmlPath, template.replace('<!--app-html-->', render()))
await rm(path.join(root, 'dist-server'), { recursive: true, force: true })
console.log('Pre-rendered dist/index.html')
