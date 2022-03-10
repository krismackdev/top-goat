import React, { useEffect, useContext, useReducer, useState } from 'react'
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
import { MatchesContext } from '../../store/matches-context'
import { PlayersContext } from '../../store/players-context'
// @ts-ignore
import { v4 as uuidv4 } from 'uuid'

interface AddMatchFormProps {
  setFormIsActive: React.Dispatch<React.SetStateAction<boolean>>
}

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
    | 'resetMatchForm'
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
    case 'resetMatchForm':
      return { ...initialAddMatchState, id: uuidv4() }
  }
}

const AddMatchForm: React.FC<AddMatchFormProps> = ({ setFormIsActive }) => {
  const [numberOfPlayers, setNumberOfPlayers] = useState(1)
  const [matchFormIsInvalid, setMatchFormIsInvalid] = useState(false)
  const [playerNames, setPlayerNames] = useState<string[] | undefined>(
    undefined
  )
  const { games } = useContext(GamesContext)
  const { addNewMatch } = useContext(MatchesContext)
  const { players } = useContext(PlayersContext)
  const [addMatchState, dispatch] = useReducer(
    addMatchStateReducer,
    initialAddMatchState
  )

  useEffect(() => {
    let tempPlayerNames: string[] = []
    players?.forEach(player => {
      tempPlayerNames.push(player.name)
    })
    setPlayerNames(tempPlayerNames)
  }, [players])

  console.log('players =', players)
  console.log('playerNames =', playerNames)

  // thought i spotted a bug, below throw if it reproduces
  // otherwise, delete this eventually
  if (numberOfPlayers !== Object.keys(addMatchState.participants).length) {
    throw new Error('DID NOT MATCH!')
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    let namesList: string[] = []
    let resultsList: Result[] = []
    let scoresList: string[] = []
    Object.keys(addMatchState.participants).forEach(playerKey => {
      namesList.push(addMatchState.participants[playerKey].name)
      resultsList.push(addMatchState.participants[playerKey].result)
      scoresList.push(addMatchState.participants[playerKey].score)
    })
    console.log(namesList, resultsList, scoresList)
    if (
      addMatchState.id.trim() === '' ||
      addMatchState.date.trim() === '' ||
      addMatchState.game.trim() === '' ||
      addMatchState.gameId.trim() === '' ||
      !namesList.every(name => playerNames?.includes(name)) ||
      !resultsList.every(result =>
        ['win', 'loss', 'draw', 'n/a'].includes(result)
      ) ||
      scoresList.every(score => {
        return score !== 'n/a' && isNaN(+score) && score === ''
      })
    ) {
      setMatchFormIsInvalid(true)
      return
    }

    // this changes the participants props from player-n's to the containing player's id
    let newMatchToAdd = { ...addMatchState }
    Object.keys(newMatchToAdd.participants).forEach(playerN => {
      if (players) {
        let { id: pid } = players.find(
          player => player.name === newMatchToAdd.participants[playerN].name
        )!
        newMatchToAdd.participants[pid] = {
          ...newMatchToAdd.participants[playerN],
        }
        delete newMatchToAdd.participants[playerN]
      }
    })

    addNewMatch(newMatchToAdd)
    setMatchFormIsInvalid(false)
    dispatch({ type: 'resetMatchForm', payload: { x: 'x' } })
    setNumberOfPlayers(1)
  }

  console.log('addMatchState =', addMatchState)

  return (
    <Dialog open={true} onClose={() => setFormIsActive(false)}>
      <DialogTitle>Add a new match</DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit}>
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
            error={matchFormIsInvalid && addMatchState.date.trim().length === 0}
            helperText={
              matchFormIsInvalid && addMatchState.date.trim().length === 0
                ? '* this field is required'
                : ''
            }
          />
          <br />
          <br />
          <FormControl size="small" sx={{ minWidth: 125 }}>
            <InputLabel id="game-label">Game</InputLabel>
            <Select
              error={
                matchFormIsInvalid && addMatchState.game.trim().length === 0
              }
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
            {matchFormIsInvalid && addMatchState.game.trim().length === 0 ? (
              <FormHelperText sx={{ color: 'red' }}>
                * this field is required
              </FormHelperText>
            ) : (
              ''
            )}
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
                      error={
                        matchFormIsInvalid &&
                        addMatchState.participants[`player${n}`].name.trim()
                          .length === 0
                      }
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
                      <MenuItem key={'null'} value=""></MenuItem>
                      {Array.isArray(players) &&
                        players.length > 0 &&
                        players.map(player => (
                          <MenuItem value={player.name} key={player.id}>
                            {player.name}
                          </MenuItem>
                        ))}
                    </Select>
                    {matchFormIsInvalid &&
                    addMatchState.participants[`player${n}`].name.trim()
                      .length === 0 ? (
                      <FormHelperText sx={{ color: 'red' }}>
                        * this field is required
                      </FormHelperText>
                    ) : (
                      ''
                    )}
                  </FormControl>

                  <FormControl size="small" sx={{ minWidth: '125px' }}>
                    <InputLabel id={`p${n}-result-label`}>Result</InputLabel>
                    <Select
                      error={
                        matchFormIsInvalid &&
                        !['win', 'loss', 'draw', 'n/a'].includes(
                          addMatchState.participants[`player${n}`].result.trim()
                        )
                      }
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
                      <MenuItem key={'null'} value=""></MenuItem>
                      <MenuItem value="win">win</MenuItem>
                      <MenuItem value="loss">loss</MenuItem>
                      <MenuItem value="draw">draw</MenuItem>
                      <MenuItem value="n/a">n/a</MenuItem>
                    </Select>
                    {matchFormIsInvalid &&
                    !['win', 'loss', 'draw', 'n/a'].includes(
                      addMatchState.participants[`player${n}`].result.trim()
                    ) ? (
                      <FormHelperText sx={{ color: 'red' }}>
                        * this field is required
                      </FormHelperText>
                    ) : (
                      ''
                    )}
                  </FormControl>

                  <div>
                    <FormControl>
                      <TextField
                        error={
                          matchFormIsInvalid &&
                          addMatchState.participants[`player${n}`].score !==
                            'n/a' &&
                          (isNaN(
                            +addMatchState.participants[`player${n}`].score
                          ) ||
                            addMatchState.participants[`player${n}`].score ===
                              '')
                        }
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
                      {matchFormIsInvalid &&
                      addMatchState.participants[`player${n}`].score !==
                        'n/a' &&
                      (isNaN(+addMatchState.participants[`player${n}`].score) ||
                        addMatchState.participants[`player${n}`].score ===
                          '') ? (
                        <FormHelperText sx={{ color: 'red' }}>
                          * enter a number, or n/a for no score
                        </FormHelperText>
                      ) : (
                        ''
                      )}
                    </FormControl>
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

export default AddMatchForm
