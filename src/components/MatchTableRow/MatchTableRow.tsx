import React, { Fragment, useState } from 'react'
import MatchTableCell from '../../mui/MatchTableCell'
import { IconButton, TableRow } from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel'
import CheckIcon from '@mui/icons-material/Check'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { DeleteConfirmation } from '../../components'

type Result = 'win' | 'loss' | 'draw' | 'n/a'

interface PlayerResultObject {
  name: string
  result: Result
  score: number | 'n/a'
}

interface ParticipantsObject {
  [prop: string]: PlayerResultObject
}

interface MatchObject {
  id: string
  date: string
  game: string
  gameId: string
  playOrder: number
  participants: ParticipantsObject
}

interface PlayerObject {
  id: string
  name: string
}

interface MatchTableRowProps {
  match: MatchObject
  players: PlayerObject[] | undefined
}

const MatchTableRow: React.FC<MatchTableRowProps> = ({ match, players }) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  const handleMatchDelete = (): void => {
    setShowDeleteConfirmation(true)
  }

  return (
    <>
      {showDeleteConfirmation && (
        <DeleteConfirmation
          id={match.id}
          type="match"
          setShowDeleteConfirmation={setShowDeleteConfirmation}
        />
      )}
      <TableRow>
        <MatchTableCell>{match.playOrder}</MatchTableCell>
        <MatchTableCell>{match.date}</MatchTableCell>
        <MatchTableCell>{match.game}</MatchTableCell>
        {players?.map(player => (
          <Fragment key={player.id}>
            <MatchTableCell>
              {match?.participants?.[player.id]?.result === 'n/a'
                ? '-'
                : match?.participants?.[player.id]?.result ?? '-'}
            </MatchTableCell>
            <MatchTableCell>
              {match?.participants?.[player.id]?.score === 'n/a'
                ? '-'
                : match?.participants?.[player.id]?.score ?? '-'}
            </MatchTableCell>
          </Fragment>
        ))}
        <MatchTableCell>
          <IconButton
            size="small"
            sx={{ color: 'black' }}
            onClick={handleMatchDelete}
          >
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </MatchTableCell>
        <MatchTableCell>
          <IconButton
            size="small"
            disableRipple
            sx={{ color: 'black' }}
            // onClick={() => dispatch({ type: 'toggleEditingMode' })}
          >
            <EditIcon fontSize="inherit" />
          </IconButton>
        </MatchTableCell>
      </TableRow>
    </>
  )
}

export default MatchTableRow
