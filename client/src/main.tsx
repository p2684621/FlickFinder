import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {screen.width >= 768 ? <App /> : <div className='mobile-ui'>
      <h1 className='mobile-head'> Flick Finder</h1>
      <p className='message'>
        Coming Soon on mobile screens
      </p>
      <p>Please Use Desktop for better User experience</p>
    </div>}
  </React.StrictMode>,
)
