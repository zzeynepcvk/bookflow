import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'  // ✅ Import ekledik
import './index.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>  {/* ✅ AuthProvider ile sardık */}
      <App />
    </AuthProvider>
  </React.StrictMode>
)