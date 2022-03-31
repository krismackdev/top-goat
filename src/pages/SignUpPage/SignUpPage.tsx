import React, { useState } from 'react'
import styles from './SignUpPage.module.css'
import { Link } from 'react-router-dom'
import { auth } from '../../firebase/config'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User as firebaseUser,
} from 'firebase/auth'
import { Button, TextField } from '@mui/material'

const SignUpPage = () => {
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [user, setUser] = useState<firebaseUser | null>(null)

  onAuthStateChanged(auth, currentUser => {
    setUser(currentUser)
  })

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
  }

  if (user) {
    return (
      <>
        <h2>You are logged in as: {user.email}</h2>
        <Button onClick={() => signOut(auth)} variant="contained">
          Logout
        </Button>
      </>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Create an account</h2>
        <form onSubmit={handleSignup} className={styles.card}>
          <TextField
            type="email"
            label="email"
            value={signupEmail}
            onChange={e => setSignupEmail(e.target.value)}
            style={{ backgroundColor: 'white', marginBottom: 20 }}
          />

          <TextField
            type="password"
            label="password"
            value={signupPassword}
            onChange={e => setSignupPassword(e.target.value)}
            style={{ backgroundColor: 'white', marginBottom: 20 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            style={{ marginBottom: 20 }}
          >
            Sign Up
          </Button>
          <p>
            Already have an account?{' '}
            <Link to="/login">
              <span id={styles['login-text']}>Log in.</span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default SignUpPage
