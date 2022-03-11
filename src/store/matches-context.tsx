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

type MatchesContextProviderProps = { children: React.ReactNode }

export const MatchesContext = createContext<{
  addNewMatch: (newGame: MatchObjectWithStringScore) => void
  deleteMatch: (id: string) => void
  matches: MatchObject[] | undefined
  updateMatch: (match: MatchObject) => void
}>({
  addNewMatch: () => {},
  deleteMatch: () => {},
  matches: undefined,
  updateMatch: () => {},
})

export const MatchesContextProvider = ({
  children,
}: MatchesContextProviderProps) => {
  const [matches, setMatches] = useState<MatchObject[] | undefined>(undefined)
  const [currentPlayOrder, setCurrentPlayOrder] = useState<number | undefined>(
    undefined
  )

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
        updateMatch,
      }}
    >
      {children}
    </MatchesContext.Provider>
  )
}
