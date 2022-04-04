import React, { useContext, useState } from 'react'
import { PlayersContext } from '../../store'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'

interface AddPlayerFormProps {
  setFormIsActive: React.Dispatch<React.SetStateAction<boolean>>
}

const AddPlayerForm: React.FC<AddPlayerFormProps> = ({ setFormIsActive }) => {
  const [newPlayerName, setNewPlayerName] = useState('')
  const [formIsInvalid, setFormIsInvalid] = useState(false)
  const { addNewPlayer } = useContext(PlayersContext)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (newPlayerName.trim() === '') {
      setFormIsInvalid(true)
      return
    }
    addNewPlayer(newPlayerName)
    setFormIsInvalid(false)
    setNewPlayerName('')
  }

  return (
    <Dialog open={true} onClose={() => setFormIsActive(false)}>
      <DialogTitle sx={{ textAlign: 'center' }}>Add a new player</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} className="add-game-form">
          <TextField
            sx={{ marginBottom: '20px' }}
            label="Name"
            size="small"
            value={newPlayerName}
            onChange={e => setNewPlayerName(e.target.value)}
            error={formIsInvalid && newPlayerName.trim().length === 0}
            helperText={
              formIsInvalid && newPlayerName.trim().length === 0
                ? '* this field is required'
                : ''
            }
          />
          <DialogActions>
            <Button type="submit" variant="contained">
              Add
            </Button>
            <Button variant="outlined" onClick={() => setFormIsActive(false)}>
              Close
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddPlayerForm
