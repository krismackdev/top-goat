import React from 'react'
import './GamesPage.css'
import { db } from '../../firebase/config'
import { collection, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'
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

type PlayerSuitability = 'yes' | 'no' | 'ok'

interface GamesState {
  title: string
  image: string
  players: {
    one: PlayerSuitability
    two: PlayerSuitability
    three: PlayerSuitability
    four: PlayerSuitability
    five: PlayerSuitability
  }
}

const StyledTableCell = styled(TableCell)({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'rgb(48, 43, 43)',
    color: 'white',
    fontWeight: 'bold',
  },
})

const GamesPage: React.FC = () => {
  const [games, setGames] = useState<GamesState[]>([])

  useEffect(() => {
    // this function will get the games from firestore,
    // then set the games state with the result
    const setGamesInitially = async () => {
      const fetchGames = async () => {
        const gamesRef = collection(db, 'games')
        const gamesCollection = await getDocs(gamesRef)
        return gamesCollection
      }
      const downloadedGames = await fetchGames().then(res => {
        const result: GamesState[] = []
        res.docs.forEach(doc => {
          let currentGame = doc.data()
          if (currentGame) {
            result.push(currentGame as GamesState)
          }
        })
        return result
      })
      setGames(downloadedGames)
    }
    setGamesInitially()
  }, [])

  return (
    <div className="games-page-container">
      <p>Games Page!</p>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell>Game</StyledTableCell>
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
              <TableCell>azul</TableCell>
              <TableCell align="center">pic here</TableCell>
              <TableCell align="center">link here</TableCell>
              <TableCell align="center">yes</TableCell>
              <TableCell align="center">no</TableCell>
              <TableCell align="center">yes</TableCell>
              <TableCell align="center">yes</TableCell>
              <TableCell align="center">yes</TableCell>
              <TableCell align="center">no</TableCell>
              <TableCell align="center">today</TableCell>
              <TableCell align="center">10</TableCell>
              <TableCell align="center">x</TableCell>
              <TableCell align="center">O</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default GamesPage
