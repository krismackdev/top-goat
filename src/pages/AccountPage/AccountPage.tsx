import React, { useContext, useEffect, useState } from 'react'
import { auth } from '../../firebase/config'
import styles from './AccountPage.module.css'
import { onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth'
import { DeleteConfirmation } from '../../components'
import { GamesContext, MatchesContext, PlayersContext } from '../../store'

const AccountPage = () => {
  const [userEmail, setUserEmail] = useState('')
  const [showDeleteUserConfirmation, setShowDeleteUserConfirmation] =
    useState(false)
  const [showDeleteDataConfirmation, setShowDeleteDataConfirmation] =
    useState(false)

  const { games } = useContext(GamesContext)
  const { matches } = useContext(MatchesContext)
  const { players } = useContext(PlayersContext)

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

  const downloadFile = ({ data, fileName, fileType }: any) => {
    // Create a blob with the data we want to download as a file
    const blob = new Blob([data], { type: fileType })
    // Create an anchor element and dispatch a click event on it
    // to trigger a download
    const a = document.createElement('a')
    a.download = fileName
    a.href = window.URL.createObjectURL(blob)
    const clickEvt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(clickEvt)
    a.remove()
  }

  const handleDownload = (e: any) => {
    console.log('games to DL =', games)
    console.log('matches to DL =', matches)
    console.log('players to DL =', players)
    e.preventDefault()
    downloadFile({
      data: JSON.stringify({ games, matches, players }),
      fileName: `top-goat-data-for-user-${auth?.currentUser?.email}.json`,
      fileType: 'text/json',
    })
  }

  return (
    <div className={styles['account-page-container']}>
      {showDeleteUserConfirmation && (
        <DeleteConfirmation
          setShowDeleteConfirmation={setShowDeleteUserConfirmation}
          type="user"
          id="none"
        />
      )}
      {showDeleteDataConfirmation && (
        <DeleteConfirmation
          type="data"
          setShowDeleteConfirmation={setShowDeleteDataConfirmation}
          id="none"
        />
      )}

      <p>Registration Date: {createdDateWithFormatting}</p>
      <br />

      <p>Email: {userEmail}</p>
      <br />

      <button onClick={handlePasswordReset}>Reset Password?</button>
      <br />
      <br />
      <button onClick={() => setShowDeleteUserConfirmation(true)}>
        Delete Your Account?
      </button>
      <br />
      <br />
      <button onClick={handleDownload}>Download your data</button>
      <br />
      <br />
      <button onClick={() => setShowDeleteDataConfirmation(true)}>
        Delete all your data
      </button>
    </div>
  )
}

export default AccountPage
