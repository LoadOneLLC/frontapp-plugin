import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {FrontContextProvider} from './providers/frontContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <FrontContextProvider>
      <App />
    </FrontContextProvider>
  </React.StrictMode>,
)

