import React, { useContext, useState } from 'react'
import { GamesContext } from '../../store/games-context'
import GameTableCell from '../../mui/GameTableCell'
import { AddGameForm, GameFilter, GameTableRow } from '../../components'
import './GamePage.css'
import {
  Button,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
} from '@mui/material'
import GridOffIcon from '@mui/icons-material/GridOff'
import GridOnIcon from '@mui/icons-material/GridOn'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons'

const GamePage: React.FC = () => {
  const {
    filteredGames: games,
    reverseSortGames,
    resetGameFilterState,
    sortGames,
  } = useContext(GamesContext)
  const [formIsActive, setFormIsActive] = useState(false)
  const [gridViewIsActive, setGridViewIsActive] = useState(false)
  const [showGameFilters, setShowGameFilters] = useState(false)
  const [tabGameValue, setTabGameValue] = useState('')
  const [activeSortingColumn, setActiveSortingColumn] = useState('title')

  const handleGameColumnSort = (columnName: string) => {
    sortGames({ field: columnName })
    setActiveSortingColumn(columnName)
  }

  return (
    <div className="game-page-container">
      {formIsActive && <AddGameForm setFormIsActive={setFormIsActive} />}
      <Grid container rowSpacing={1} columnSpacing={1}>
        <IconButton onClick={() => setGridViewIsActive(prev => !prev)}>
          {gridViewIsActive ? (
            <GridOffIcon color="success" />
          ) : (
            <GridOnIcon color="success" />
          )}
        </IconButton>
        <Button variant="contained" onClick={() => setFormIsActive(true)}>
          Add Game
        </Button>
        <Button
          variant="contained"
          onClick={() => setShowGameFilters(prev => !prev)}
        >
          {showGameFilters ? 'HIDE' : 'SHOW'} FILTERS
        </Button>
        <Button variant="contained" onClick={resetGameFilterState}>
          CLEAR FILTERS
        </Button>
        {showGameFilters && tabGameValue !== '' && (
          <GameFilter filter={tabGameValue} />
        )}
      </Grid>
      {showGameFilters && (
        <Tabs
          sx={{ marginBottom: '5px', marginLeft: '5px' }}
          value={tabGameValue}
          onChange={(e, newVal) => setTabGameValue(newVal)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab value="played" label="played" />
          <Tab value="one" label="one" />
          <Tab value="two" label="two" />
          <Tab value="three" label="three" />
          <Tab value="four" label="four" />
          <Tab value="five" label="five" />
          <Tab value="lastPlayed" label="last Played" />
          <Tab value="playCount" label="play Count" />
        </Tabs>
      )}

      <TableContainer component={Paper} sx={{ width: '85%', margin: '0 auto' }}>
        <Table size="small">
          {gridViewIsActive ? (
            <>
              <TableHead>
                <TableRow>
                  <GameTableCell
                    sx={{ minWidth: '232' }}
                    onClick={() => handleGameColumnSort('title')}
                  >
                    Game &nbsp;
                    {activeSortingColumn === 'title' ? (
                      reverseSortGames ? (
                        <FontAwesomeIcon icon={faCaretDown} />
                      ) : (
                        <FontAwesomeIcon icon={faCaretUp} />
                      )
                    ) : (
                      ''
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
                  <GameTableCell
                    sx={{ minWidth: 232 }}
                    onClick={() => handleGameColumnSort('title')}
                  >
                    Game &nbsp;
                    {activeSortingColumn === 'title' ? (
                      reverseSortGames ? (
                        <FontAwesomeIcon icon={faCaretDown} />
                      ) : (
                        <FontAwesomeIcon icon={faCaretUp} />
                      )
                    ) : (
                      ''
                    )}
                  </GameTableCell>
                  <GameTableCell align="center">Pic</GameTableCell>
                  <GameTableCell align="center">Link</GameTableCell>
                  <GameTableCell
                    align="center"
                    sx={{ minWidth: 100 }}
                    onClick={() => handleGameColumnSort('played')}
                  >
                    Played&nbsp;
                    {activeSortingColumn === 'played' ? (
                      reverseSortGames ? (
                        <FontAwesomeIcon icon={faCaretDown} />
                      ) : (
                        <FontAwesomeIcon icon={faCaretUp} />
                      )
                    ) : (
                      ''
                    )}
                  </GameTableCell>
                  <GameTableCell
                    align="center"
                    sx={{ minWidth: 70 }}
                    onClick={() => handleGameColumnSort('1p')}
                  >
                    1p&nbsp;
                    {activeSortingColumn === '1p' ? (
                      reverseSortGames ? (
                        <FontAwesomeIcon icon={faCaretDown} />
                      ) : (
                        <FontAwesomeIcon icon={faCaretUp} />
                      )
                    ) : (
                      ''
                    )}
                  </GameTableCell>
                  <GameTableCell
                    align="center"
                    sx={{ minWidth: 70 }}
                    onClick={() => handleGameColumnSort('2p')}
                  >
                    2p&nbsp;
                    {activeSortingColumn === '2p' ? (
                      reverseSortGames ? (
                        <FontAwesomeIcon icon={faCaretDown} />
                      ) : (
                        <FontAwesomeIcon icon={faCaretUp} />
                      )
                    ) : (
                      ''
                    )}
                  </GameTableCell>
                  <GameTableCell
                    align="center"
                    sx={{ minWidth: 70 }}
                    onClick={() => handleGameColumnSort('3p')}
                  >
                    3p&nbsp;
                    {activeSortingColumn === '3p' ? (
                      reverseSortGames ? (
                        <FontAwesomeIcon icon={faCaretDown} />
                      ) : (
                        <FontAwesomeIcon icon={faCaretUp} />
                      )
                    ) : (
                      ''
                    )}
                  </GameTableCell>
                  <GameTableCell
                    align="center"
                    sx={{ minWidth: 70 }}
                    onClick={() => handleGameColumnSort('4p')}
                  >
                    4p&nbsp;
                    {activeSortingColumn === '4p' ? (
                      reverseSortGames ? (
                        <FontAwesomeIcon icon={faCaretDown} />
                      ) : (
                        <FontAwesomeIcon icon={faCaretUp} />
                      )
                    ) : (
                      ''
                    )}
                  </GameTableCell>
                  <GameTableCell
                    align="center"
                    sx={{ minWidth: 70 }}
                    onClick={() => handleGameColumnSort('5p')}
                  >
                    5p&nbsp;
                    {activeSortingColumn === '5p' ? (
                      reverseSortGames ? (
                        <FontAwesomeIcon icon={faCaretDown} />
                      ) : (
                        <FontAwesomeIcon icon={faCaretUp} />
                      )
                    ) : (
                      ''
                    )}
                  </GameTableCell>
                  <GameTableCell
                    align="center"
                    sx={{ minWidth: 110 }}
                    onClick={() => handleGameColumnSort('lastPlayedDate')}
                  >
                    Last&nbsp;
                    {activeSortingColumn === 'lastPlayedDate' ? (
                      reverseSortGames ? (
                        <FontAwesomeIcon icon={faCaretDown} />
                      ) : (
                        <FontAwesomeIcon icon={faCaretUp} />
                      )
                    ) : (
                      ''
                    )}
                  </GameTableCell>
                  <GameTableCell
                    align="center"
                    sx={{ minWidth: 90 }}
                    onClick={() => handleGameColumnSort('plays')}
                  >
                    Plays&nbsp;
                    {activeSortingColumn === 'plays' ? (
                      reverseSortGames ? (
                        <FontAwesomeIcon icon={faCaretDown} />
                      ) : (
                        <FontAwesomeIcon icon={faCaretUp} />
                      )
                    ) : (
                      ''
                    )}
                  </GameTableCell>
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
