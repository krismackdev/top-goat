import React from 'react'
import { createContext, useEffect, useState } from 'react'
import { db } from '../firebase/config'
import { collection, doc, deleteDoc, getDocs } from 'firebase/firestore'

interface GameObject {
  id: string
  image: string
  link: string
  players: {
    one: 'yes' | 'no' | 'ok'
    two: 'yes' | 'no' | 'ok'
    three: 'yes' | 'no' | 'ok'
    four: 'yes' | 'no' | 'ok'
    five: 'yes' | 'no' | 'ok'
  }
  title: string
}

type GamesContextProviderProps = { children: React.ReactNode }

export const GamesContext = createContext<{
  games: GameObject[] | undefined
  deleteGame: (id: string) => void
}>({
  games: undefined,
  deleteGame: () => {},
})

export const GamesContextProvider = ({
  children,
}: GamesContextProviderProps) => {
  const [games, setGames] = useState<GameObject[] | undefined>(undefined)

  // this function sets the games state with data from firestore
  const setGamesWithFetchedData = async () => {
    const fetchGames = async () => {
      const gamesRef = collection(db, 'games')
      const gamesCollection = await getDocs(gamesRef)
      return gamesCollection
    }

    const downloadedGames = await fetchGames().then(res => {
      const result: GameObject[] = []
      res.docs.forEach(doc => {
        let currentGame = doc.data()
        if (currentGame) {
          currentGame = { ...currentGame, id: doc.id }
          // ************* is it safe to be asserting as GamesState here?
          result.push(currentGame as GameObject)
        }
      })
      return result
    })

    setGames(downloadedGames)
  }

  useEffect(() => {
    setGamesWithFetchedData()
  }, [])

  const deleteGame = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'games', id))
    setGamesWithFetchedData()
  }

  return (
    <GamesContext.Provider value={{ games, deleteGame }}>
      {children}
    </GamesContext.Provider>
  )
}
