import React, { useEffect, useState } from 'react'
import { auth } from '../../firebase/config'
import styles from './AccountPage.module.css'
import { onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth'
import { DeleteUserConfirmation } from '../../components'

const AccountPage = () => {
  const [userEmail, setUserEmail] = useState('')
  const [showDeleteUserConfirmation, setShowDeleteUserConfirmation] =
    useState(false)

  const createdDateWithoutFormatting = auth?.currentUser?.metadata.creationTime
    ? new Date(auth.currentUser.metadata.creationTime).toISOString()
    : 'unknown'
  const createdDateWithFormatting =
    createdDateWithoutFormatting === 'unkonwn'
      ? 'unknown'
      : `${createdDateWithoutFormatting.slice(
          5,
          7
        )}-${createdDateWithoutFormatting.slice(
          8,
          10
        )}-${createdDateWithoutFormatting.slice(0, 4)}`

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, currentUser => {
      setUserEmail(currentUser?.email ? currentUser.email : '')
    })
    return () => unsub()
  }, [])

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, userEmail)
    } catch (err) {
      alert(err)
    }
  }

  const handleDelete = () => {}

  return (
    <div className={styles['account-page-container']}>
      {showDeleteUserConfirmation && (
        <DeleteUserConfirmation
          setShowDeleteUserConfirmation={setShowDeleteUserConfirmation}
        />
      )}
      <p>Registration Date: {createdDateWithFormatting}</p>
      <p>Email: {userEmail}</p>
      <button onClick={handlePasswordReset}>Reset Password?</button>
      <br />
      <button onClick={() => setShowDeleteUserConfirmation(true)}>
        Delete Your Account?
      </button>
    </div>
  )
}

export default AccountPage
