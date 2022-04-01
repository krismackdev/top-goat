import { createContext, useEffect, useState } from 'react'
import { auth, db } from '../firebase/config'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { onAuthStateChanged, User as firebaseUser } from 'firebase/auth'

interface PlayerObject {
  id: string
  name: string
  owner: string
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
  const [user, setUser] = useState<firebaseUser | null>(null)

  onAuthStateChanged(auth, currentUser => {
    setUser(currentUser)
  })

  // this function sets the players state with data from firestore
  const setPlayersWithFetchedData = async () => {
    const fetchPlayers = async () => {
      const playersRef = collection(db, 'players')
      const playersQuery = query(
        playersRef,
        where(
          'owner',
          '==',
          auth.currentUser !== null ? auth.currentUser.uid : ''
        )
      )
      const playersCollection = await getDocs(playersQuery)
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

    downloadedPlayers.sort((a, b) => {
      return a.name > b.name ? 1 : -1
    })

    setPlayers(downloadedPlayers)
  }

  useEffect(() => {
    setPlayersWithFetchedData()
  }, [])

  useEffect(() => {
    setPlayersWithFetchedData()
  }, [user])

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
