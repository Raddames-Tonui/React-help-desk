import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css"; 
import "@fontsource/inter/700.css"; 


import './css/index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App/>
  </StrictMode>,
)
