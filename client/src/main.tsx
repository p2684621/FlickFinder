import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
        {screen.width >= 768 ? <App /> : <h1>Mobile Screen</h1>}
  </React.StrictMode>,
)
