import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import "@fontsource/inter/400.css"; // Regular
import "@fontsource/inter/600.css"; // Semi-bold
import "@fontsource/inter/700.css"; // Bold


import './css/index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App/>
  </StrictMode>,
)
