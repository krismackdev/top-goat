import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { MatchesContext } from './matches-context'
import { auth, db } from '../firebase/config'
import {
  collection,
  doc,
  deleteDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { onAuthStateChanged, User as firebaseUser } from 'firebase/auth'

interface GameObject {
  id: string
  image: string
  lastPlayedDate: string
  link: string
  matchesArray: string[]
  owner: string
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

interface GameFilterStateObject {
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

type Result = 'win' | 'loss' | 'draw' | 'n/a'

interface PlayerResultObject {
  name: string
  result: Result
  score: string
}

interface ParticipantsObject {
  [prop: string]: PlayerResultObject
}

interface MatchObject {
  id: string
  date: string
  game: string
  gameId: string
  owner: string
  playOrder: number
  participants: ParticipantsObject
}

const initialGameFilterState: GameFilterStateObject = {
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
  addNewGameFromImportedData: (newGame: GameObject) => void
  deleteAllGames: () => void
  deleteGame: (id: string) => void
  gameFilterState: GameFilterStateObject
  getHighScores: (
    id: string | undefined,
    matches: MatchObject[] | undefined
  ) => any
  filteredGames: GameObject[] | undefined
  games: GameObject[] | undefined
  resetGameFilterState: () => void
  reverseSortGames: boolean
  setGameFilterState: React.Dispatch<
    React.SetStateAction<GameFilterStateObject>
  >
  setGamesWithFetchedData: () => void
  sortGames: (payload: SortGameArg) => void
  updateGame: (game: GameObject) => void
}>({
  addNewGame: () => {},
  addNewGameFromImportedData: () => {},
  deleteAllGames: () => {},
  deleteGame: () => {},
  gameFilterState: initialGameFilterState,
  getHighScores: () => {},
  filteredGames: undefined,
  games: undefined,
  resetGameFilterState: () => {},
  reverseSortGames: false,
  setGameFilterState: () => {},
  setGamesWithFetchedData: () => {},
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
  const [gameFilterState, setGameFilterState] = useState(initialGameFilterState)
  const [user, setUser] = useState<firebaseUser | null>(null)
  const { matches } = useContext(MatchesContext)

  onAuthStateChanged(auth, currentUser => {
    setUser(currentUser)
  })

  // this function sets the games state with data from firestore
  const setGamesWithFetchedData = async () => {
    if (auth.currentUser === null) {
      return
    } else {
      const fetchGames = async () => {
        const gamesRef = collection(db, 'games')
        const gamesQuery = query(
          gamesRef,
          where('owner', '==', auth?.currentUser?.uid)
        )
        const gamesCollection = await getDocs(gamesQuery)
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
        return result.sort((a, b) => {
          return a.title > b.title ? 1 : -1
        })
      })
      setGames(downloadedGames)
    }
  }

  const returnFilteredGames = useCallback(() => {
    if (!games) {
      return undefined
    }
    let res = [...games]

    // handle played filter
    if (gameFilterState.played.value === 'no') {
      res = res.filter(game => {
        return game.matchesArray.length === 0
      })
    } else if (gameFilterState.played.value === 'yes') {
      res = res.filter(game => {
        return game.matchesArray.length > 0
      })
    }

    // handle one through five filters
    res = res.filter(game => {
      return (
        gameFilterState.one[game.players.one] === true &&
        gameFilterState.two[game.players.two] === true &&
        gameFilterState.three[game.players.three] === true &&
        gameFilterState.four[game.players.four] === true &&
        gameFilterState.five[game.players.five] === true
      )
    })

    // handle lastPlayed filter
    res = res.filter(game => {
      if (
        !gameFilterState.lastPlayed.usingStart &&
        !gameFilterState.lastPlayed.usingEnd
      ) {
        return game
      }
      if (!gameFilterState.lastPlayed.usingStart) {
        return (
          game.lastPlayedDate &&
          new Date(game.lastPlayedDate) <=
            new Date(gameFilterState.lastPlayed.end)
        )
      }
      if (!gameFilterState.lastPlayed.usingEnd) {
        return (
          game.lastPlayedDate &&
          new Date(game.lastPlayedDate) >=
            new Date(gameFilterState.lastPlayed.start)
        )
      }
      return (
        game.lastPlayedDate &&
        new Date(game.lastPlayedDate) >=
          new Date(gameFilterState.lastPlayed.start) &&
        new Date(game.lastPlayedDate) <=
          new Date(gameFilterState.lastPlayed.end)
      )
    })

    // handle playCount filter
    res = res.filter(game => {
      if (
        !gameFilterState.playCount.usingMin &&
        !gameFilterState.playCount.usingMax
      ) {
        return game
      }
      let playCount = game?.matchesArray.length || 0
      if (
        gameFilterState.playCount.usingMin &&
        !gameFilterState.playCount.usingMax
      ) {
        return gameFilterState.playCount.min <= playCount
      }
      if (
        gameFilterState.playCount.usingMax &&
        !gameFilterState.playCount.usingMin
      ) {
        return gameFilterState.playCount.max >= playCount
      }
      return (
        gameFilterState.playCount.min <= playCount &&
        gameFilterState.playCount.max >= playCount
      )
    })

    // return filtered games
    return res
  }, [games, gameFilterState])

  const addNewGame = async (newGame: GameObject): Promise<void> => {
    const { id, ...newGameWithoutId } = newGame
    await setDoc(doc(db, 'games', newGame.id), newGameWithoutId)
    setGamesWithFetchedData()
  }

  const addNewGameFromImportedData = async (
    newGame: GameObject
  ): Promise<void> => {
    const { id, ...newGameWithoutId } = newGame
    await setDoc(doc(db, 'games', id), {
      ...newGameWithoutId,
      owner: auth.currentUser?.uid,
    })
    setGamesWithFetchedData()
  }

  const deleteGame = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'games', id))
    setGamesWithFetchedData()
  }

  const deleteAllGames = async () => {
    if (games) {
      for (let game of games) {
        await deleteDoc(doc(db, 'games', game.id))
      }
    }
    setGamesWithFetchedData()
  }

  const getHighScores = (
    id: string | undefined,
    matches: MatchObject[] | undefined
  ): any => {
    const result: any = {}
    if (matches) {
      for (let match of matches) {
        if (match.gameId === id) {
          for (let playerKey of Object.keys(match.participants)) {
            if (playerKey in result) {
              result[playerKey].push(+match.participants[playerKey].score)
            } else {
              result[playerKey] = [+match.participants[playerKey].score]
            }
          }
        }
      }
    }
    for (let playerId of Object.keys(result)) {
      result[playerId].sort((a: number, b: number) => b - a)
    }
    return result
  }

  const resetGameFilterState = () => {
    setGameFilterState(initialGameFilterState)
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

  useEffect(() => {
    setFilteredGames(returnFilteredGames())
  }, [games, returnFilteredGames])

  useEffect(() => {
    setGamesWithFetchedData()
  }, [])

  useEffect(() => {
    setGamesWithFetchedData()
  }, [user])

  useEffect(() => {
    setGamesWithFetchedData()
  }, [matches])

  return (
    <GamesContext.Provider
      value={{
        addNewGame,
        addNewGameFromImportedData,
        deleteAllGames,
        deleteGame,
        gameFilterState,
        getHighScores,
        filteredGames,
        games,
        resetGameFilterState,
        reverseSortGames,
        setGameFilterState,
        setGamesWithFetchedData,
        sortGames,
        updateGame,
      }}
    >
      {children}
    </GamesContext.Provider>
  )
}
