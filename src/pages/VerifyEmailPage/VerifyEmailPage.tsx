import React from 'react'
import { auth } from '../../firebase/config'
import { sendEmailVerification } from 'firebase/auth'

const VerifyEmailPage = () => {
  const handleClick = () => {
    auth.currentUser && sendEmailVerification(auth.currentUser)
  }

  return (
    <div>
      <h4>You must verify your email before using your account</h4>
      <p>check your email for instructions</p>
      <button onClick={handleClick}>
        Click here to resend verification email
      </button>
      <p>
        If you already clicked the link in the email, please refresh the page to
        continue
      </p>
    </div>
  )
}

export default VerifyEmailPage
