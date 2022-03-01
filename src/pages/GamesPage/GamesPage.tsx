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
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Header 1</TableCell>
              <TableCell>Header 2</TableCell>
              <TableCell>Header 3</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell>data 1</TableCell>
              <TableCell>data 2</TableCell>
              <TableCell>data 3</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default GamesPage
