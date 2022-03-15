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
  const [formIsActive, setFormIsActive] = useState(false)
  const [showMatchFilters, setShowMatchFilters] = useState(false)
  const [tabMatchValue, setTabMatchValue] = useState('')
  const {
    filteredMatches: matches,
    reverseSortMatch,
    sortMatches,
  } = useContext(MatchesContext)
  const { players } = useContext(PlayersContext)

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
                onClick={() => sortMatches({ field: 'playOrder' })}
              >
                # &nbsp;
                {reverseSortMatch ? (
                  <FontAwesomeIcon icon={faCaretUp} />
                ) : (
                  <FontAwesomeIcon icon={faCaretDown} />
                )}
              </MatchTableCell>
              <MatchTableCell sx={{ minWidth: '85px' }}>Date</MatchTableCell>
              <MatchTableCell
                sx={{ minWidth: '90px' }}
                onClick={() => sortMatches({ field: 'game' })}
              >
                Game &nbsp;
                {reverseSortMatch ? (
                  <FontAwesomeIcon icon={faCaretUp} />
                ) : (
                  <FontAwesomeIcon icon={faCaretDown} />
                )}
              </MatchTableCell>{' '}
              {players?.map(player => (
                <Fragment key={player.id}>
                  <MatchTableCell
                    onClick={() =>
                      sortMatches({ playerId: player.id, field: 'result' })
                    }
                    sx={{ minWidth: '100px' }}
                  >
                    {player.name
                      .split('')
                      .map((char, idx) =>
                        idx === 0 ? char.toUpperCase() : char
                      )
                      .join('')}{' '}
                    &nbsp;
                    {reverseSortMatch ? (
                      <FontAwesomeIcon icon={faCaretUp} />
                    ) : (
                      <FontAwesomeIcon icon={faCaretDown} />
                    )}
                  </MatchTableCell>
                  <MatchTableCell
                    sx={{ minWidth: '90px' }}
                    onClick={() =>
                      sortMatches({ playerId: player.id, field: 'score' })
                    }
                  >
                    score &nbsp;
                    {reverseSortMatch ? (
                      <FontAwesomeIcon icon={faCaretUp} />
                    ) : (
                      <FontAwesomeIcon icon={faCaretDown} />
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
