import React, { useContext } from 'react'
import { GamesContext } from '../../store/games-context'
import './DeleteGameConfirmation.css'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'

interface DeleteGameConfirmationProps {
  setShowDeleteConfirmation: React.Dispatch<React.SetStateAction<boolean>>
  id: string
}

const DeleteGameConfirmation: React.FC<DeleteGameConfirmationProps> = ({
  setShowDeleteConfirmation,
  id,
}) => {
  const { deleteGame } = useContext(GamesContext)

  const handleDelete = () => {
    deleteGame(id)
    setShowDeleteConfirmation(false)
  }

  return (
    <Dialog open={true} onClose={() => setShowDeleteConfirmation(false)}>
      <DialogTitle>Are you sure you want to delete this game?</DialogTitle>
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

export default DeleteGameConfirmation
