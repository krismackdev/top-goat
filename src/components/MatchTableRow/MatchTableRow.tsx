import React from 'react'
import MatchTableCell from '../../mui/MatchTableCell'
import { IconButton, TableRow } from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel'
import CheckIcon from '@mui/icons-material/Check'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

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

interface MatchTableRowProps {
  match: MatchObject
}

const MatchTableRow: React.FC<MatchTableRowProps> = ({ match }) => {
  const dinis = '9f90dca4-1220-4b61-ba56-2dec81d86ded'
  const kris = '6bb7a5a1-2b9d-41c7-9492-4f9d3c8af07e'
  const lais = '68b25a6a-50c2-4c62-9795-d0af18a29d0a'
  const susan = '37c29c04-98f4-47f8-8bad-aeaa8b4c8abc'

  const scoreDinis =
    match.participants[dinis].score === 'n/a'
      ? '-'
      : match.participants[dinis].score
  const scoreKris =
    match.participants[kris].score === 'n/a'
      ? '-'
      : match.participants[kris].score
  const scoreLais =
    match.participants[lais].score === 'n/a'
      ? '-'
      : match.participants[lais].score
  const scoreSusan =
    match.participants[susan].score === 'n/a'
      ? '-'
      : match.participants[susan].score
  const resultDinis =
    match.participants[dinis].result === 'n/a'
      ? '-'
      : match.participants[dinis].result
  const resultKris =
    match.participants[kris].result === 'n/a'
      ? '-'
      : match.participants[kris].result
  const resultLais =
    match.participants[lais].result === 'n/a'
      ? '-'
      : match.participants[lais].result
  const resultSusan =
    match.participants[susan].result === 'n/a'
      ? '-'
      : match.participants[susan].result

  // const handleDelete = () => {}

  return (
    <>
      <TableRow>
        <MatchTableCell>{match.playOrder}</MatchTableCell>
        <MatchTableCell>{match.date}</MatchTableCell>
        <MatchTableCell>{match.game}</MatchTableCell>
        <MatchTableCell>{resultDinis}</MatchTableCell>
        <MatchTableCell>{scoreDinis}</MatchTableCell>
        <MatchTableCell>{resultKris}</MatchTableCell>
        <MatchTableCell>{scoreKris}</MatchTableCell>
        <MatchTableCell>{resultLais}</MatchTableCell>
        <MatchTableCell>{scoreLais}</MatchTableCell>
        <MatchTableCell>{resultSusan}</MatchTableCell>
        <MatchTableCell>{scoreSusan}</MatchTableCell>
        <MatchTableCell>
          <IconButton
            size="small"
            sx={{ color: 'black' }}
            // onClick={handleDelete}
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
