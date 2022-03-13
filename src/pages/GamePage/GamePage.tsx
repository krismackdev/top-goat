import React, { useContext, useState } from 'react'
import { GamesContext } from '../../store/games-context'
import GameTableCell from '../../mui/GameTableCell'
import { AddGameForm, GameTableRow } from '../../components'
import './GamePage.css'
import {
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import GridOffIcon from '@mui/icons-material/GridOff'
import GridOnIcon from '@mui/icons-material/GridOn'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons'

const GamePage: React.FC = () => {
  const { games, reverseSortTitle, sortByTitle } = useContext(GamesContext)
  const [formIsActive, setFormIsActive] = useState(false)
  const [gridViewIsActive, setGridViewIsActive] = useState(false)

  return (
    <div className="game-page-container">
      {formIsActive && <AddGameForm setFormIsActive={setFormIsActive} />}
      <IconButton onClick={() => setGridViewIsActive(prev => !prev)}>
        {gridViewIsActive ? (
          <GridOffIcon color="success" />
        ) : (
          <GridOnIcon color="success" />
        )}
      </IconButton>
      <button onClick={() => setFormIsActive(true)}>Add Game</button>
      <TableContainer component={Paper} sx={{ width: '85%', margin: '0 auto' }}>
        <Table size="small">
          {gridViewIsActive ? (
            <>
              <TableHead>
                <TableRow>
                  <GameTableCell sx={{ minWidth: '232' }} onClick={sortByTitle}>
                    Game &nbsp;
                    {reverseSortTitle ? (
                      <FontAwesomeIcon icon={faCaretDown} />
                    ) : (
                      <FontAwesomeIcon icon={faCaretUp} />
                    )}
                  </GameTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <Grid container rowSpacing={1} columnSpacing={1}>
                  {Array.isArray(games) && games.length > 0
                    ? games.map(game => {
                        return (
                          <Grid item xs={6} sm={4} md={3} lg={2}>
                            <a href={game.link}>
                              <img
                                className="game-page-image-container"
                                src={game.image}
                                alt="game cover"
                              />
                            </a>
                          </Grid>
                        )
                      })
                    : ''}
                </Grid>
              </TableBody>
            </>
          ) : (
            <>
              <TableHead>
                <TableRow>
                  <GameTableCell sx={{ minWidth: 232 }} onClick={sortByTitle}>
                    Game &nbsp;
                    {reverseSortTitle ? (
                      <FontAwesomeIcon icon={faCaretDown} />
                    ) : (
                      <FontAwesomeIcon icon={faCaretUp} />
                    )}
                  </GameTableCell>
                  <GameTableCell align="center">Pic</GameTableCell>
                  <GameTableCell align="center">Link</GameTableCell>
                  <GameTableCell align="center">Played</GameTableCell>
                  <GameTableCell align="center">1p</GameTableCell>
                  <GameTableCell align="center">2p</GameTableCell>
                  <GameTableCell align="center">3p</GameTableCell>
                  <GameTableCell align="center">4p</GameTableCell>
                  <GameTableCell align="center">5p</GameTableCell>
                  <GameTableCell align="center">Last</GameTableCell>
                  <GameTableCell align="center">Plays</GameTableCell>
                  <GameTableCell align="center">Delete</GameTableCell>
                  <GameTableCell align="center">Edit</GameTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(games) && games.length > 0 ? (
                  games.map(game => <GameTableRow game={game} key={game.id} />)
                ) : (
                  <TableRow>
                    <GameTableCell>NO GAMES FOUND</GameTableCell>
                  </TableRow>
                )}
              </TableBody>
            </>
          )}
        </Table>
      </TableContainer>
    </div>
  )
}

export default GamePage
