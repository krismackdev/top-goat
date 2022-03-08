import React, { useContext, useState } from 'react'
import { MatchesContext } from '../../store/matches-context'
import './MatchPage.css'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
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
              <TableCell>header row</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>data row</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default MatchPage
