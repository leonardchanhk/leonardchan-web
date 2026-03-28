import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import { applyCmsOverrides } from './hooks/useCmsOverride'
import App from './App.tsx'

// Load CMS data and apply i18n overrides before rendering
fetch('/cms-data.json')
  .then((res) => res.ok ? res.json() : null)
  .then((data) => {
    if (data?.pages) {
      applyCmsOverrides(data.pages)
    }
  })
  .catch(() => {
    // CMS data not available — use i18n defaults
  })
  .finally(() => {
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
