import { createContext, useEffect, useState } from 'react'
import { db } from '../firebase/config'
import { collection, doc, getDocs, setDoc } from 'firebase/firestore'

type Result = 'win' | 'loss' | 'draw' | 'n/a'

interface ParticipantsObject {
  [prop: string]: PlayerResultObject
}

interface PlayerResultObject {
  name: string
  result: Result
  score: number | 'n/a'
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
  matches: MatchObject[] | undefined
}>({
  addNewMatch: () => {},
  matches: undefined,
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
    setMatches(downloadedMatches)
  }

  useEffect(() => {
    setMatchesWithFetchedData()
  }, [])

  const addNewMatch = async (newMatch: MatchObjectWithStringScore) => {
    console.log('adding...', newMatch)
    const { id, ...matchWithoutId } = newMatch

    await setDoc(doc(db, 'matches', id), {
      ...matchWithoutId,
      playOrder: currentPlayOrder ? currentPlayOrder + 1 : 1,
    })

    setMatchesWithFetchedData()
  }

  return (
    <MatchesContext.Provider
      value={{
        addNewMatch,
        matches,
      }}
    >
      {children}
    </MatchesContext.Provider>
  )
}
