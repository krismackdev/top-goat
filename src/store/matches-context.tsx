import { createContext, useEffect, useState } from 'react'
import { db } from '../firebase/config'
import { collection, getDocs } from 'firebase/firestore'

type Result = 'win' | 'loss' | 'draw' | 'n/a'

interface MatchPlayerObject {
  name: string
  playerId: string
  result: Result
  score: number | 'n/a'
}

interface MatchObject {
  date: Date
  game: string
  gameId: string
  playOrder: number
  players: MatchPlayerObject[]
}

type MatchesContextProviderProps = { children: React.ReactNode }

export const MatchesContext = createContext<{
  matches: MatchObject[] | undefined
}>({
  matches: undefined,
})

export const MatchesContextProvider = ({
  children,
}: MatchesContextProviderProps) => {
  const [matches, setMatches] = useState<MatchObject[] | undefined>(undefined)

  // this function sets the games state with data from firestore
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

    setMatches(downloadedMatches)
  }

  useEffect(() => {
    setMatchesWithFetchedData()
  }, [])

  return (
    <MatchesContext.Provider
      value={{
        matches,
      }}
    >
      {children}
    </MatchesContext.Provider>
  )
}
