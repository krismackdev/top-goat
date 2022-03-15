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
  lastPlayedDate: string
  link: string
  matchesArray: string[]
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

interface SortGameArg {
  [prop: string]: string
}

export const GamesContext = createContext<{
  addNewGame: (newGame: GameObject) => void
  deleteGame: (id: string) => void
  games: GameObject[] | undefined
  reverseSortGames: boolean
  sortGames: (payload: SortGameArg) => void
  updateGame: (game: GameObject) => void
}>({
  addNewGame: () => {},
  deleteGame: () => {},
  games: undefined,
  reverseSortGames: false,
  sortGames: () => {},
  updateGame: () => {},
})

export const GamesContextProvider = ({
  children,
}: GamesContextProviderProps) => {
  const [games, setGames] = useState<GameObject[] | undefined>(undefined)
  const [reverseSortGames, setReverseSortGames] = useState(false)

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

  const sortGames = (payload: SortGameArg): void => {
    switch (payload.field) {
      case 'title':
        setGames(prev => {
          return prev
            ?.map(x => x)
            .sort((a, b) => {
              if (a.title.toLowerCase() > b.title.toLowerCase()) {
                return reverseSortGames ? 1 : -1
              } else {
                return reverseSortGames ? -1 : 1
              }
            })
        })
        break
      case 'played':
        setGames(prev => {
          return prev
            ?.map(x => x)
            .sort((a, b) => {
              if (a.lastPlayedDate === '') {
                return reverseSortGames ? -1 : 1
              } else if (b.lastPlayedDate === '') {
                return reverseSortGames ? 1 : -1
              }
              return -1
            })
        })
        break
      case '1p':
        setGames(prev => {
          return prev
            ?.map(x => x)
            .sort((a, b) => {
              if (a.players.one > b.players.one) {
                return reverseSortGames ? 1 : -1
              } else {
                return reverseSortGames ? -1 : 1
              }
            })
        })
        break
      case '2p':
        setGames(prev => {
          return prev
            ?.map(x => x)
            .sort((a, b) => {
              if (a.players.two > b.players.two) {
                return reverseSortGames ? 1 : -1
              } else {
                return reverseSortGames ? -1 : 1
              }
            })
        })
        break
      case '3p':
        setGames(prev => {
          return prev
            ?.map(x => x)
            .sort((a, b) => {
              if (a.players.three > b.players.three) {
                return reverseSortGames ? 1 : -1
              } else {
                return reverseSortGames ? -1 : 1
              }
            })
        })
        break
      case '4p':
        setGames(prev => {
          return prev
            ?.map(x => x)
            .sort((a, b) => {
              if (a.players.four > b.players.four) {
                return reverseSortGames ? 1 : -1
              } else {
                return reverseSortGames ? -1 : 1
              }
            })
        })
        break
      case '5p':
        setGames(prev => {
          return prev
            ?.map(x => x)
            .sort((a, b) => {
              if (a.players.five > b.players.five) {
                return reverseSortGames ? 1 : -1
              } else {
                return reverseSortGames ? -1 : 1
              }
            })
        })
        break
      case 'lastPlayedDate':
        setGames(prev => {
          return prev
            ?.map(x => x)
            .sort((a, b) => {
              if (a.lastPlayedDate === '') {
                return reverseSortGames ? -1 : 1
              } else if (b.lastPlayedDate === '') {
                return reverseSortGames ? 1 : -1
              } else if (
                +a.lastPlayedDate.slice(6) > +b.lastPlayedDate.slice(6)
              ) {
                return reverseSortGames ? 1 : -1
              } else if (
                +a.lastPlayedDate.slice(6) === +b.lastPlayedDate.slice(6) &&
                +a.lastPlayedDate.slice(0, 2) > +b.lastPlayedDate.slice(0, 2)
              ) {
                return reverseSortGames ? 1 : -1
              } else if (
                +a.lastPlayedDate.slice(6) === +b.lastPlayedDate.slice(6) &&
                +a.lastPlayedDate.slice(0, 2) ===
                  +b.lastPlayedDate.slice(0, 2) &&
                +a.lastPlayedDate.slice(3, 5) > +b.lastPlayedDate.slice(3, 5)
              ) {
                return reverseSortGames ? 1 : -1
              } else {
                return reverseSortGames ? -1 : 1
              }
            })
        })
        break
      case 'plays':
        setGames(prev => {
          return prev
            ?.map(x => x)
            .sort((a, b) => {
              if (a.matchesArray.length > b.matchesArray.length) {
                return reverseSortGames ? 1 : -1
              } else {
                return reverseSortGames ? -1 : 1
              }
            })
        })
        break
    }
    setReverseSortGames(prev => !prev)
  }

  const updateGame = async (game: GameObject): Promise<void> => {
    // using spread operator below due to firebase issue #5853
    // ... if you use game as is, it causes a typescript error
    const { id, ...gameWithoutId } = { ...game }
    await updateDoc(doc(db, 'games', id), { ...gameWithoutId })
    setGamesWithFetchedData()
  }

  return (
    <GamesContext.Provider
      value={{
        addNewGame,
        deleteGame,
        games,
        reverseSortGames,
        sortGames,
        updateGame,
      }}
    >
      {children}
    </GamesContext.Provider>
  )
}
