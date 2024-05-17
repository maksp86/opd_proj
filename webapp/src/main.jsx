import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './pages/Home.jsx'
import { BrowserRouter, createBrowserRouter, Route, RouterProvider, Routes } from 'react-router-dom'
import { Container } from 'react-bootstrap'

import Navigation from "./components/Navigation"
import TopBar from './components/TopBar.jsx'

import Account from './pages/Account.jsx'
import NotFound from './pages/NotFound.jsx'
import LoginPage from './pages/Login.jsx'

import './main.scss'

const user = {
  username: "eblan",
  name: "eblan eblanovich",
  bio: "как же я люблю это чувство... как там его... пенис ммм оаоаоа пачка чипсов с крабом лейс",
  xp: 999
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <TopBar user={user} />
      <Container>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/account' element={<Account user={user} />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Container>
      <Navigation />
    </BrowserRouter>
  </React.StrictMode>,
)
