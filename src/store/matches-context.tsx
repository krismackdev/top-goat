import { createContext, useEffect, useState } from 'react'
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

interface ParticipantsObject {
  [prop: string]: PlayerResultObject
}

interface PlayerResultObject {
  name: string
  result: Result
  score: string
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

type MatchesContextProviderProps = { children: React.ReactNode }

export const MatchesContext = createContext<{
  addNewMatch: (newGame: MatchObjectWithStringScore) => void
  deleteMatch: (id: string) => void
  matches: MatchObject[] | undefined
  reverseSortMatch: boolean
  sortMatches: (payload: SortMatchArg) => void
  updateMatch: (match: MatchObject) => void
}>({
  addNewMatch: () => {},
  deleteMatch: () => {},
  matches: undefined,
  reverseSortMatch: false,
  sortMatches: () => {},
  updateMatch: () => {},
})

export const MatchesContextProvider = ({
  children,
}: MatchesContextProviderProps) => {
  const [matches, setMatches] = useState<MatchObject[] | undefined>(undefined)
  const [currentPlayOrder, setCurrentPlayOrder] = useState<number | undefined>(
    undefined
  )
  const [reverseSortMatch, setReverseSortMatch] = useState(false)

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

  const addNewMatch = async (
    newMatch: MatchObjectWithStringScore
  ): Promise<void> => {
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
        matches,
        reverseSortMatch,
        sortMatches,
        updateMatch,
      }}
    >
      {children}
    </MatchesContext.Provider>
  )
}
