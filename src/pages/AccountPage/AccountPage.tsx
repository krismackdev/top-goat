import React, { useEffect, useState } from 'react'
import { auth } from '../../firebase/config'
import styles from './AccountPage.module.css'
import { onAuthStateChanged, updateEmail } from 'firebase/auth'

const AccountPage = () => {
  const [userEmail, setUserEmail] = useState('')
  const [enteredEmail, setEnteredEmail] = useState('')
  const [editingEmail, setEditingEmail] = useState(false)
  const [toggleUserUpdated, setToggleUserUpdate] = useState(false)

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

  const handleEmailChange = async () => {
    if (auth.currentUser) {
      await updateEmail(auth.currentUser, enteredEmail)
    }
    setToggleUserUpdate(prev => !prev)
  }

  // useEffect(() => {
  //   const unsub = onAuthStateChanged(auth, currentUser => {
  //     setUserEmail(currentUser?.email ? currentUser.email : '')
  //   })
  //   return () => unsub()
  // }, [])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, currentUser => {
      setUserEmail(currentUser?.email ? currentUser.email : '')
    })
    return () => unsub()
  }, [toggleUserUpdated])

  return (
    <div className={styles['account-page-container']}>
      <p>Registration Date: {createdDateWithFormatting}</p>
      <p>Email: {userEmail}</p>
      <button onClick={() => setEditingEmail(prev => !prev)}>edit</button>
      {editingEmail && (
        <div>
          <input
            type="email"
            value={enteredEmail}
            onChange={e => setEnteredEmail(e.target.value)}
          />
          <button onClick={handleEmailChange}>UPDATE EMAIL</button>
        </div>
      )}
    </div>
  )
}

export default AccountPage
