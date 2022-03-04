import React, { useContext } from 'react'
import { GamesContext } from '../../store/games-context'
import './GamesPage.css'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { tableCellClasses } from '@mui/material/TableCell'
import { styled } from '@mui/system'
import IconButton from '@mui/material/IconButton'
import OpenInBrowserTwoToneIcon from '@mui/icons-material/OpenInBrowserTwoTone'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

const StyledTableCell = styled(TableCell)({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'rgb(48, 43, 43)',
    color: 'white',
    fontWeight: 'bold',
    borderRight: '1px solid rgb(48, 43, 43)',
  },
  [`&.${tableCellClasses.body}`]: {
    borderRight: '1px solid black',
  },
})

const GamesPage: React.FC = () => {
  const gamesCtx = useContext(GamesContext)

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
    gamesCtx.deleteGame(id)
  }

  const handleEdit = (): void => {
    console.log('EDITING...')
  }

  return (
    <div className="games-page-container">
      <TableContainer component={Paper} sx={{ width: '85%', margin: '0 auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ minWidth: 232 }}>Game</StyledTableCell>
              <StyledTableCell align="center">Pic</StyledTableCell>
              <StyledTableCell align="center">Link</StyledTableCell>
              <StyledTableCell align="center">Played</StyledTableCell>
              <StyledTableCell align="center">1p</StyledTableCell>
              <StyledTableCell align="center">2p</StyledTableCell>
              <StyledTableCell align="center">3p</StyledTableCell>
              <StyledTableCell align="center">4p</StyledTableCell>
              <StyledTableCell align="center">5p</StyledTableCell>
              <StyledTableCell align="center">Last</StyledTableCell>
              <StyledTableCell align="center">Plays</StyledTableCell>
              <StyledTableCell align="center">Delete</StyledTableCell>
              <StyledTableCell align="center">Edit</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(gamesCtx.games) && gamesCtx.games.length > 0 ? (
              gamesCtx.games.map(game => {
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
                        backgroundColor: `${getConditionalColor(
                          game.players.one
                        )}`,
                      }}
                      align="center"
                    >
                      {game.players.one}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        backgroundColor: `${getConditionalColor(
                          game.players.two
                        )}`,
                      }}
                      align="center"
                    >
                      {game.players.two}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        backgroundColor: `${getConditionalColor(
                          game.players.three
                        )}`,
                      }}
                      align="center"
                    >
                      {game.players.three}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        backgroundColor: `${getConditionalColor(
                          game.players.four
                        )}`,
                      }}
                      align="center"
                    >
                      {game.players.four}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        backgroundColor: `${getConditionalColor(
                          game.players.five
                        )}`,
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
              })
            ) : (
              <TableRow>
                <StyledTableCell>No Data To Show</StyledTableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default GamesPage
