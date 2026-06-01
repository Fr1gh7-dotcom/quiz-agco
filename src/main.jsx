import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Display from './Display.jsx'
import './index.css'

// Routing minimale: /classifica = schermo live + admin, resto = quiz.
const path = window.location.pathname.replace(/\/+$/, '')
const isDisplay = path === '/classifica' || path === '/admin'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>{isDisplay ? <Display /> : <App />}</React.StrictMode>
)
