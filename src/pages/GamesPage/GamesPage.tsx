import React from 'react'
import './GamesPage.css'
import { db } from '../../firebase/config'
import { collection, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'

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
    // then set games state with the result
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
    </div>
  )
}

export default GamesPage
