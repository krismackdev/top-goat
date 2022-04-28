import React, { useState } from 'react'
import './App.css'
import { PrivateRoute } from './components'
import {
  LogInPage,
  DashboardPage,
  GamePage,
  MatchPage,
  NotFoundPage,
  PlayerPage,
  SignUpPage,
} from './pages'
import { Routes, Route } from 'react-router-dom'
import { auth } from './firebase/config'
import { ResponsiveAppBar } from './mui'
import { onAuthStateChanged } from 'firebase/auth'

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null)

  onAuthStateChanged(auth, currentUser => {
    setUser(currentUser)
  })

  return (
    <>
      {user && <ResponsiveAppBar />}
      <Routes>
        <Route path="/login" element={<LogInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<PrivateRoute user={user} />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/games" element={<GamePage />} />
          <Route path="/matches" element={<MatchPage />} />
          <Route path="/players" element={<PlayerPage />} />
          <Route path="/*" element={<NotFoundPage user={user} />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
