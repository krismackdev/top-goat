import React, { useContext, useReducer, useState } from 'react'
import { GamesContext } from '../../store/games-context'
import './AddGameForm.css'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
// @ts-ignore
import { v4 as uuidv4 } from 'uuid'

interface AddGameFormProps {
  setFormIsActive: React.Dispatch<React.SetStateAction<boolean>>
}

type PlayerSuitability = 'yes' | 'no' | 'ok'

interface GameObject {
  id: string
  image: string
  lastPlayedDate: string
  link: string
  matchesArray: string[]
  players: {
    one: PlayerSuitability
    two: PlayerSuitability
    three: PlayerSuitability
    four: PlayerSuitability
    five: PlayerSuitability
  }
  title: string
}

interface ActionObject {
  type:
    | 'changeImage'
    | 'changeLink'
    | 'changePlayerOne'
    | 'changePlayerTwo'
    | 'changePlayerThree'
    | 'changePlayerFour'
    | 'changePlayerFive'
    | 'changeTitle'
    | 'resetForm'
  payload: string
}

const initialAddGameState: GameObject = {
  id: uuidv4(),
  image: '',
  link: '',
  lastPlayedDate: '',
  matchesArray: [],
  title: '',
  players: {
    one: 'no',
    two: 'no',
    three: 'no',
    four: 'no',
    five: 'no',
  },
}

const addGameStateReducer = (state: GameObject, action: ActionObject) => {
  switch (action.type) {
    case 'changeTitle':
      return { ...state, title: action.payload! }
    case 'changeImage':
      return { ...state, image: action.payload! }
    case 'changeLink':
      return { ...state, link: action.payload! }
    case 'changePlayerOne':
      if (
        action.payload === 'no' ||
        action.payload === 'ok' ||
        action.payload === 'yes'
      ) {
        return {
          ...state,
          players: {
            ...state.players,
            one: action.payload as PlayerSuitability,
          },
        }
      }
      return state
    case 'changePlayerTwo':
      if (
        action.payload === 'no' ||
        action.payload === 'ok' ||
        action.payload === 'yes'
      ) {
        return {
          ...state,
          players: {
            ...state.players,
            two: action.payload as PlayerSuitability,
          },
        }
      }
      return state
    case 'changePlayerThree':
      if (
        action.payload === 'no' ||
        action.payload === 'ok' ||
        action.payload === 'yes'
      ) {
        return {
          ...state,
          players: {
            ...state.players,
            three: action.payload as PlayerSuitability,
          },
        }
      }
      return state
    case 'changePlayerFour':
      if (
        action.payload === 'no' ||
        action.payload === 'ok' ||
        action.payload === 'yes'
      ) {
        return {
          ...state,
          players: {
            ...state.players,
            four: action.payload as PlayerSuitability,
          },
        }
      }
      return state
    case 'changePlayerFive':
      if (
        action.payload === 'no' ||
        action.payload === 'ok' ||
        action.payload === 'yes'
      ) {
        return {
          ...state,
          players: {
            ...state.players,
            five: action.payload as PlayerSuitability,
          },
        }
      }
      return state
    case 'resetForm':
      return { ...initialAddGameState, id: uuidv4() }
  }
}

const AddGameForm: React.FC<AddGameFormProps> = ({ setFormIsActive }) => {
  const { addNewGame } = useContext(GamesContext)
  const [formIsInvalid, setFormIsInvalid] = useState(false)
  const [addGameState, dispatch] = useReducer(
    addGameStateReducer,
    initialAddGameState
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (
      addGameState.title.trim() === '' ||
      addGameState.image.trim() === '' ||
      addGameState.link.trim() === ''
    ) {
      setFormIsInvalid(true)
      return
    }
    addNewGame(addGameState)
    setFormIsInvalid(false)
    dispatch({ type: 'resetForm', payload: '' })
  }

  return (
    <Dialog open={true} onClose={() => setFormIsActive(false)}>
      <DialogTitle sx={{ textAlign: 'center' }}>Add a new game</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} className="add-game-form">
          <TextField
            sx={{ marginBottom: '20px' }}
            label="Title"
            size="small"
            value={addGameState.title}
            onChange={e =>
              dispatch({ type: 'changeTitle', payload: e.target.value })
            }
            error={formIsInvalid && addGameState.title.trim().length === 0}
            helperText={
              formIsInvalid && addGameState.title.trim().length === 0
                ? '* this field is required'
                : ''
            }
          />
          <TextField
            sx={{ marginBottom: '20px' }}
            label="Image URL"
            size="small"
            value={addGameState.image}
            onChange={e =>
              dispatch({ type: 'changeImage', payload: e.target.value })
            }
            error={formIsInvalid && addGameState.image.trim().length === 0}
            helperText={
              formIsInvalid && addGameState.image.trim().length === 0
                ? '* this field is required'
                : ''
            }
          />
          <TextField
            sx={{ marginBottom: '20px' }}
            label="BGG Link"
            size="small"
            value={addGameState.link}
            onChange={e =>
              dispatch({ type: 'changeLink', payload: e.target.value })
            }
            error={formIsInvalid && addGameState.link.trim().length === 0}
            helperText={
              formIsInvalid && addGameState.link.trim().length === 0
                ? '* this field is required'
                : ''
            }
          />
          <InputLabel id="oneP">Suitable for 1 player?</InputLabel>
          <Select
            labelId="oneP"
            value={addGameState.players.one}
            size="small"
            sx={{ marginBottom: '20px' }}
            onChange={e =>
              dispatch({ type: 'changePlayerOne', payload: e.target.value })
            }
          >
            <MenuItem value="no">no</MenuItem>
            <MenuItem value="ok">ok</MenuItem>
            <MenuItem value="yes">yes</MenuItem>
          </Select>
          <InputLabel id="twoP">Suitable for 2 players?</InputLabel>
          <Select
            labelId="twoP"
            value={addGameState.players.two}
            size="small"
            sx={{ marginBottom: '20px' }}
            onChange={e =>
              dispatch({ type: 'changePlayerTwo', payload: e.target.value })
            }
          >
            <MenuItem value="no">no</MenuItem>
            <MenuItem value="ok">ok</MenuItem>
            <MenuItem value="yes">yes</MenuItem>
          </Select>
          <InputLabel id="threeP">Suitable for 3 players?</InputLabel>
          <Select
            labelId="threeP"
            value={addGameState.players.three}
            size="small"
            sx={{ marginBottom: '20px' }}
            onChange={e =>
              dispatch({ type: 'changePlayerThree', payload: e.target.value })
            }
          >
            <MenuItem value="no">no</MenuItem>
            <MenuItem value="ok">ok</MenuItem>
            <MenuItem value="yes">yes</MenuItem>
          </Select>
          <InputLabel id="fourP">Suitable for 4 players?</InputLabel>
          <Select
            labelId="fourP"
            value={addGameState.players.four}
            size="small"
            sx={{ marginBottom: '20px' }}
            onChange={e =>
              dispatch({ type: 'changePlayerFour', payload: e.target.value })
            }
          >
            <MenuItem value="no">no</MenuItem>
            <MenuItem value="ok">ok</MenuItem>
            <MenuItem value="yes">yes</MenuItem>
          </Select>
          <InputLabel id="fiveP">Suitable for 5+ players?</InputLabel>
          <Select
            labelId="fiveP"
            value={addGameState.players.five}
            size="small"
            sx={{ marginBottom: '20px' }}
            onChange={e =>
              dispatch({ type: 'changePlayerFive', payload: e.target.value })
            }
          >
            <MenuItem value="no">no</MenuItem>
            <MenuItem value="ok">ok</MenuItem>
            <MenuItem value="yes">yes</MenuItem>
          </Select>
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

export default AddGameForm
