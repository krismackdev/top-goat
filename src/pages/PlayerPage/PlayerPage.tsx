import React, { useContext } from 'react'
import { PlayersContext } from '../../store'

const PlayerPage = () => {
  const { players } = useContext(PlayersContext)

  return (
    <>
      {players?.map(player => (
        <p key={player.id}>{player.name}</p>
      ))}
    </>
  )
}

export default PlayerPage
