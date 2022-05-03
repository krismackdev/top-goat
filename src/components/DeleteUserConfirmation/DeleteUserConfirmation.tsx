import React from 'react'
import { auth } from '../../firebase/config'
import { deleteUser } from 'firebase/auth'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'

interface DeleteUserConfirmationProps {
  setShowDeleteUserConfirmation: React.Dispatch<React.SetStateAction<boolean>>
}

const DeleteUserConfirmation: React.FC<DeleteUserConfirmationProps> = ({
  setShowDeleteUserConfirmation,
}) => {
  const handleAccountDeletion = async () => {
    setShowDeleteUserConfirmation(false)
    if (auth.currentUser) {
      try {
        await deleteUser(auth.currentUser)
      } catch (err) {
        alert(err)
      }
    }
  }

  return (
    <Dialog open={true} onClose={() => setShowDeleteUserConfirmation(false)}>
      <DialogTitle>WARNING! ACCOUNT DELETION IS PERMANENT</DialogTitle>
      <DialogContent>
        <p>
          Are you sure you want to delete your account? You will no longer be
          able to sign in to topgoat.com, and all of your data will be permantly
          deleted.
        </p>
        <DialogActions sx={{ marginTop: 2 }}>
          <Button
            sx={{ color: 'black' }}
            onClick={() => setShowDeleteUserConfirmation(false)}
          >
            cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleAccountDeletion}
          >
            delete forever
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteUserConfirmation
