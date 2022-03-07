import React, { useReducer } from 'react'
import './AddGameForm.css'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  // players: {
  //   one: PlayerSuitability
  //   two: PlayerSuitability
  //   three: PlayerSuitability
  //   four: PlayerSuitability
  //   five: PlayerSuitability
  // }
  title: string
}

interface ActionObject {
  type:
    | 'changeImage'
    | 'changeLink'
    // | 'changePlayerOne'
    // | 'changePlayerTwo'
    // | 'changePlayerThree'
    // | 'changePlayerFour'
    // | 'changePlayerFive'
    | 'changeTitle'
  payload?: string
}

const addGameStateReducer = (state: GameObject, action: ActionObject) => {
  switch (action.type) {
    case 'changeTitle':
      return { ...state, title: action.payload! }
    case 'changeImage':
      return { ...state, image: action.payload! }
    case 'changeLink':
      return { ...state, link: action.payload! }
  }
}

const AddGameForm: React.FC<AddGameFormProps> = ({ setFormIsActive }) => {
  const initialAddGameState: GameObject = {
    id: uuidv4(),
    image: '',
    link: '',
    title: '',
    // players: {
    //   one: 'no',
    //   two: 'no',
    //   three: 'no',
    //   four: 'no',
    //   five: 'no',
    // },
  }

  const [addGameState, dispatch] = useReducer(
    addGameStateReducer,
    initialAddGameState
  )

  return (
    <Dialog open={true} onClose={() => setFormIsActive(false)}>
      <DialogTitle sx={{ textAlign: 'center' }}>
        <h4>Add a new game</h4>
      </DialogTitle>
      <DialogContent>
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
        <DialogActions>{/* ADD & CLOSE BUTTON HERE */}</DialogActions>
      </DialogContent>
    </Dialog>
  )
}

export default AddGameForm
