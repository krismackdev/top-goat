import React, { useContext } from 'react'
import { GamesContext, MatchesContext, PlayersContext } from '../../store'
import { useParams } from 'react-router-dom'

const GameDetailPage = () => {
  const { id: gameId } = useParams()
  const { games, getHighScores } = useContext(GamesContext)
  const currentGame = games?.filter(game => game.id === gameId)[0]
  const { matches } = useContext(MatchesContext)
  const { players } = useContext(PlayersContext)

  const scores = getHighScores(gameId, matches)
  let topThreeScores = []

  for (let pId of Object.keys(scores)) {
    for (let score of scores[pId]) {
      topThreeScores.push([score, pId])
    }
  }

  topThreeScores = topThreeScores
    .sort((a: any, b: any) => {
      console.log('a1, b1 =', a[0], b[0])
      if (isNaN(a[0])) {
        return 1
      }
      if (isNaN(b[0])) {
        return -1
      }
      if (a[0] > b[0]) {
        return -1
      }
      if (b[0] > a[0]) {
        return 1
      }
      return -1
    })
    .slice(0, 3)

  console.log('topThreeScores =', topThreeScores)

  console.log('players here = ', players)
  return (
    <>
      <h2>{currentGame?.title}</h2>
      <br />
      <div>{`game id = ${gameId}`}</div>
      <br />
      <br />
      <h4>High Scores</h4>
      <p>Top 3 overall</p>
      <br />

      {topThreeScores.map(score => {
        return (
          <>
            <p>
              {players?.find(pObj => pObj.id === score[1])?.name}: {score[0]}
            </p>
          </>
        )
      })}
    </>
  )
}

export default GameDetailPage
