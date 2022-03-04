import React, { useContext } from 'react'
import { GamesContext } from '../../store/games-context'
import StyledTableCell from '../../mui/StyledTableCell'
import GameTableRow from '../../components/GameTableRow/GameTableRow'
import './GamesPage.css'
import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'

const GamesPage: React.FC = () => {
  const { games } = useContext(GamesContext)

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
            {Array.isArray(games) && games.length > 0 ? (
              games.map(game => <GameTableRow game={game} key={game.id} />)
            ) : (
              <TableRow>
                <StyledTableCell>NO GAMES FOUND</StyledTableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default GamesPage
