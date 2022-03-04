import React, { useContext, useState } from 'react'
import { GamesContext } from '../../store/games-context'
import StyledTableCell from '../../mui/StyledTableCell'
import { TableRow } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import OpenInBrowserTwoToneIcon from '@mui/icons-material/OpenInBrowserTwoTone'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

interface GameObject {
  id: string
  image: string
  link: string
  players: {
    one: 'yes' | 'no' | 'ok'
    two: 'yes' | 'no' | 'ok'
    three: 'yes' | 'no' | 'ok'
    four: 'yes' | 'no' | 'ok'
    five: 'yes' | 'no' | 'ok'
  }
  title: string
}

interface GameTableRowProps {
  game: GameObject
}

const GameTableRow: React.FC<GameTableRowProps> = ({ game }) => {
  const [editingIsActive, setEditingIsActive] = useState(false)
  const { deleteGame } = useContext(GamesContext)

  const getConditionalColor = (val: 'yes' | 'ok' | 'no') => {
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

  const handleEdit = (): void => {
    console.log('EDITING...')
  }

  if (editingIsActive) {
    return <p>Row in edit mode will go here!</p>
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
          <IconButton sx={{ color: 'black' }} onClick={handleEdit}>
            <EditIcon />
          </IconButton>
        </StyledTableCell>
      </TableRow>
    )
  }
}

export default GameTableRow
