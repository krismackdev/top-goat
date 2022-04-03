import React, { useState } from 'react'
import { DeleteConfirmation } from '../../components'
import { IconButton, TableRow } from '@mui/material'
import { GameTableCell as PlayerTableCell, StyledTextField } from '../../mui'
import CancelIcon from '@mui/icons-material/Cancel'
import CheckIcon from '@mui/icons-material/Check'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

interface PlayerObject {
  name: string
  id: string
  owner: string
  score: number
}

interface PlayerTableRowProps {
  player: PlayerObject
}

const PlayerTableRow: React.FC<PlayerTableRowProps> = ({ player }) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedPlayerName, setEditedPlayerName] = useState(player.name)

  const handlePlayerDelete = (): void => {
    setShowDeleteConfirmation(true)
  }

  if (isEditing) {
    return (
      <TableRow sx={{ height: '20px' }}>
        <PlayerTableCell
          className="editing editing-start"
          sx={{
            '&:focus-within': {
              backgroundColor: '#d4ff32',
            },
          }}
        >
          <StyledTextField
            variant="standard"
            value={editedPlayerName}
            onChange={e => setEditedPlayerName(e.target.value)}
          />
        </PlayerTableCell>
        <PlayerTableCell className="editing">{player.score}</PlayerTableCell>
        <PlayerTableCell className="editing">
          {/* delete cell is empty during edit by design */}
        </PlayerTableCell>

        <PlayerTableCell className="editing editing-end" align="center">
          <IconButton
            sx={{ color: 'green' }}
            onClick={() => {
              //             updatePlayer(updatedPlayer)
              setIsEditing(false)
            }}
          >
            <CheckIcon />
          </IconButton>
          <IconButton sx={{ color: 'red' }} onClick={() => setIsEditing(false)}>
            <CancelIcon />
          </IconButton>
        </PlayerTableCell>
      </TableRow>
    )
    //                                                    //
    //               .. edit mode ABOVE ..                //
    //                                                    //
    //                                                    //
    //               .. normal row BELOW ..               //
    //                                                    //
  } else {
    return (
      <>
        {showDeleteConfirmation && (
          <DeleteConfirmation
            type="player"
            id={player.id}
            setShowDeleteConfirmation={setShowDeleteConfirmation}
          />
        )}
        <TableRow key={player.id}>
          <PlayerTableCell>{player.name}</PlayerTableCell>
          <PlayerTableCell>{player.score}</PlayerTableCell>
          <PlayerTableCell align="center">
            <IconButton sx={{ color: 'black' }} onClick={handlePlayerDelete}>
              <DeleteIcon />
            </IconButton>
          </PlayerTableCell>
          <PlayerTableCell align="center">
            <IconButton
              disableRipple
              sx={{ color: 'black' }}
              onClick={() => setIsEditing(true)}
            >
              <EditIcon />
            </IconButton>
          </PlayerTableCell>
        </TableRow>
      </>
    )
  }
}

export default PlayerTableRow
