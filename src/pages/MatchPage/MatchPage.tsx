import React, { useContext, useState } from 'react'
import { MatchesContext } from '../../store/matches-context'
import { MatchTableRow } from '../../components'
import MatchTableCell from '../../mui/MatchTableCell'
import './MatchPage.css'
import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'

const MatchPage: React.FC = () => {
  const { matches } = useContext(MatchesContext)

  console.log('matches =', matches)

  return (
    <div className="match-page-container">
      <TableContainer component={Paper} sx={{ width: '85%', margin: '0 auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <MatchTableCell>Number</MatchTableCell>
              <MatchTableCell>Date</MatchTableCell>
              <MatchTableCell>Game</MatchTableCell>
              <MatchTableCell>Kris</MatchTableCell>
              <MatchTableCell>score</MatchTableCell>
              <MatchTableCell>Lais</MatchTableCell>
              <MatchTableCell>score</MatchTableCell>
              <MatchTableCell>Susan</MatchTableCell>
              <MatchTableCell>score</MatchTableCell>
              <MatchTableCell>Dinis</MatchTableCell>
              <MatchTableCell>score</MatchTableCell>
              <MatchTableCell>Delete</MatchTableCell>
              <MatchTableCell>Edit</MatchTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(matches) && matches.length > 0 ? (
              matches.map(match => (
                <MatchTableRow match={match} key={match.id} />
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
