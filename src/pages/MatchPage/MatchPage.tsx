import React, { Fragment, useContext, useState } from 'react'
import { MatchesContext } from '../../store/matches-context'
import { PlayersContext } from '../../store/players-context'
import { AddMatchForm, MatchTableRow } from '../../components'
import MatchTableCell from '../../mui/MatchTableCell'
import './MatchPage.css'
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons'

const MatchPage: React.FC = () => {
  const [formIsActive, setFormIsActive] = useState(false)
  const { matches, reverseSortMatch, sortMatches } = useContext(MatchesContext)
  const { players } = useContext(PlayersContext)

  return (
    <div className="match-page-container">
      <Button variant="contained" onClick={() => setFormIsActive(true)}>
        Add Match
      </Button>
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
