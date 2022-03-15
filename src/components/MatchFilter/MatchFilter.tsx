import React, { useContext } from 'react'
import { MatchesContext } from '../../store/matches-context'
import { GamesContext } from '../../store/games-context'

import { Autocomplete, Button, TextField } from '@mui/material'
import './MatchFilter.css'

interface MatchFilterProps {
  filter: string
}

const MatchFilter: React.FC<MatchFilterProps> = ({ filter }) => {
  const { matchFilterState, setMatchFilterState } = useContext(MatchesContext)
  const { games } = useContext(GamesContext)

  console.log('mfs.gamesarray =', matchFilterState.gamesArray)

  if (filter === 'games') {
    if (games) {
      return (
        <>
          <h4>Games:</h4>
          <Button
            onClick={() => {
              setMatchFilterState(prev => {
                return {
                  ...prev,
                  gamesArray: games.map(game => game.title),
                }
              })
            }}
          >
            All
          </Button>
          <Button
            onClick={() => {
              setMatchFilterState(prev => {
                return {
                  ...prev,
                  gamesArray: [],
                }
              })
            }}
          >
            None
          </Button>
          <Autocomplete
            size="small"
            multiple
            limitTags={1}
            value={matchFilterState.gamesArray}
            onChange={(e, newVal) => {
              setMatchFilterState(prev => {
                return {
                  ...prev,
                  gamesArray: [...newVal],
                }
              })
            }}
            id="multiple-game-tags"
            options={games.map(game => game.title)}
            renderInput={params => (
              <TextField
                {...params}
                label="Select Games"
                placeholder="add title"
              />
            )}
          />
        </>
      )
    }
  }

  // if (filter === playedDate) {

  // }
  // if (filter === players) {

  // }

  return <div>{filter}</div>
}

export default MatchFilter
