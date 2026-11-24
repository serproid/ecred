import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { SimulationProvider } from './lib/SimulationProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <SimulationProvider>
          <App />
        </SimulationProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
