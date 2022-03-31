import React, { useState } from 'react'
import styles from './LogInPage.module.css'
import { auth } from '../../firebase/config'
import { Link } from 'react-router-dom'
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signOut,
  signInWithEmailAndPassword,
  User as firebaseUser,
} from 'firebase/auth'
import { Button, TextField } from '@mui/material'

const LogInPage: React.FC = () => {
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [enteredResetEmail, setEnteredResetEmail] = useState('')
  const [resetPasswordActive, setResetPasswordActive] = useState(false)
  const [user, setUser] = useState<firebaseUser | null>(null)

  onAuthStateChanged(auth, currentUser => {
    setUser(currentUser)
  })

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    signInWithEmailAndPassword(auth, loginEmail, loginPassword)
  }

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, enteredResetEmail)
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    }
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
        <h2>Log In</h2>
        <form onSubmit={handleLogin} className={styles.card}>
          <TextField
            type="email"
            label="email"
            value={loginEmail}
            onChange={e => setLoginEmail(e.target.value)}
            style={{ backgroundColor: 'white', marginBottom: 20 }}
          />
          <TextField
            type="password"
            label="password"
            value={loginPassword}
            onChange={e => setLoginPassword(e.target.value)}
            style={{ backgroundColor: 'white', marginBottom: 20 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            style={{ marginBottom: 20 }}
          >
            Log In
          </Button>
          <p>
            Don't have an account?{' '}
            <Link to="/signup">
              <span id={styles['signup-text']}>Sign up!</span>
            </Link>
          </p>
          <p
            onClick={() => setResetPasswordActive(prev => !prev)}
            id={styles.p2}
          >
            Forgot Password?
          </p>
        </form>
        {resetPasswordActive ? (
          <>
            <TextField
              type="email"
              label="email"
              value={enteredResetEmail}
              color="success"
              onChange={e => setEnteredResetEmail(e.target.value)}
              style={{
                backgroundColor: 'white',
                margin: '5px 0 15px 0',
              }}
            />
            <Button
              onClick={handleReset}
              variant="outlined"
              style={{
                color: 'green',
                borderColor: 'green',
                textTransform: 'none',
              }}
            >
              Reset password
            </Button>
          </>
        ) : (
          ''
        )}
      </div>
    </div>
  )
}

export default LogInPage
