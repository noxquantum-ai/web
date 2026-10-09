import '@fontsource-variable/inter'
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import { normalizePath } from './routes'
import './style.css'

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root element')

const app = (
  <StrictMode>
    <App path={normalizePath(window.location.pathname)} />
  </StrictMode>
)

// The production build ships pre-rendered HTML, so hydrate it; in dev the root is empty.
if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)
