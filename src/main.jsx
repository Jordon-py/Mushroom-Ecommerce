import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import { AnalyticsProvider } from './AnalyticsContext.jsx'
import { CartProvider } from './CartContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AnalyticsProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AnalyticsProvider>
    </BrowserRouter>
  </StrictMode>,
)
