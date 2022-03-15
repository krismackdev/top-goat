import React from 'react'
import { createContext, useCallback, useEffect, useState } from 'react'
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

interface FilterAction {
  type: string
}

interface FilterStateObject {
  lastPlayed: {
    start: string
    end: string
    usingStart: boolean
    usingEnd: boolean
  }
  playCount: {
    min: number
    max: number
    usingMin: boolean
    usingMax: boolean
  }
  played: {
    value: 'any' | 'yes' | 'no'
  }
  one: {
    no: boolean
    ok: boolean
    yes: boolean
  }
  two: {
    no: boolean
    ok: boolean
    yes: boolean
  }
  three: {
    no: boolean
    ok: boolean
    yes: boolean
  }
  four: {
    no: boolean
    ok: boolean
    yes: boolean
  }
  five: {
    no: boolean
    ok: boolean
    yes: boolean
  }
}

const initialFilterState: FilterStateObject = {
  lastPlayed: {
    start: new Date().toISOString().slice(0, 10),
    end: new Date().toISOString().slice(0, 10),
    usingStart: false,
    usingEnd: false,
  },
  playCount: {
    min: -1,
    max: 10000000,
    usingMin: false,
    usingMax: false,
  },
  played: {
    value: 'any',
  },
  one: {
    yes: true,
    no: true,
    ok: true,
  },
  two: {
    yes: true,
    no: true,
    ok: true,
  },
  three: {
    yes: true,
    no: true,
    ok: true,
  },
  four: {
    yes: true,
    no: true,
    ok: true,
  },
  five: {
    yes: true,
    no: true,
    ok: true,
  },
}

export const GamesContext = createContext<{
  addNewGame: (newGame: GameObject) => void
  deleteGame: (id: string) => void
  filterState: FilterStateObject
  filteredGames: GameObject[] | undefined
  games: GameObject[] | undefined
  reverseSortGames: boolean
  setFilterState: React.Dispatch<React.SetStateAction<FilterStateObject>>
  sortGames: (payload: SortGameArg) => void
  updateGame: (game: GameObject) => void
}>({
  addNewGame: () => {},
  deleteGame: () => {},
  filterState: initialFilterState,
  filteredGames: undefined,
  games: undefined,
  reverseSortGames: false,
  setFilterState: () => {},
  sortGames: () => {},
  updateGame: () => {},
})

export const GamesContextProvider = ({
  children,
}: GamesContextProviderProps) => {
  const [games, setGames] = useState<GameObject[] | undefined>(undefined)
  const [filteredGames, setFilteredGames] = useState<GameObject[] | undefined>(
    undefined
  )
  const [reverseSortGames, setReverseSortGames] = useState(false)
  const [filterState, setFilterState] = useState(initialFilterState)

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

  const returnFilteredGames = useCallback(() => {
    if (!games) {
      return undefined
    }
    let res = [...games]

    // handle played filter
    if (filterState.played.value === 'no') {
      res = res.filter(game => {
        return game.matchesArray.length === 0
      })
    } else if (filterState.played.value === 'yes') {
      res = res.filter(game => {
        return game.matchesArray.length > 0
      })
    }

    // handle one through five filters
    res = res.filter(game => {
      return (
        filterState.one[game.players.one] === true &&
        filterState.two[game.players.two] === true &&
        filterState.three[game.players.three] === true &&
        filterState.four[game.players.four] === true &&
        filterState.five[game.players.five] === true
      )
    })

    // handle lastPlayed filter
    res = res.filter(game => {
      if (
        !filterState.lastPlayed.usingStart &&
        !filterState.lastPlayed.usingEnd
      ) {
        return game
      }
      if (!filterState.lastPlayed.usingStart) {
        return (
          game.lastPlayedDate &&
          new Date(game.lastPlayedDate) <= new Date(filterState.lastPlayed.end)
        )
      }
      if (!filterState.lastPlayed.usingEnd) {
        return (
          game.lastPlayedDate &&
          new Date(game.lastPlayedDate) >=
            new Date(filterState.lastPlayed.start)
        )
      }
      return (
        game.lastPlayedDate &&
        new Date(game.lastPlayedDate) >=
          new Date(filterState.lastPlayed.start) &&
        new Date(game.lastPlayedDate) <= new Date(filterState.lastPlayed.end)
      )
    })

    // handle playCount filter
    res = res.filter(game => {
      if (!filterState.playCount.usingMin && !filterState.playCount.usingMax) {
        return game
      }
      let playCount = game?.matchesArray.length || 0
      if (filterState.playCount.usingMin && !filterState.playCount.usingMax) {
        return filterState.playCount.min <= playCount
      }
      if (filterState.playCount.usingMax && !filterState.playCount.usingMin) {
        return filterState.playCount.max >= playCount
      }
      return (
        filterState.playCount.min <= playCount &&
        filterState.playCount.max >= playCount
      )
    })

    // return filtered games
    return res
  }, [games, filterState])

  useEffect(() => {
    setFilteredGames(returnFilteredGames())
  }, [games, returnFilteredGames])

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
        filterState,
        filteredGames,
        games,
        reverseSortGames,
        setFilterState,
        sortGames,
        updateGame,
      }}
    >
      {children}
    </GamesContext.Provider>
  )
}
