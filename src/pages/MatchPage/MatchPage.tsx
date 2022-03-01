import './MatchPage.css'
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

type GameArray = GamesState[] | []

const MatchPage = () => {
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

  console.log('games = ', games)

  return (
    <div className="match-page-container">
      <p>Match Page!</p>
    </div>
  )
}

export default MatchPage
