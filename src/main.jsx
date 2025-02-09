import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'primereact/resources/themes/saga-blue/theme.css';  // Optional Theme (choose as needed)
import 'primeicons/primeicons.css';                        // Icons from PrimeIcons

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
