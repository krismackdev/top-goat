import React, { useContext } from 'react'
import { GamesContext } from '../../store/games-context'
import './GamesPage.css'
// import { useEffect, useState } from 'react'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { tableCellClasses } from '@mui/material/TableCell'
import { styled } from '@mui/system'

const StyledTableCell = styled(TableCell)({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'rgb(48, 43, 43)',
    color: 'white',
    fontWeight: 'bold',
  },
})

const GamesPage: React.FC = () => {
  const gamesCtx = useContext(GamesContext)

  console.log(gamesCtx)

  return (
    <div className="games-page-container">
      <p>Games Page!</p>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ minWidth: 232 }}>Game</StyledTableCell>
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
            <TableRow>
              {Array.isArray(gamesCtx) && gamesCtx.length > 0 ? (
                gamesCtx.map(game => {
                  console.log('game in map =', game)
                  return (
                    <>
                      <TableCell>{game.title}</TableCell>
                      <TableCell align="center">IMAGE</TableCell>
                      <TableCell align="center">{game.link}</TableCell>
                      <TableCell align="center">unk</TableCell>
                      <TableCell align="center">{game.players.one}</TableCell>
                      <TableCell align="center">{game.players.two}</TableCell>
                      <TableCell align="center">{game.players.three}</TableCell>
                      <TableCell align="center">{game.players.four}</TableCell>
                      <TableCell align="center">{game.players.five}</TableCell>
                      <TableCell align="center">unk</TableCell>
                      <TableCell align="center">unk</TableCell>
                      <TableCell align="center">x</TableCell>
                      <TableCell align="center">^</TableCell>
                    </>
                  )
                })
              ) : (
                <TableCell>No Data To Show</TableCell>
              )}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default GamesPage
