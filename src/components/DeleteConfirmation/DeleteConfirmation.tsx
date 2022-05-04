import React, { useContext } from 'react'
import { GamesContext, MatchesContext, PlayersContext } from '../../store'
import { auth } from '../../firebase/config'
import { deleteUser } from 'firebase/auth'
import './DeleteConfirmation.css'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'

interface DeleteConfirmationProps {
  setShowDeleteConfirmation: React.Dispatch<React.SetStateAction<boolean>>
  id: string
  type: 'game' | 'match' | 'player' | 'data' | 'user'
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  setShowDeleteConfirmation,
  id,
  type,
}) => {
  const { deleteAllGames, deleteGame } = useContext(GamesContext)
  const { deleteAllMatches, deleteMatch } = useContext(MatchesContext)
  const { deleteAllPlayers, deletePlayer } = useContext(PlayersContext)

  const handleDelete = async () => {
    switch (type) {
      case 'game':
        deleteGame(id)
        break
      case 'match':
        deleteMatch(id)
        break
      case 'player':
        deletePlayer(id)
        break
      case 'data':
        deleteAllGames()
        deleteAllMatches()
        deleteAllPlayers()
        break
      case 'user':
        if (auth.currentUser) {
          try {
            await deleteUser(auth.currentUser)
          } catch (err) {
            alert(err)
          }
        }
        break
    }
    setShowDeleteConfirmation(false)
  }

  return (
    <Dialog open={true} onClose={() => setShowDeleteConfirmation(false)}>
      <DialogTitle>
        {['game', 'match', 'player'].includes(type)
          ? `Are you sure you want to delete this ${type}?`
          : ''}
        {type === 'data'
          ? 'Are you sure you want to delete all your data?'
          : ''}
        {type === 'user' ? 'WARNING! ACCOUNT DELETION IS PERMANENT' : ''}
      </DialogTitle>
      <DialogContent>
        {type === 'user' ? (
          <p>
            Are you sure you want to delete your account? You will no longer be
            able to sign in to topgoat.com, and all of your data will be
            permantly deleted.
          </p>
        ) : (
          ''
        )}
        {type === 'game' ? (
          <p>
            <span style={{ color: 'red' }}>WARNING!</span> Deleting a game will
            also delete all of that game's matches!
          </p>
        ) : (
          ''
        )}
        <DialogActions
          sx={{ marginTop: type === 'user' || type === 'game' ? 2 : 0 }}
        >
          <Button
            sx={{ color: 'black' }}
            onClick={() => setShowDeleteConfirmation(false)}
          >
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete {type === 'user' ? 'Forever' : ''}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteConfirmation
