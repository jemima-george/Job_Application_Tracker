// Connect React to HTML DOM 

import { StrictMode } from 'react' // React uses it to reduce errors by double checking code
import { createRoot } from 'react-dom/client'

// Import Style sheet
import './index.css'
import App from './App.jsx'

// Get empty div cointainer in index.html
// React adds App from app.jsx into div container
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
