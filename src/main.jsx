//import { StrictMode } from 'react'
//import { createRoot } from 'react-dom/client'
//import './index.css'
//import App from './App.jsx'
//import "bootstrap/dist/css/bootstrap.min.css";

//createRoot(document.getElementById('root')).render(
  //<StrictMode>
//    <App />
  //</StrictMode>,
//)
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import "bootstrap/dist/css/bootstrap.min.css"

import { registerSW } from 'virtual:pwa-register'

registerSW({
  immediate: true,
  onRegisteredSW(swUrl, r) {
    if (r) {
      r.update()
    }
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
