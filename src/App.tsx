import React, { useState } from 'react'
import './App.css'
import { Navbar, PrivateRoute } from './components'
import { AuthPage, GamePage, MatchPage } from './pages'
import { Routes, Route } from 'react-router-dom'
import { auth } from './firebase/config'
import { onAuthStateChanged } from 'firebase/auth'

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null)
  console.log('user =', user?.email)

  onAuthStateChanged(auth, currentUser => {
    setUser(currentUser)
  })

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/" element={<PrivateRoute user={user} />}>
          <Route path="/games" element={<GamePage />} />
          <Route path="/matches" element={<MatchPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
