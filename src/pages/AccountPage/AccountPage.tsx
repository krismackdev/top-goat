import React, { useEffect, useState } from 'react'
import { auth } from '../../firebase/config'
import styles from './AccountPage.module.css'
import { onAuthStateChanged, updateEmail } from 'firebase/auth'

const AccountPage = () => {
  const [userEmail, setUserEmail] = useState('')

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

  return (
    <div className={styles['account-page-container']}>
      <p>Registration Date: {createdDateWithFormatting}</p>
      <p>Email: {userEmail}</p>
    </div>
  )
}

export default AccountPage
