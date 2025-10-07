import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import {FrontContextProvider} from './providers/frontContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FrontContextProvider>
      <App />
    </FrontContextProvider>
  </StrictMode>,
)

