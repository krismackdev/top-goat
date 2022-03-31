import React, { useState } from 'react'
import './App.css'
import { Navbar, PrivateRoute } from './components'
import { LogInPage, GamePage, MatchPage, SignUpPage } from './pages'
import { Routes, Route } from 'react-router-dom'
import { auth } from './firebase/config'
import { onAuthStateChanged } from 'firebase/auth'

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null)

  onAuthStateChanged(auth, currentUser => {
    setUser(currentUser)
  })

  console.log('current user =', auth.currentUser)

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={<LogInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<PrivateRoute user={user} />}>
          <Route path="/games" element={<GamePage />} />
          <Route path="/matches" element={<MatchPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
