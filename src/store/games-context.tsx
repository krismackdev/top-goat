import React from 'react'
import { createContext, useEffect, useState } from 'react'
import { db } from '../firebase/config'
import { collection, getDocs } from 'firebase/firestore'

type PlayerSuitability = 'yes' | 'no' | 'ok'

interface GamesState {
  image: string
  link: string
  players: {
    one: PlayerSuitability
    two: PlayerSuitability
    three: PlayerSuitability
    four: PlayerSuitability
    five: PlayerSuitability
  }
  title: string
}

type GamesContextProviderProps = { children: React.ReactNode }

export const GamesContext = createContext<GamesState[] | undefined>(undefined)

export const GamesContextProvider = ({
  children,
}: GamesContextProviderProps) => {
  const [games, setGames] = useState<GamesState[] | undefined>(undefined)

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
            // ************* is it safe to be asserting as GamesState here?
            result.push(currentGame as GamesState)
          }
        })
        return result
      })

      setGames(downloadedGames)
    }

    setGamesInitially()
  }, [])

  return <GamesContext.Provider value={games}>{children}</GamesContext.Provider>
}
