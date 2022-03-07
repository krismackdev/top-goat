import React, { useContext, useState } from 'react'
import { GamesContext } from '../../store/games-context'
import StyledTableCell from '../../mui/StyledTableCell'
import { AddGameForm, GameTableRow } from '../../components'
import './GamePage.css'
import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons'

const GamePage: React.FC = () => {
  const { games, reverseSortTitle, sortByTitle } = useContext(GamesContext)
  const [formIsActive, setFormIsActive] = useState(false)

  const showAddGameForm = () => {
    setFormIsActive(prev => !prev)
  }

  return (
    <div className="game-page-container">
      {formIsActive && <AddGameForm setFormIsActive={setFormIsActive} />}
      <button onClick={showAddGameForm}>Add Game</button>
      <TableContainer component={Paper} sx={{ width: '85%', margin: '0 auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ minWidth: 232 }} onClick={sortByTitle}>
                Game &nbsp;
                {reverseSortTitle ? (
                  <FontAwesomeIcon icon={faCaretDown} />
                ) : (
                  <FontAwesomeIcon icon={faCaretUp} />
                )}
              </StyledTableCell>
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

export default GamePage
