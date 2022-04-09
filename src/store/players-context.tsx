import { createContext, useContext, useEffect, useState } from 'react'
import { auth, db } from '../firebase/config'
import { MatchesContext } from './matches-context'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore'
import { onAuthStateChanged, User as firebaseUser } from 'firebase/auth'
// @ts-ignore
import { v4 as uuidv4 } from 'uuid'

interface PlayerObject {
  id: string
  name: string
  owner: string
  score: number
}

interface SortPlayerArg {
  field: string
}

type PlayersContextProviderProps = { children: React.ReactNode }

export const PlayersContext = createContext<{
  addNewPlayer: (newPlayerName: string) => void
  deletePlayer: (id: string) => void
  players: PlayerObject[] | undefined
  reverseSortPlayers: boolean
  sortPlayers: (payload: SortPlayerArg) => void
  updatePlayer: (player: PlayerObject) => void
}>({
  addNewPlayer: () => {},
  deletePlayer: () => {},
  players: undefined,
  reverseSortPlayers: false,
  sortPlayers: () => {},
  updatePlayer: () => {},
})

export const PlayersContextProvider = ({
  children,
}: PlayersContextProviderProps) => {
  const [players, setPlayers] = useState<PlayerObject[] | undefined>(undefined)
  const [user, setUser] = useState<firebaseUser | null>(null)
  const [reverseSortPlayers, setReverseSortPlayers] = useState(false)
  const { matches } = useContext(MatchesContext)

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

  const addNewPlayer = async (newPlayerName: string): Promise<void> => {
    const newPlayer = {
      name: newPlayerName,
      owner: auth?.currentUser?.uid,
      score: 0,
      scoreMap: {},
    }
    await setDoc(doc(db, 'players', uuidv4()), newPlayer)
    setPlayersWithFetchedData()
  }

  const deletePlayer = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'players', id))
    setPlayersWithFetchedData()
  }

  const sortPlayers = (payload: SortPlayerArg): void => {
    switch (payload.field) {
      case 'player':
        setPlayers(prev => {
          return prev
            ?.map(x => x)
            .sort((a, b) => {
              if (a.name.toLowerCase() > b.name.toLowerCase()) {
                return reverseSortPlayers ? 1 : -1
              } else {
                return reverseSortPlayers ? -1 : 1
              }
            })
        })
        break
      case 'score':
        setPlayers(prev => {
          return prev
            ?.map(x => x)
            .sort((a, b) => {
              if (+a.score <= +b.score) {
                return reverseSortPlayers ? -1 : 1
              } else {
                return reverseSortPlayers ? 1 : -1
              }
            })
        })
        break
    }
    setReverseSortPlayers(prev => !prev)
  }

  const updatePlayer = async (player: PlayerObject): Promise<void> => {
    // using spread operator below due to firebase issue #5853
    // ... if you use player as is, it causes a typescript error
    const { id, ...playerWithoutId } = { ...player }
    await updateDoc(doc(db, 'players', id), { ...playerWithoutId })
    setPlayersWithFetchedData()
  }
  useEffect(() => {
    setPlayersWithFetchedData()
  }, [])

  useEffect(() => {
    setPlayersWithFetchedData()
  }, [user])

  useEffect(() => {
    setPlayersWithFetchedData()
  }, [matches])

  useEffect(() => {
    onSnapshot(collection(db, 'players'), () => {
      setPlayersWithFetchedData()
    })
  }, [])

  return (
    <PlayersContext.Provider
      value={{
        addNewPlayer,
        deletePlayer,
        players,
        reverseSortPlayers,
        sortPlayers,
        updatePlayer,
      }}
    >
      {children}
    </PlayersContext.Provider>
  )
}
