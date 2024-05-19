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
import LearningPage from './pages/Learning.jsx'
import TasksPage from './pages/Tasks.jsx'
import Taskchoose from './pages/Taskchoose.jsx'
import Leaningchoose from './pages/Leaningchoose.jsx'

import './main.scss'

const user = {
  username: "coolguy22",
  name: "Ivan Ivanov",
  bio: "Good programmer, bad designer",
  xp: 100
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <TopBar user={user} />
      <Container>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/account' element={<Account user={user} />} />
          <Route path='/learning' element={<LearningPage user={user} />} />
          <Route path='/learning/list' element={<Leaningchoose user={user} />} />
          <Route path='/tasks' element={<TasksPage user={user} />} />
          <Route path='/tasks/list' element={<Taskchoose user={user} />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Container>
      <Navigation />
    </BrowserRouter>
  </React.StrictMode>,
)
