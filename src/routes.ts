/** Static routes. The home page's tags live in index.html; other pages override them at build time. */
export interface Route {
  path: string
  file: string
  title?: string
  description?: string
}

export const SITE = 'https://noxquantum.com'

export const routes: Route[] = [
  { path: '/', file: 'index.html' },
  {
    path: '/research',
    file: 'research.html',
    title: 'Research — NoxQuantum',
    description:
      'How NoxQuantum works on compact models: tensor-structured compression, capability-preserving evaluation and low-compute inference, and how we compare methods.',
  },
]

export function normalizePath(pathname: string): string {
  const p = pathname.replace(/\.html$/, '').replace(/\/+$/, '')
  return p === '' || p === '/index' ? '/' : p
}
