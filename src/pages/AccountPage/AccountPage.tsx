import React, { useContext, useEffect, useState } from 'react'
import { auth } from '../../firebase/config'
import styles from './AccountPage.module.css'
import { onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth'
import { DeleteUserConfirmation } from '../../components'
import { GamesContext, MatchesContext, PlayersContext } from '../../store'

const AccountPage = () => {
  const [userEmail, setUserEmail] = useState('')
  const [showDeleteUserConfirmation, setShowDeleteUserConfirmation] =
    useState(false)

  const { deleteAllGames, games } = useContext(GamesContext)
  const { deleteAllMatches, matches } = useContext(MatchesContext)
  const { deleteAllPlayers, players } = useContext(PlayersContext)

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

  const handleDataDeletion = () => {
    deleteAllGames()
    deleteAllMatches()
    deleteAllPlayers()
  }

  return (
    <div className={styles['account-page-container']}>
      {showDeleteUserConfirmation && (
        <DeleteUserConfirmation
          setShowDeleteUserConfirmation={setShowDeleteUserConfirmation}
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
      <button onClick={handleDataDeletion}>Delete all your data</button>
    </div>
  )
}

export default AccountPage
