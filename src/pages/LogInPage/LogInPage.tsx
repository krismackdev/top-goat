import React, { useState } from 'react'
import styles from './LogInPage.module.css'
import { auth } from '../../firebase/config'
import { Link } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Button, TextField } from '@mui/material'

const LogInPage: React.FC = () => {
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const user = await signInWithEmailAndPassword(
      auth,
      loginEmail,
      loginPassword
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
        </form>
      </div>
    </div>
  )
}

export default LogInPage
