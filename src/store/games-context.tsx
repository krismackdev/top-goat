import React from 'react'
import { createContext, useEffect, useState } from 'react'
import { db } from '../firebase/config'
import {
  collection,
  doc,
  deleteDoc,
  getDocs,
  updateDoc,
  setDoc,
} from 'firebase/firestore'

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
  addNewGame: (newGame: GameObject) => void
  deleteGame: (id: string) => void
  games: GameObject[] | undefined
  reverseSortTitle: boolean
  sortByTitle: () => void
  updateGame: (game: GameObject) => void
}>({
  addNewGame: () => {},
  deleteGame: () => {},
  games: undefined,
  reverseSortTitle: false,
  sortByTitle: () => {},
  updateGame: () => {},
})

export const GamesContextProvider = ({
  children,
}: GamesContextProviderProps) => {
  const [games, setGames] = useState<GameObject[] | undefined>(undefined)
  const [reverseSortTitle, setReverseSortTitle] = useState(false)

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
          // ************* is it safe to be asserting as GameObject here?
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

  const addNewGame = async (newGame: GameObject): Promise<void> => {
    const { id, ...newGameWithoutId } = newGame
    await setDoc(doc(db, 'games', newGame.id), newGameWithoutId)
    setGamesWithFetchedData()
  }

  const deleteGame = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'games', id))
    setGamesWithFetchedData()
  }

  const sortByTitle = (): void => {
    setReverseSortTitle(prev => !prev)
    setGames(prev => {
      if (prev) {
        return prev
          .map(x => x)
          .sort((a, b) => {
            if (a.title.toLowerCase() > b.title.toLowerCase()) {
              return reverseSortTitle ? 1 : -1
            } else {
              return reverseSortTitle ? -1 : 1
            }
          })
      }
    })
  }

  const updateGame = async (game: GameObject): Promise<void> => {
    // using spread operator below due to firebase issue #5853
    // ... if you use game as is, it causes a typescript error
    const { id, ...gameWithoutId } = { ...game }
    await updateDoc(doc(db, 'games', game.id), { ...gameWithoutId })
    setGamesWithFetchedData()
  }

  return (
    <GamesContext.Provider
      value={{
        addNewGame,
        deleteGame,
        games,
        reverseSortTitle,
        sortByTitle,
        updateGame,
      }}
    >
      {children}
    </GamesContext.Provider>
  )
}
