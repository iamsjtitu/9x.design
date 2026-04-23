import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          fontFamily: 'DM Sans, sans-serif',
          borderRadius: '12px',
          padding: '12px 16px',
          fontSize: '14px',
        },
      }}
    />
    <App />
  </React.StrictMode>,
)
