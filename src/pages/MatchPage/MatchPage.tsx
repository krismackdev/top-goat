import React, { Fragment, useContext, useState } from 'react'
import { MatchesContext, PlayersContext } from '../../store'
import { AddMatchForm, MatchFilter, MatchTableRow } from '../../components'
import MatchTableCell from '../../mui/MatchTableCell'
import styles from './MatchPage.module.css'
import {
  Button,
  Grid,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
} from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons'

const MatchPage: React.FC = () => {
  const [activeSortingColumn, setActiveSortingColumn] = useState('playOrder')
  const [formIsActive, setFormIsActive] = useState(false)
  const [showMatchFilters, setShowMatchFilters] = useState(false)
  const [tabMatchValue, setTabMatchValue] = useState('')
  const {
    filteredMatches: matches,
    resetMatchFilterState,
    reverseSortMatches,
    sortMatches,
  } = useContext(MatchesContext)
  const { players } = useContext(PlayersContext)

  const handleMatchColumnSort = (columnName: string) => {
    if (columnName.slice(0, 6) === 'result') {
      sortMatches({ playerId: columnName.slice(7), field: 'result' })
    } else if (columnName.slice(0, 5) === 'score') {
      sortMatches({ playerId: columnName.slice(6), field: 'score' })
    } else {
      sortMatches({ field: columnName })
    }
    setActiveSortingColumn(columnName)
  }

  return (
    <div className={styles['match-page-container']}>
      <Grid
        container
        sx={{
          width: '85%',
          maxWidth: '1500px',
          margin: '0 auto',
          marginBottom: showMatchFilters ? 0 : 1,
        }}
        className={styles.singleGrid}
      >
        <Grid item>
          <Button
            variant="contained"
            color="success"
            onClick={() => setFormIsActive(true)}
          >
            Add Match
          </Button>
        </Grid>
        <Grid item sx={{ marginLeft: 1 }}>
          <Button
            variant="contained"
            onClick={() => setShowMatchFilters(prev => !prev)}
          >
            FILTERS
          </Button>
        </Grid>
        <Grid item sx={{ marginLeft: 1 }}>
          <Button variant="contained" onClick={resetMatchFilterState}>
            CLEAR
          </Button>
        </Grid>
        <Grid item sx={{ marginLeft: 3 }}>
          {showMatchFilters && tabMatchValue !== '' && (
            <MatchFilter filter={tabMatchValue} />
          )}
        </Grid>
      </Grid>

      {/* below is same as above, but uses 2 grid containers, so that filters go on next line and are styled better at breakpoint */}

      <Grid
        container
        sx={{
          width: '85%',
          maxWidth: '1500px',
          margin: '0 auto',
          marginBottom: showMatchFilters ? 2.4 : 1,
          display: 'none',
        }}
        className={styles.dualGrid}
      >
        <Grid item>
          <Button
            variant="contained"
            color="success"
            onClick={() => setFormIsActive(true)}
          >
            Add Match
          </Button>
        </Grid>
        <Grid item sx={{ marginLeft: 1 }}>
          <Button
            variant="contained"
            onClick={() => setShowMatchFilters(prev => !prev)}
          >
            FILTERS
          </Button>
        </Grid>
        <Grid item sx={{ marginLeft: 1 }}>
          <Button variant="contained" onClick={resetMatchFilterState}>
            CLEAR
          </Button>
        </Grid>
      </Grid>
      <Grid
        container
        sx={{
          width: '85%',
          maxWidth: '1500px',
          margin: '0 auto',
          marginBottom: showMatchFilters ? 0 : 1,
          display: 'none',
        }}
        className={styles.dualGrid}
      >
        <Grid item sx={{ marginLeft: -2 }}>
          {showMatchFilters && tabMatchValue !== '' && (
            <MatchFilter filter={tabMatchValue} />
          )}
        </Grid>
      </Grid>

      {showMatchFilters && (
        <Grid
          container
          sx={{ width: '85%', maxWidth: '1500px', margin: '0 auto' }}
        >
          <Tabs
            sx={{ marginBottom: '5px', marginLeft: -1.5 }}
            value={tabMatchValue}
            onChange={(e, newVal) => setTabMatchValue(newVal)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab value="games" label="games" />
            <Tab value="playedDate" label="played date" />
            <Tab value="players" label="players" />
          </Tabs>
        </Grid>
      )}

      {formIsActive && <AddMatchForm setFormIsActive={setFormIsActive} />}

      <TableContainer
        component={Paper}
        sx={{ width: '85%', maxWidth: '1500px', margin: '0 auto' }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <MatchTableCell
                sx={{ minWidth: '60px' }}
                onClick={() => handleMatchColumnSort('playOrder')}
              >
                # &nbsp;
                {activeSortingColumn === 'playOrder' ? (
                  reverseSortMatches ? (
                    <FontAwesomeIcon icon={faCaretUp} />
                  ) : (
                    <FontAwesomeIcon icon={faCaretDown} />
                  )
                ) : (
                  ''
                )}
              </MatchTableCell>
              <MatchTableCell sx={{ minWidth: '85px' }}>Date</MatchTableCell>
              <MatchTableCell
                sx={{ minWidth: '90px' }}
                onClick={() => handleMatchColumnSort('game')}
              >
                Game &nbsp;
                {activeSortingColumn === 'game' ? (
                  reverseSortMatches ? (
                    <FontAwesomeIcon icon={faCaretUp} />
                  ) : (
                    <FontAwesomeIcon icon={faCaretDown} />
                  )
                ) : (
                  ''
                )}
              </MatchTableCell>
              {players?.map(player => (
                <Fragment key={player.id}>
                  <MatchTableCell
                    onClick={() => handleMatchColumnSort(`result-${player.id}`)}
                    sx={{ minWidth: '100px' }}
                  >
                    {player.name
                      .split('')
                      .map((char, idx) =>
                        idx === 0 ? char.toUpperCase() : char
                      )
                      .join('')}{' '}
                    &nbsp;
                    {activeSortingColumn === `result-${player.id}` ? (
                      reverseSortMatches ? (
                        <FontAwesomeIcon icon={faCaretUp} />
                      ) : (
                        <FontAwesomeIcon icon={faCaretDown} />
                      )
                    ) : (
                      ''
                    )}
                  </MatchTableCell>
                  <MatchTableCell
                    sx={{ minWidth: '90px' }}
                    onClick={() => handleMatchColumnSort(`score-${player.id}`)}
                  >
                    score &nbsp;
                    {activeSortingColumn === `score-${player.id}` ? (
                      reverseSortMatches ? (
                        <FontAwesomeIcon icon={faCaretUp} />
                      ) : (
                        <FontAwesomeIcon icon={faCaretDown} />
                      )
                    ) : (
                      ''
                    )}
                  </MatchTableCell>
                </Fragment>
              ))}
              <MatchTableCell>Delete</MatchTableCell>
              <MatchTableCell>Edit</MatchTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(matches) && matches.length > 0 ? (
              matches.map(match => (
                <MatchTableRow match={match} players={players} key={match.id} />
              ))
            ) : (
              <TableRow>
                <TableCell>NO MATCHES FOUND</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default MatchPage
