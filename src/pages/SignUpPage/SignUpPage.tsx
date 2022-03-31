import React, { useState } from 'react'
import styles from './SignUpPage.module.css'
import { Link } from 'react-router-dom'
import { auth } from '../../firebase/config'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { Button, TextField } from '@mui/material'

const SignUpPage = () => {
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const user = await createUserWithEmailAndPassword(
      auth,
      signupEmail,
      signupPassword
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
