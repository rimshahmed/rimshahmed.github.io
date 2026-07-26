import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import ProjectPage from './pages/ProjectPage'
import './index.css'

// Companion to public/404.html: if we arrived via the Pages 404 bounce,
// restore the URL the visitor actually asked for before the router mounts.
const redirected = new URLSearchParams(window.location.search).get('p')
if (redirected) {
  window.history.replaceState(null, '', redirected)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/projects/:slug" element={<ProjectPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
