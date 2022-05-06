import React, { useContext, useState } from 'react'
import './App.css'
import { PrivateRoute } from './components'
import {
  LogInPage,
  AccountPage,
  GamePage,
  GameDetailPage,
  MatchPage,
  NotFoundPage,
  PlayerPage,
  SignUpPage,
  VerifyEmailPage,
} from './pages'
import { Routes, Route } from 'react-router-dom'
import { auth } from './firebase/config'
import { ResponsiveAppBar } from './mui'
import { onAuthStateChanged } from 'firebase/auth'

import { MatchesContext } from './store'

const App: React.FC = () => {
  const { matches } = useContext(MatchesContext)

  const [user, setUser] = useState<any>(null)

  onAuthStateChanged(auth, currentUser => {
    setUser(currentUser)
  })

  if (user && !user.emailVerified) {
    return <VerifyEmailPage />
  }

  return (
    <>
      {user && user.emailVerified && <ResponsiveAppBar />}
      <Routes>
        <Route path="/login" element={<LogInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verifyemail" element={<VerifyEmailPage />} />
        <Route path="/" element={<PrivateRoute user={user} />}>
          <Route path="/account" element={<AccountPage />} />
          <Route path="/games" element={<GamePage />} />
          <Route path="/games/:id" element={<GameDetailPage />} />
          <Route path="/matches" element={<MatchPage />} />
          <Route path="/players" element={<PlayerPage />} />
          <Route path="/*" element={<NotFoundPage user={user} />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
