import React, { useContext } from 'react'
import { GamesContext, MatchesContext, PlayersContext } from '../../store'
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
  type: 'game' | 'match' | 'player'
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  setShowDeleteConfirmation,
  id,
  type,
}) => {
  const { deleteGame } = useContext(GamesContext)
  const { deleteMatch } = useContext(MatchesContext)
  const { deletePlayer } = useContext(PlayersContext)

  const handleDelete = () => {
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
    }
    setShowDeleteConfirmation(false)
  }

  return (
    <Dialog open={true} onClose={() => setShowDeleteConfirmation(false)}>
      <DialogTitle>
        Are you sure you want to delete this {`${type}`}?
      </DialogTitle>
      <DialogContent>
        <DialogActions>
          <Button
            sx={{ color: 'black' }}
            onClick={() => setShowDeleteConfirmation(false)}
          >
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteConfirmation
