import React, { useContext, useReducer, useState } from 'react'
import './AddMatchForm.css'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import { GamesContext } from '../../store/games-context'
// @ts-ignore
import { v4 as uuidv4 } from 'uuid'

interface AddMatchFormProps {
  setFormIsActive: React.Dispatch<React.SetStateAction<boolean>>
}

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
  participants: ParticipantsObject
  playOrder: number
}

interface MatchFormActionObject {
  type:
    | 'changeDate'
    | 'changeGame'
    | 'addPlayer'
    | 'removePlayer'
    | 'changePlayerData'
  payload: { [prop: string]: string }
}

const initialAddMatchState: MatchObject = {
  id: uuidv4(),
  date: '',
  game: '',
  gameId: '',
  participants: {
    player1: {
      name: '',
      result: 'n/a',
      score: 'n/a',
    },
  },
  playOrder: -1,
}

const addMatchStateReducer = (
  state: MatchObject,
  action: MatchFormActionObject
): MatchObject => {
  switch (action.type) {
    case 'changeDate':
      return { ...state, date: action.payload.date }
    case 'changeGame':
      return {
        ...state,
        gameId: action.payload.gameId,
        game: action.payload.gameTitle,
      }
    case 'addPlayer':
      return {
        ...state,
        participants: {
          ...state.participants,
          [`player${+action.payload.n}`]: {
            name: '',
            result: 'n/a',
            score: 'n/a',
          },
        },
      }
    case 'removePlayer':
      let stateCopy = { ...state }
      delete stateCopy.participants[`player${action.payload.n}`]
      return stateCopy
    case 'changePlayerData':
      let stateCopy2 = { ...state }
      stateCopy2.participants[`player${action.payload.n}`] = {
        ...stateCopy2.participants[`player${action.payload.n}`],
        [action.payload.key]: action.payload.value,
      }
      return stateCopy2
  }
}

const AddMatchForm: React.FC<AddMatchFormProps> = ({ setFormIsActive }) => {
  const [numberOfPlayers, setNumberOfPlayers] = useState(1)
  const { games } = useContext(GamesContext)
  const [addMatchState, dispatch] = useReducer(
    addMatchStateReducer,
    initialAddMatchState
  )

  // thought i spotted a bug, below throw if it reproduces
  // otherwise, delete this eventually
  if (numberOfPlayers !== Object.keys(addMatchState.participants).length) {
    throw new Error('DID NOT MATCH!')
  }

  console.log('addMatchState =', addMatchState)

  return (
    <Dialog open={true} onClose={() => setFormIsActive(false)}>
      <DialogTitle>Add a new match</DialogTitle>

      <DialogContent>
        <form>
          <TextField
            size="small"
            type="date"
            value={addMatchState.date}
            onChange={e =>
              dispatch({
                type: 'changeDate',
                payload: { date: e.target.value },
              })
            }
          />
          <br />
          <br />
          <FormControl size="small" sx={{ minWidth: 125 }}>
            <InputLabel id="game-label">Game</InputLabel>
            <Select
              sx={{ minHeight: 40 }}
              size="small"
              label="Game"
              labelId="game-label"
              value={addMatchState.gameId}
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
              <MenuItem key={'null'} value=""></MenuItem>
              {Array.isArray(games) &&
                games.length > 0 &&
                games.map(game => (
                  <MenuItem value={game.id} key={game.id}>
                    {game.title}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <br />

          {/* for # of players, add one below, w/ dynamic fields as needed */}

          {Array.from({ length: numberOfPlayers }, (v, i) => i + 1).map(n => {
            return (
              <>
                <Divider textAlign="left" sx={{ margin: '15px 0' }}>
                  {`Player #${n}`}
                </Divider>

                <div className="player-box">
                  <FormControl size="small" sx={{ minWidth: '125px' }}>
                    <InputLabel id={`p${n}-name-label`}>Name</InputLabel>
                    <Select
                      label="Name"
                      labelId={`p${n}-name-label`}
                      sx={{ minHeight: 40 }}
                      value={addMatchState.participants[`player${n}`].name}
                      onChange={e => {
                        dispatch({
                          type: 'changePlayerData',
                          payload: {
                            n: `${n}`,
                            key: 'name',
                            value: e.target.value,
                          },
                        })
                      }}
                    >
                      <MenuItem key={'null'}></MenuItem>
                      {true
                        ? ['dinis', 'kris', 'lais', 'susan'].map(player => {
                            return (
                              <MenuItem value={player} key={player}>
                                {player}
                              </MenuItem>
                            )
                          })
                        : ''}
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ minWidth: '125px' }}>
                    <InputLabel id={`p${n}-result-label`}>Result</InputLabel>
                    <Select
                      label="Result"
                      labelId={`p${n}-result-label`}
                      sx={{ minHeight: 40 }}
                      value={addMatchState.participants[`player${n}`].result}
                      onChange={e => {
                        dispatch({
                          type: 'changePlayerData',
                          payload: {
                            n: `${n}`,
                            key: 'result',
                            value: e.target.value,
                          },
                        })
                      }}
                    >
                      <MenuItem key={'null'}></MenuItem>
                      <MenuItem value="win">win</MenuItem>
                      <MenuItem value="loss">loss</MenuItem>
                      <MenuItem value="draw">draw</MenuItem>
                      <MenuItem value="n/a">n/a</MenuItem>
                    </Select>
                  </FormControl>

                  <div>
                    <TextField
                      label="Score"
                      size="small"
                      type="text"
                      value={addMatchState.participants[`player${n}`].score}
                      onChange={e => {
                        dispatch({
                          type: 'changePlayerData',
                          payload: {
                            n: `${n}`,
                            key: 'score',
                            value: e.target.value,
                          },
                        })
                      }}
                    />
                  </div>
                </div>
              </>
            )
          })}
          <IconButton
            size="large"
            onClick={() => {
              dispatch({
                type: 'addPlayer',
                payload: { n: `${numberOfPlayers + 1}` },
              })
              setNumberOfPlayers(prev => prev + 1)
            }}
            color="success"
          >
            <AddCircleIcon fontSize="inherit" />
          </IconButton>
          {numberOfPlayers > 1 ? (
            <IconButton
              size="large"
              onClick={() => {
                dispatch({
                  type: 'removePlayer',
                  payload: { n: `${numberOfPlayers}` },
                })
                setNumberOfPlayers(prev => prev - 1)
              }}
              color="error"
            >
              <RemoveCircleIcon fontSize="inherit" />
            </IconButton>
          ) : (
            ''
          )}

          <DialogActions>
            <Button variant="contained">Add</Button>
            <Button variant="outlined" onClick={() => setFormIsActive(false)}>
              Close
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddMatchForm
