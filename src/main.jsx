import { Toaster } from "react-hot-toast";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster/>
    <App />
  </StrictMode>,
)
