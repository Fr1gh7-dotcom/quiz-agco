import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Display from './Display.jsx'
import './index.css'

// Routing minimale: /classifica = schermo live + admin, resto = quiz.
const path = window.location.pathname.replace(/\/+$/, '')
const isDisplay = path === '/classifica' || path === '/admin'

// Lo schermo classifica è a tutto schermo scuro (no sfondo blueprint, no card centrata)
if (isDisplay) document.body.classList.add('display-mode')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>{isDisplay ? <Display admin={path === '/admin'} /> : <App />}</React.StrictMode>
)
