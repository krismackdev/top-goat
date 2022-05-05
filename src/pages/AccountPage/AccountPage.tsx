import React, { useContext, useEffect, useState } from 'react'
import { auth } from '../../firebase/config'
import styles from './AccountPage.module.css'
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth'
import { DeleteConfirmation } from '../../components'
import { GamesContext, MatchesContext, PlayersContext } from '../../store'

const AccountPage = () => {
  const [uploadedFiles, setUploadedFiles] = useState<any>(null)
  const [userEmail, setUserEmail] = useState('')
  const [showDeleteUserConfirmation, setShowDeleteUserConfirmation] =
    useState(false)
  const [showDeleteDataConfirmation, setShowDeleteDataConfirmation] =
    useState(false)

  const { addNewGameFromImportedData, addNewGame, games } =
    useContext(GamesContext)
  const { addNewMatchFromImportedData, matches } = useContext(MatchesContext)
  const { addNewPlayerFromImportedData, players } = useContext(PlayersContext)

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

  const handleFileUpload = (e: any) => {
    const fileReader = new FileReader()
    fileReader.readAsText(e.target.files[0], 'UTF-8')
    fileReader.onload = e => {
      setUploadedFiles(e.target?.result)
    }
  }

  const handleDataImport = (e: any) => {
    let importedData
    try {
      importedData = JSON.parse(uploadedFiles)
    } catch (err) {
      alert(err)
    }
    if (
      'games' in importedData &&
      'matches' in importedData &&
      'players' in importedData
    ) {
      for (let game of importedData.games) {
        addNewGameFromImportedData(game)
      }
      for (let match of importedData.matches) {
        addNewMatchFromImportedData(match)
      }
      for (let player of importedData.players) {
        addNewPlayerFromImportedData(player)
      }
    }
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

      <button onClick={handlePasswordReset}>Reset Password</button>
      <br />
      <br />
      <button onClick={() => setShowDeleteUserConfirmation(true)}>
        Delete Account
      </button>
      <br />
      <br />
      <button onClick={handleDownload}>Download Data</button>
      <br />
      <br />
      <button onClick={() => setShowDeleteDataConfirmation(true)}>
        Delete Data
      </button>
      <br />
      <br />
      <h4>Import Data</h4>
      <input type="file" onChange={handleFileUpload} />
      <br />

      <button onClick={handleDataImport}>Import into Top Goat</button>
      <br />
      <br />
      <button onClick={() => signOut(auth)}>Logout</button>
    </div>
  )
}

export default AccountPage
