/** Static routes. The home page's tags live in index.html; other pages override them at build time. */
export interface Route {
  path: string
  file: string
  title?: string
  description?: string
  /** Set for articles: the day it was first published (YYYY-MM-DD). */
  published?: string
  /** Shown in breadcrumbs and as the page's section, for article-style pages. */
  section?: string
}

export const routes: Route[] = [
  { path: '/', file: 'index.html' },
  {
    path: '/blog',
    file: 'blog.html',
    title: 'Blog — NoxQuantum',
    description:
      'Technical articles and experimental results on model compression, efficient AI inference and LLM architectures.',
    section: 'Blog',
  },
  {
    path: '/research',
    file: 'research.html',
    title: 'Research — NoxQuantum',
    description:
      'NEC results: 5.485× storage compression, 2.028× structural reduction and gradient-free construction, plus our separate CPU inference prototype.',
    published: '2026-10-25',
    section: 'Research',
  },
]

export function normalizePath(pathname: string): string {
  const p = pathname.replace(/\.html$/, '').replace(/\/+$/, '')
  return p === '' || p === '/index' ? '/' : p
}
