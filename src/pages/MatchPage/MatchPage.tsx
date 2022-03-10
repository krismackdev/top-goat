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

const MatchPage: React.FC = () => {
  const [formIsActive, setFormIsActive] = useState(false)
  const { matches } = useContext(MatchesContext)
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
              <MatchTableCell>Number</MatchTableCell>
              <MatchTableCell>Date</MatchTableCell>
              <MatchTableCell>Game</MatchTableCell>
              {players?.map(player => (
                <Fragment key={player.id}>
                  <MatchTableCell>
                    {player.name
                      .split('')
                      .map((char, idx) =>
                        idx === 0 ? char.toUpperCase() : char
                      )
                      .join('')}
                  </MatchTableCell>
                  <MatchTableCell>score</MatchTableCell>
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
                <MatchTableCell>NO GAMES FOUND</MatchTableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default MatchPage
