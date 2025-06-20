import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import { AnalyticsProvider } from './AnalyticsContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AnalyticsProvider>
        <App />
      </AnalyticsProvider>
    </BrowserRouter>
  </StrictMode>,
)
