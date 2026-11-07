/** The only published page; legacy routes are redirected to the home page. */
export interface Route {
  path: string
  file: string
  title?: string
  description?: string
  published?: string
  section?: string
}

export const routes: Route[] = [{ path: '/', file: 'index.html' }]

export function normalizePath(pathname: string): string {
  const p = pathname.replace(/\.html$/, '').replace(/\/+$/, '')
  return p === '' || p === '/index' ? '/' : p
}
