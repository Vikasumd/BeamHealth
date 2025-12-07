import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import App from './App.jsx'
import InvoiceManagement from './pages/InvoiceManagement.jsx'
import AIAgentPage from './pages/AIAgentPage.jsx'
import './styles/App.css'
import './styles/Landing.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/workflow" element={<App />} />
        <Route path="/invoices" element={<InvoiceManagement />} />
        <Route path="/:agentId" element={<AIAgentPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
