import React, { Fragment, useContext, useState } from 'react'
import { MatchesContext } from '../../store/matches-context'
import { PlayersContext } from '../../store/players-context'
import { AddMatchForm, MatchFilter, MatchTableRow } from '../../components'
import MatchTableCell from '../../mui/MatchTableCell'
import './MatchPage.css'
import {
  Button,
  Grid,
  Paper,
  Tab,
  Table,
  TableBody,
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
    <div className="match-page-container">
      <Grid container rowSpacing={1} columnSpacing={1}>
        <Button variant="contained" onClick={() => setFormIsActive(true)}>
          Add Match
        </Button>
        <Button
          variant="contained"
          onClick={() => setShowMatchFilters(prev => !prev)}
        >
          {showMatchFilters ? 'HIDE' : 'SHOW'} FILTERS
        </Button>
        <Button variant="contained" onClick={resetMatchFilterState}>
          CLEAR FILTERS
        </Button>

        {showMatchFilters && tabMatchValue !== '' && (
          <MatchFilter filter={tabMatchValue} />
        )}
      </Grid>
      {showMatchFilters && (
        <Tabs
          sx={{ marginBottom: '5px', marginLeft: '5px' }}
          value={tabMatchValue}
          onChange={(e, newVal) => setTabMatchValue(newVal)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab value="games" label="games" />
          <Tab value="playedDate" label="played date" />
          <Tab value="players" label="players" />
        </Tabs>
      )}

      {formIsActive && <AddMatchForm setFormIsActive={setFormIsActive} />}

      <TableContainer component={Paper} sx={{ width: '85%', margin: '0 auto' }}>
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
                    <FontAwesomeIcon icon={faCaretDown} />
                  ) : (
                    <FontAwesomeIcon icon={faCaretUp} />
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
                    <FontAwesomeIcon icon={faCaretDown} />
                  ) : (
                    <FontAwesomeIcon icon={faCaretUp} />
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
                        <FontAwesomeIcon icon={faCaretDown} />
                      ) : (
                        <FontAwesomeIcon icon={faCaretUp} />
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
                        <FontAwesomeIcon icon={faCaretDown} />
                      ) : (
                        <FontAwesomeIcon icon={faCaretUp} />
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
                <MatchTableCell>No matches to show...</MatchTableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default MatchPage
