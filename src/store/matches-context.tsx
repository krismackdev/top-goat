import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { GamesContext } from './games-context'
import { PlayersContext } from './players-context'
import { db } from '../firebase/config'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore'

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
  playOrder: number
  participants: ParticipantsObject
}

interface PlayerResultObjectWithScore {
  name: string
  result: Result
  score: string
}

interface ParticipantObjectWithStringScore {
  [prop: string]: PlayerResultObjectWithScore
}

interface MatchObjectWithStringScore {
  id: string
  date: string
  game: string
  gameId: string
  playOrder: number
  participants: ParticipantObjectWithStringScore
}

interface SortMatchArg {
  [prop: string]: string
}

interface MatchFilterPlayersObject {
  [prop: string]: 'include' | 'exclude' | 'require'
}

interface MatchFilterStateObject {
  dates: {
    usingStart: boolean
    usingEnd: boolean
    start: string
    end: string
  }
  gamesArray: string[]
  players: MatchFilterPlayersObject
}

type MatchesContextProviderProps = { children: React.ReactNode }

export const MatchesContext = createContext<{
  addNewMatch: (newGame: MatchObjectWithStringScore) => void
  deleteMatch: (id: string) => void
  filteredMatches: MatchObject[] | undefined
  matches: MatchObject[] | undefined
  matchFilterState: MatchFilterStateObject
  reverseSortMatch: boolean
  setMatchFilterState: React.Dispatch<
    React.SetStateAction<MatchFilterStateObject>
  >
  sortMatches: (payload: SortMatchArg) => void
  updateMatch: (match: MatchObject) => void
}>({
  addNewMatch: () => {},
  deleteMatch: () => {},
  filteredMatches: undefined,
  matches: undefined,
  matchFilterState: {
    dates: {
      usingStart: false,
      usingEnd: false,
      start: '',
      end: '',
    },
    gamesArray: [],
    players: {},
  },
  reverseSortMatch: false,
  setMatchFilterState: () => {},
  sortMatches: () => {},
  updateMatch: () => {},
})

export const MatchesContextProvider = ({
  children,
}: MatchesContextProviderProps) => {
  const [matches, setMatches] = useState<MatchObject[] | undefined>(undefined)
  const [filteredMatches, setFilteredMatches] = useState<
    MatchObject[] | undefined
  >(undefined)
  const [currentPlayOrder, setCurrentPlayOrder] = useState<number | undefined>(
    undefined
  )
  const [reverseSortMatch, setReverseSortMatch] = useState(false)
  const { games } = useContext(GamesContext)
  const { players } = useContext(PlayersContext)

  const initialMatchFilterState: MatchFilterStateObject = {
    gamesArray: games?.map((game: any) => game.title) ?? [],
    players: {},
    dates: {
      usingStart: false,
      usingEnd: false,
      start: new Date().toISOString().slice(0, 10),
      end: new Date().toISOString().slice(0, 10),
    },
  }

  const [matchFilterState, setMatchFilterState] = useState(
    initialMatchFilterState
  )

  useEffect(() => {
    setMatchFilterState(prev => {
      return {
        ...prev,
        gamesArray: games?.map((game: any) => game.title) ?? [],
      }
    })
  }, [games])

  useEffect(() => {
    let updatedPlayers: MatchFilterPlayersObject = {}
    players?.forEach(player => {
      if (!Object.keys(matchFilterState.players).includes(player.name))
        updatedPlayers[player.name] = 'include'
    })

    setMatchFilterState(prev => {
      return {
        ...prev,
        players: updatedPlayers,
      }
    })
  }, [players])

  // this function sets the matches state with data from firestore
  const setMatchesWithFetchedData = async () => {
    const fetchMatches = async () => {
      const matchesRef = collection(db, 'matches')
      const matchesCollection = await getDocs(matchesRef)
      return matchesCollection
    }

    const downloadedMatches = await fetchMatches().then(res => {
      const result: MatchObject[] = []
      res.docs.forEach(doc => {
        let currentMatch = doc.data()
        if (currentMatch) {
          currentMatch = { ...currentMatch, id: doc.id }
          // ************* is it safe to be asserting as MatchObjecct here?
          result.push(currentMatch as MatchObject)
        }
      })
      return result
    })
    let newCurrentPlayOrder = 0
    downloadedMatches.forEach(match => {
      if (match.playOrder > newCurrentPlayOrder) {
        newCurrentPlayOrder = match.playOrder
      }
    })
    setCurrentPlayOrder(newCurrentPlayOrder)
    downloadedMatches.sort((a, b) => {
      return b.playOrder - a.playOrder
    })
    setMatches(downloadedMatches)
  }

  useEffect(() => {
    setMatchesWithFetchedData()
  }, [])

  const returnFilteredMatches = useCallback(() => {
    if (!matches) {
      return undefined
    }
    let res = [...matches]

    // handle games filter
    res = res.filter(match => {
      return matchFilterState.gamesArray.includes(match.game)
    })

    // handle playedDate filter
    res = res.filter(match => {
      let dateInComparableFormat =
        match.date.slice(6) +
        '-' +
        match.date.slice(0, 3) +
        match.date.slice(3, 5)
      if (
        !matchFilterState.dates.usingStart &&
        !matchFilterState.dates.usingEnd
      ) {
        return match
      }
      if (!matchFilterState.dates.usingStart) {
        return (
          dateInComparableFormat &&
          new Date(dateInComparableFormat) <=
            new Date(matchFilterState.dates.end)
        )
      }
      if (!matchFilterState.dates.usingEnd) {
        return (
          dateInComparableFormat &&
          new Date(dateInComparableFormat) >=
            new Date(matchFilterState.dates.start)
        )
      }
      return (
        dateInComparableFormat &&
        new Date(dateInComparableFormat) >=
          new Date(matchFilterState.dates.start) &&
        new Date(dateInComparableFormat) <= new Date(matchFilterState.dates.end)
      )
    })

    // filter out matches with excluded players
    res = res.filter(match => {
      const playersInvolved = Object.keys(match.participants).map(
        playerId => match.participants[playerId].name
      )
      return !playersInvolved.some(
        player => matchFilterState.players[player] === 'exclude'
      )
    })

    // for any required players, filter out matches without them
    res = res.filter(match => {
      let requiredPlayers = Object.keys(matchFilterState.players).filter(
        player => matchFilterState.players[player] === 'require'
      )

      if (requiredPlayers.length > 0) {
        for (let player of requiredPlayers) {
          if (
            !Object.keys(match.participants)
              .map(playerId => match.participants[playerId].name)
              .includes(player)
          ) {
            return false
          }
        }
      }
      return true
    })

    return res
  }, [matches, matchFilterState])

  useEffect(() => {
    setFilteredMatches(returnFilteredMatches())
  }, [matches, returnFilteredMatches])

  const addNewMatch = async (
    newMatch: MatchObjectWithStringScore
  ): Promise<void> => {
    console.log('in ADM, newMatch =', newMatch)
    const { id, ...matchWithoutId } = newMatch
    await setDoc(doc(db, 'matches', id), {
      ...matchWithoutId,
      playOrder: currentPlayOrder ? currentPlayOrder + 1 : 1,
    })

    setMatchesWithFetchedData()
  }

  const deleteMatch = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'matches', id))
    setMatchesWithFetchedData()
  }

  const sortMatches = (payload: SortMatchArg) => {
    switch (payload.field) {
      case 'playOrder':
        setMatches(prev => {
          return prev
            ?.map(x => x)
            .sort((a, b) => {
              if (reverseSortMatch) {
                return b.playOrder - a.playOrder
              } else {
                return a.playOrder - b.playOrder
              }
            })
        })
        break
      case 'game':
        setMatches(prev => {
          return prev
            ?.map(x => x)
            .sort((a, b) => {
              if (reverseSortMatch) {
                return b.game > a.game ? 1 : -1
              } else {
                return a.game > b.game ? 1 : -1
              }
            })
        })
        break
      case 'result':
        setMatches(prev => {
          return prev
            ?.map(x => x)
            .sort((a, b) => {
              let aa, bb
              if (reverseSortMatch) {
                aa = a.participants[payload.playerId]?.result ?? 'zzz'
                bb = b.participants[payload.playerId]?.result ?? 'zzz'
                return aa > bb ? 1 : -1
              } else {
                aa = a.participants[payload.playerId]?.result ?? 'aaa'
                bb = b.participants[payload.playerId]?.result ?? 'aaa'
                return bb > aa ? 1 : -1
              }
            })
        })
        break
      case 'score':
        setMatches(prev => {
          return prev
            ?.map(x => x)
            .sort((a, b) => {
              let aa = a.participants[payload.playerId]?.score
              let bb = b.participants[payload.playerId]?.score
              switch (true) {
                case !aa && !bb:
                  return -1
                case !aa:
                  return 1
                case !bb:
                  return -1
                case aa === 'n/a' && bb === 'n/a':
                  return -1
                case aa === 'n/a':
                  return 1
                case bb === 'n/a':
                  return -1
                case !isNaN(+aa) && !isNaN(+bb):
                  return reverseSortMatch
                    ? +aa > +bb
                      ? 1
                      : -1
                    : +aa > +bb
                    ? -1
                    : 1
                case !isNaN(+aa):
                  return -1
                case !isNaN(+bb):
                  return 1
                default:
                  return -1
              }
            })
        })
        break
    }
    setReverseSortMatch(prev => !prev)
  }

  const updateMatch = async (match: MatchObject): Promise<void> => {
    // using spread operator below due to firebase issue #5853
    // ... if you use match as is, it causes a typescript error
    const { id, ...matchWithoutId } = { ...match }
    await updateDoc(doc(db, 'matches', id), { ...matchWithoutId })
    setMatchesWithFetchedData()
  }

  return (
    <MatchesContext.Provider
      value={{
        addNewMatch,
        deleteMatch,
        filteredMatches,
        matches,
        matchFilterState,
        reverseSortMatch,
        setMatchFilterState,
        sortMatches,
        updateMatch,
      }}
    >
      {children}
    </MatchesContext.Provider>
  )
}
