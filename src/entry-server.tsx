import { renderToString } from 'react-dom/server'
import App from './App'

export { routes } from './routes'

export function render(path: string): string {
  return renderToString(<App path={path} />)
}
