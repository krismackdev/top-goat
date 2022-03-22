import React, { useState } from 'react'
import './AuthPage.css'
import { auth } from '../../firebase/config'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'

const AuthPage: React.FC = () => {
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const handleSignup = async () => {
    const user = await createUserWithEmailAndPassword(
      auth,
      signupEmail,
      signupPassword
    )
  }

  const handleLogin = async () => {
    const user = await signInWithEmailAndPassword(
      auth,
      loginEmail,
      loginPassword
    )
  }

  return (
    <div>
      <div>
        <h3>signup</h3>
        <form onSubmit={handleSignup}>
          <input
            type="email"
            value={signupEmail}
            onChange={e => setSignupEmail(e.target.value)}
          />
          <input
            type="password"
            value={signupPassword}
            onChange={e => setSignupPassword(e.target.value)}
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>
      <div>
        <h3>login</h3>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={loginEmail}
            onChange={e => setLoginEmail(e.target.value)}
          />
          <input
            type="password"
            value={loginPassword}
            onChange={e => setLoginPassword(e.target.value)}
          />
          <button type="submit">Log In</button>
        </form>
      </div>
      <div>
        <button type="button" onClick={() => signOut(auth)}>
          Log Out
        </button>
      </div>
    </div>
  )
}

export default AuthPage
