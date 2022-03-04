import React, { useContext, useReducer } from 'react'
import { GamesContext } from '../../store/games-context'
import StyledTableCell from '../../mui/StyledTableCell'
import { TableRow } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import OpenInBrowserTwoToneIcon from '@mui/icons-material/OpenInBrowserTwoTone'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import CancelIcon from '@mui/icons-material/Cancel'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

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

interface GameTableRowProps {
  game: GameObject
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
    | 'toggleEditingMode'
  payload?: string
}

interface EditStateObject extends GameObject {
  isActive: boolean
}

const GameTableRow: React.FC<GameTableRowProps> = ({ game }) => {
  const initialEditState = {
    id: game.id,
    image: game.image,
    isActive: false,
    link: game.link,
    players: {
      one: game.players.one,
      two: game.players.two,
      three: game.players.three,
      four: game.players.four,
      five: game.players.five,
    },
    title: game.title,
  }

  const editStateReducer = (state: EditStateObject, action: ActionObject) => {
    switch (action.type) {
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
      case 'changeTitle':
        return { ...state, title: action.payload! }
      case 'toggleEditingMode':
        return { ...state, isActive: !state.isActive }
    }
  }

  const [editState, dispatch] = useReducer(editStateReducer, initialEditState)

  console.log('editState =', editState)

  const { deleteGame, updateGame } = useContext(GamesContext)

  const getConditionalColor = (val: PlayerSuitability) => {
    switch (val) {
      case 'yes':
        return '#1EA51E'
      case 'ok':
        return '#7CEC98'
      default:
        return '#777777'
    }
  }

  const handleDelete = (id: string): void => {
    deleteGame(id)
  }

  if (editState.isActive) {
    return (
      <TableRow key={game.id}>
        <StyledTableCell>
          <TextField
            variant="standard"
            value={editState.title}
            onChange={e =>
              dispatch({ type: 'changeTitle', payload: e.target.value })
            }
          />
        </StyledTableCell>
        <StyledTableCell>
          <TextField
            variant="standard"
            value={editState.image}
            onChange={e =>
              dispatch({ type: 'changeImage', payload: e.target.value })
            }
          />
        </StyledTableCell>
        <StyledTableCell>
          <TextField
            variant="standard"
            value={editState.link}
            onChange={e =>
              dispatch({ type: 'changeLink', payload: e.target.value })
            }
          />
        </StyledTableCell>
        <StyledTableCell>...</StyledTableCell>
        <StyledTableCell>
          <Select
            value={editState.players.one}
            onChange={e =>
              dispatch({ type: 'changePlayerOne', payload: e.target.value })
            }
          >
            <MenuItem value={'no'}>no</MenuItem>
            <MenuItem value={'ok'}>ok</MenuItem>
            <MenuItem value={'yes'}>yes</MenuItem>
          </Select>
        </StyledTableCell>
        <StyledTableCell>
          <Select
            value={editState.players.two}
            onChange={e =>
              dispatch({ type: 'changePlayerTwo', payload: e.target.value })
            }
          >
            <MenuItem value={'no'}>no</MenuItem>
            <MenuItem value={'ok'}>ok</MenuItem>
            <MenuItem value={'yes'}>yes</MenuItem>
          </Select>
        </StyledTableCell>
        <StyledTableCell>
          <Select
            value={editState.players.three}
            onChange={e =>
              dispatch({ type: 'changePlayerThree', payload: e.target.value })
            }
          >
            <MenuItem value={'no'}>no</MenuItem>
            <MenuItem value={'ok'}>ok</MenuItem>
            <MenuItem value={'yes'}>yes</MenuItem>
          </Select>
        </StyledTableCell>
        <StyledTableCell>
          <Select
            value={editState.players.four}
            onChange={e =>
              dispatch({ type: 'changePlayerFour', payload: e.target.value })
            }
          >
            <MenuItem value={'no'}>no</MenuItem>
            <MenuItem value={'ok'}>ok</MenuItem>
            <MenuItem value={'yes'}>yes</MenuItem>
          </Select>
        </StyledTableCell>
        <StyledTableCell>
          <Select
            value={editState.players.five}
            onChange={e =>
              dispatch({ type: 'changePlayerFive', payload: e.target.value })
            }
          >
            <MenuItem value={'no'}>no</MenuItem>
            <MenuItem value={'ok'}>ok</MenuItem>
            <MenuItem value={'yes'}>yes</MenuItem>
          </Select>
        </StyledTableCell>
        <StyledTableCell>...</StyledTableCell>
        <StyledTableCell>...</StyledTableCell>
        <StyledTableCell>
          {/* delete cell is empty during edit by design */}
        </StyledTableCell>

        <StyledTableCell align="center">
          <IconButton
            sx={{ color: 'green' }}
            onClick={() => {
              const { isActive, ...updatedGame } = editState
              updateGame(updatedGame)
              dispatch({ type: 'toggleEditingMode' })
            }}
          >
            <CheckIcon />
          </IconButton>
          <IconButton
            sx={{ color: 'red' }}
            onClick={() => dispatch({ type: 'toggleEditingMode' })}
          >
            <CancelIcon />
          </IconButton>
        </StyledTableCell>
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
      <TableRow key={game.id}>
        <StyledTableCell>{game.title}</StyledTableCell>
        <StyledTableCell align="center">
          <img
            style={{ maxWidth: '30px' }}
            src={game.image}
            alt={`${game.title.replace(/\s+/g, '-')}-pic`}
          ></img>
        </StyledTableCell>
        <StyledTableCell align="center">
          <a href={game.link} target="_blank" rel="noreferrer">
            <OpenInBrowserTwoToneIcon />
          </a>
        </StyledTableCell>
        <StyledTableCell align="center">...</StyledTableCell>
        <StyledTableCell
          sx={{
            backgroundColor: `${getConditionalColor(game.players.one)}`,
          }}
          align="center"
        >
          {game.players.one}
        </StyledTableCell>
        <StyledTableCell
          sx={{
            backgroundColor: `${getConditionalColor(game.players.two)}`,
          }}
          align="center"
        >
          {game.players.two}
        </StyledTableCell>
        <StyledTableCell
          sx={{
            backgroundColor: `${getConditionalColor(game.players.three)}`,
          }}
          align="center"
        >
          {game.players.three}
        </StyledTableCell>
        <StyledTableCell
          sx={{
            backgroundColor: `${getConditionalColor(game.players.four)}`,
          }}
          align="center"
        >
          {game.players.four}
        </StyledTableCell>
        <StyledTableCell
          sx={{
            backgroundColor: `${getConditionalColor(game.players.five)}`,
          }}
          align="center"
        >
          {game.players.five}
        </StyledTableCell>
        <StyledTableCell align="center">...</StyledTableCell>
        <StyledTableCell align="center">...</StyledTableCell>
        <StyledTableCell align="center">
          <IconButton
            sx={{ color: 'black' }}
            onClick={() => handleDelete(game.id)}
          >
            <DeleteIcon />
          </IconButton>
        </StyledTableCell>
        <StyledTableCell align="center">
          <IconButton
            disableRipple
            sx={{ color: 'black' }}
            onClick={() => dispatch({ type: 'toggleEditingMode' })}
          >
            <EditIcon />
          </IconButton>
        </StyledTableCell>
      </TableRow>
    )
  }
}

export default GameTableRow
