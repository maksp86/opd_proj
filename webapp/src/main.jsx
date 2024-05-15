import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './pages/Home.jsx'
import { BrowserRouter, createBrowserRouter, Route, RouterProvider, Routes } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'
import './main.scss'

import Navigation from "./components/Navigation"
import TopBar from './components/TopBar.jsx'
import NotFound from './pages/NotFound.jsx'
import { Container } from 'react-bootstrap'

const user = {
  username: "eblan",
  name: "eblan eblanovich",
  xp: 999
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <TopBar user={user} />
      <Container>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Container>
      <Navigation />
    </BrowserRouter>
  </React.StrictMode>,
)
