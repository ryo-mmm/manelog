import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// 「!」を付けて、'root'要素が必ず存在することをTypeScriptに伝えます
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)