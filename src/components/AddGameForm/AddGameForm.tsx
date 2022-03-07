import React, { useReducer } from 'react'
import './AddGameForm.css'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  link: string
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
  const [addGameState, dispatch] = useReducer(
    addGameStateReducer,
    initialAddGameState
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('form submitted')
    dispatch({ type: 'resetForm', payload: '' })
  }

  console.log('state =', addGameState)

  return (
    <Dialog open={true} onClose={() => setFormIsActive(false)}>
      <DialogTitle sx={{ textAlign: 'center' }}>Add a new game</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            size="small"
            value={addGameState.title}
            onChange={e =>
              dispatch({ type: 'changeTitle', payload: e.target.value })
            }
          />
          <TextField
            label="Image URL"
            size="small"
            value={addGameState.image}
            onChange={e =>
              dispatch({ type: 'changeImage', payload: e.target.value })
            }
          />
          <TextField
            label="BGG Link"
            size="small"
            value={addGameState.link}
            onChange={e =>
              dispatch({ type: 'changeLink', payload: e.target.value })
            }
          />
          <Select
            value={addGameState.players.one}
            size="small"
            onChange={e =>
              dispatch({ type: 'changePlayerOne', payload: e.target.value })
            }
          >
            <MenuItem value="no">no</MenuItem>
            <MenuItem value="ok">ok</MenuItem>
            <MenuItem value="yes">yes</MenuItem>
          </Select>
          <Select
            value={addGameState.players.two}
            size="small"
            onChange={e =>
              dispatch({ type: 'changePlayerTwo', payload: e.target.value })
            }
          >
            <MenuItem value="no">no</MenuItem>
            <MenuItem value="ok">ok</MenuItem>
            <MenuItem value="yes">yes</MenuItem>
          </Select>
          <Select
            value={addGameState.players.three}
            size="small"
            onChange={e =>
              dispatch({ type: 'changePlayerThree', payload: e.target.value })
            }
          >
            <MenuItem value="no">no</MenuItem>
            <MenuItem value="ok">ok</MenuItem>
            <MenuItem value="yes">yes</MenuItem>
          </Select>
          <Select
            value={addGameState.players.four}
            size="small"
            onChange={e =>
              dispatch({ type: 'changePlayerFour', payload: e.target.value })
            }
          >
            <MenuItem value="no">no</MenuItem>
            <MenuItem value="ok">ok</MenuItem>
            <MenuItem value="yes">yes</MenuItem>
          </Select>
          <Select
            value={addGameState.players.five}
            size="small"
            onChange={e =>
              dispatch({ type: 'changePlayerFive', payload: e.target.value })
            }
          >
            {' '}
            <MenuItem value="no">no</MenuItem>
            <MenuItem value="ok">ok</MenuItem>
            <MenuItem value="yes">yes</MenuItem>
          </Select>
          <DialogActions>
            {/* ADD & CLOSE BUTTON HERE */}
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
