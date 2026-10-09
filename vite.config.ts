import { existsSync } from 'node:fs'
import path from 'node:path'
import preact from '@preact/preset-vite'
import { defineConfig, type Plugin } from 'vite'

// Vercel serves /research from research.html (cleanUrls). `vite preview` does not, so do the same here.
const cleanUrlsInPreview = (): Plugin => ({
  name: 'clean-urls-in-preview',
  configurePreviewServer(server) {
    server.middlewares.use((req, _res, next) => {
      const [pathname, query = ''] = (req.url ?? '').split('?')
      const clean = pathname.replace(/\/$/, '')
      if (clean && !path.extname(clean) && existsSync(path.resolve('dist', `.${clean}.html`))) {
        req.url = `${clean}.html${query ? `?${query}` : ''}`
      }
      next()
    })
  },
})

export default defineConfig({
  plugins: [preact(), cleanUrlsInPreview()],
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    port: 5173,
  },
})
