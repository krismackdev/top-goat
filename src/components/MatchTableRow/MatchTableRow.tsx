import React, { Fragment, useContext, useReducer, useState } from 'react'
import { MatchesContext } from '../../store/matches-context'
import { GamesContext } from '../../store/games-context'
import { MatchTableCell } from '../../mui'
import {
  IconButton,
  MenuItem,
  Select,
  TableRow,
  TextField,
} from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel'
import CheckIcon from '@mui/icons-material/Check'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { DeleteConfirmation } from '../../components'

type Result = 'win' | 'loss' | 'draw' | 'n/a'

interface PlayerResultObject {
  name: string
  result: Result
  score: string
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

interface MatchActionObject {
  type:
    | 'toggleEditingMode'
    | 'changeDate'
    | 'changeGame'
    | 'changePlayerResult'
    | 'changePlayerScore'
  payload: { [prop: string]: string }
}

interface MatchTableRowProps {
  match: MatchObject
  players: PlayerObject[] | undefined
}

interface EditMatchObject extends MatchObject {
  isActive: boolean
}

const editMatchRowReducer = (
  state: EditMatchObject,
  action: MatchActionObject
) => {
  switch (action.type) {
    case 'toggleEditingMode':
      return { ...state, isActive: !state.isActive }
    case 'changeDate':
      return { ...state, date: action.payload?.date }
    case 'changeGame':
      return {
        ...state,
        gameId: action.payload?.gameId,
        game: action.payload?.gameTitle,
      }
    case 'changePlayerResult':
      return {
        ...state,
        participants: {
          ...state.participants,
          [`${action.payload.playerId}`]: {
            name: action.payload.playerName!,
            result: action.payload.result as Result,
            score:
              state.participants?.[action.payload.playerId]?.score ?? 'n/a',
          },
        },
      }
    case 'changePlayerScore':
      return {
        ...state,
        participants: {
          ...state.participants,
          [`${action.payload.playerId}`]: {
            name: action.payload.playerName!,
            result:
              state.participants?.[action.payload.playerId]?.result ?? 'n/a',
            score: action.payload.score,
          },
        },
      }
  }
}

const MatchTableRow: React.FC<MatchTableRowProps> = ({ match, players }) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  const { updateMatch } = useContext(MatchesContext)
  const { games } = useContext(GamesContext)

  const formattedDate = `${match.date.slice(5, 7)}-${match.date.slice(
    8
  )}-${match.date.slice(0, 4)}`

  const initialMatchRowState: EditMatchObject = {
    id: match.id,
    date: match.date,
    game: match.game,
    gameId: match.gameId,
    isActive: false,
    playOrder: match.playOrder,
    participants: match.participants,
  }

  const [editMatchRowState, dispatch] = useReducer(
    editMatchRowReducer,
    initialMatchRowState
  )

  console.log('editMatchRowState =', editMatchRowState)

  const handleMatchDelete = (): void => {
    setShowDeleteConfirmation(true)
  }

  if (editMatchRowState.isActive) {
    return (
      <TableRow>
        <MatchTableCell className="editing editing-start"></MatchTableCell>
        <MatchTableCell
          className="editing"
          sx={{
            '&:focus-within': {
              backgroundColor: '#d4ff32',
            },
          }}
        >
          <TextField
            sx={{
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                border: '4px solid #d4ff32',
              },
              '&:hover': {
                backgroundColor: '#d4ff32',
              },
            }}
            size="small"
            type="date"
            value={editMatchRowState.date}
            onChange={e =>
              dispatch({
                type: 'changeDate',
                payload: { date: e.target.value },
              })
            }
          />
        </MatchTableCell>
        <MatchTableCell
          className="editing"
          sx={{
            '&:focus-within': {
              backgroundColor: '#d4ff32',
            },
          }}
        >
          <Select
            sx={{
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                border: '4px solid #d4ff32',
              },
              '&:hover': {
                backgroundColor: '#d4ff32',
              },
            }}
            size="small"
            value={editMatchRowState.gameId}
            onChange={e => {
              dispatch({
                type: 'changeGame',
                payload: {
                  gameId: e.target.value,
                  gameTitle:
                    games?.find(game => game.id === e.target.value)?.title ??
                    '',
                },
              })
            }}
          >
            {Array.isArray(games) &&
              games.length > 0 &&
              games.map(game => (
                <MenuItem value={game.id} key={game.id}>
                  {game.title}
                </MenuItem>
              ))}
          </Select>
        </MatchTableCell>

        {Array.isArray(players) &&
          players.length > 0 &&
          players.map(player => {
            return (
              <Fragment key={player.id}>
                <MatchTableCell
                  className="editing"
                  sx={{
                    '&:focus-within': {
                      backgroundColor: '#d4ff32',
                    },
                  }}
                >
                  <Select
                    sx={{
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        border: '4px solid #d4ff32',
                      },
                      '&:hover': {
                        backgroundColor: '#d4ff32',
                      },
                    }}
                    size="small"
                    value={editMatchRowState.participants[player.id]?.result}
                    onChange={e => {
                      dispatch({
                        type: 'changePlayerResult',
                        payload: {
                          playerName: player.name,
                          playerId: player.id,
                          result: e.target.value,
                        },
                      })
                    }}
                  >
                    <MenuItem value=""></MenuItem>
                    <MenuItem value="win">win</MenuItem>
                    <MenuItem value="loss">loss</MenuItem>
                    <MenuItem value="draw">draw</MenuItem>
                    <MenuItem value="n/a">n/a</MenuItem>
                  </Select>
                </MatchTableCell>
                <MatchTableCell
                  className="editing"
                  sx={{
                    '&:focus-within': {
                      backgroundColor: '#d4ff32',
                    },
                  }}
                >
                  <TextField
                    size="small"
                    type="text"
                    value={editMatchRowState.participants[player.id]?.score}
                    onChange={e => {
                      dispatch({
                        type: 'changePlayerScore',
                        payload: {
                          playerName: player.name,
                          playerId: player.id,
                          score: e.target.value,
                        },
                      })
                    }}
                  />
                </MatchTableCell>
              </Fragment>
            )
          })}

        <MatchTableCell className="editing"></MatchTableCell>
        <MatchTableCell className="editing editing-end">
          <div style={{ display: 'flex' }}>
            <IconButton
              size="small"
              sx={{ color: 'green' }}
              onClick={() => {
                const { isActive, ...updatedMatch } = editMatchRowState
                updateMatch(updatedMatch)
                dispatch({ type: 'toggleEditingMode', payload: { x: 'x' } })
              }}
            >
              <CheckIcon fontSize="inherit" />
            </IconButton>
            <IconButton
              size="small"
              sx={{ color: 'red' }}
              onClick={() =>
                dispatch({ type: 'toggleEditingMode', payload: { x: 'x' } })
              }
            >
              <CancelIcon fontSize="inherit" />
            </IconButton>
          </div>
        </MatchTableCell>
      </TableRow>
    )
  }
  //                                                    //
  //               .. edit mode ABOVE ..                //
  //                                                    //
  //                                                    //
  //               .. normal row BELOW ..               //
  //                                                    //
  else {
    return (
      <>
        {showDeleteConfirmation && (
          <DeleteConfirmation
            id={match.id}
            type="match"
            setShowDeleteConfirmation={setShowDeleteConfirmation}
          />
        )}
        <TableRow
          sx={{
            '&:nth-of-type(even)': {
              backgroundColor: '#f2f2f2',
            },
          }}
        >
          <MatchTableCell>{match.playOrder}</MatchTableCell>
          <MatchTableCell>{formattedDate}</MatchTableCell>
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
              onClick={() =>
                dispatch({ type: 'toggleEditingMode', payload: { x: 'x' } })
              }
            >
              <EditIcon fontSize="inherit" />
            </IconButton>
          </MatchTableCell>
        </TableRow>
      </>
    )
  }
}

export default MatchTableRow
