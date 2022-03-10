import { createContext, useEffect, useState } from 'react'
import { db } from '../firebase/config'
import { collection, getDocs } from 'firebase/firestore'

interface PlayerObject {
  id: string
  name: string
}

type PlayersContextProviderProps = { children: React.ReactNode }

export const PlayersContext = createContext<{
  players: PlayerObject[] | undefined
}>({
  players: undefined,
})

export const PlayersContextProvider = ({
  children,
}: PlayersContextProviderProps) => {
  const [players, setPlayers] = useState<PlayerObject[] | undefined>(undefined)

  // this function sets the players state with data from firestore
  const setPlayersWithFetchedData = async () => {
    const fetchPlayers = async () => {
      const playersRef = collection(db, 'players')
      const playersCollection = await getDocs(playersRef)
      return playersCollection
    }

    const downloadedPlayers = await fetchPlayers().then(res => {
      const result: PlayerObject[] = []
      res.docs.forEach(doc => {
        let currentPlayer = doc.data()
        if (currentPlayer) {
          currentPlayer = { ...currentPlayer, id: doc.id }
          // ************* is it safe to be asserting as MatchObjecct here?
          result.push(currentPlayer as PlayerObject)
        }
      })
      return result
    })
    setPlayers(downloadedPlayers)
  }

  useEffect(() => {
    setPlayersWithFetchedData()
  }, [])

  console.log('in context, players =', players)

  return (
    <PlayersContext.Provider
      value={{
        players,
      }}
    >
      {children}
    </PlayersContext.Provider>
  )
}
