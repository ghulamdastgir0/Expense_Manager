import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Loginpage from './components/LoginPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Loginpage />
  </StrictMode>,
)
