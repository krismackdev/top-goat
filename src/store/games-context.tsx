import React, { PropsWithChildren } from 'react'
import { createContext, useEffect, useState } from 'react'
import { db } from '../firebase/config'
import { collection, getDocs } from 'firebase/firestore'

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

const GamesContext = createContext<GamesState[]>([])

export const GamesContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const [games, setGames] = useState([])

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
            result.push(currentGame)
          }
        })
        return result
      })

      setGames(downloadedGames)
    }

    setGamesInitially()
  }, [])

  console.log('games =', games)

  return <GamesContext.Provider value={games}>{children}</GamesContext.Provider>
}
