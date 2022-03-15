import React, { useContext } from 'react'
import { GamesContext } from '../../store/games-context'
import { FormControlLabel, Switch } from '@mui/material'

import './GameFilter.css'

interface GameFilterProps {
  filter: string
}

const GameFilter: React.FC<GameFilterProps> = ({ filter }) => {
  const { filterState, setFilterState } = useContext(GamesContext)

  console.log('filterState =', filterState)

  if (filter === 'played') {
    return (
      <>
        <h3>Played:</h3>
        <label htmlFor="playedFilterAny">Any</label>
        <input
          type="radio"
          name="played"
          id="playedFilterAny"
          value="any"
          checked={filterState.played.value === 'any'}
          onChange={e =>
            setFilterState(prev => {
              return {
                ...prev,
                played: {
                  value: 'any',
                },
              }
            })
          }
        />
        <label htmlFor="playedFilterYes">Yes</label>
        <input
          type="radio"
          name="played"
          id="playedFilterYes"
          value="yes"
          checked={filterState.played.value === 'yes'}
          onChange={e =>
            setFilterState(prev => {
              return {
                ...prev,
                played: {
                  value: 'yes',
                },
              }
            })
          }
        />
        <label htmlFor="playedFilterNo">No</label>
        <input
          type="radio"
          name="played"
          id="playedFilterNo"
          value="no"
          checked={filterState.played.value === 'no'}
          onChange={e =>
            setFilterState(prev => {
              return {
                ...prev,
                played: {
                  value: 'no',
                },
              }
            })
          }
        />
      </>
    )
  }

  if (
    filter === 'one' ||
    filter === 'two' ||
    filter === 'three' ||
    filter === 'four' ||
    filter === 'five'
  ) {
    return (
      <>
        <h3>{`${filter} player${filter === 'one' ? '' : 's'}:`}</h3>
        <FormControlLabel
          control={
            <Switch
              checked={filterState[`${filter}`].yes}
              onChange={e =>
                setFilterState(prev => {
                  return {
                    ...prev,
                    [`${filter}`]: {
                      ...prev[`${filter}`],
                      yes: !prev[`${filter}`].yes,
                    },
                  }
                })
              }
            />
          }
          label="Yes"
          labelPlacement="start"
        />
        <FormControlLabel
          control={
            <Switch
              checked={filterState[`${filter}`].no}
              onChange={e =>
                setFilterState(prev => {
                  return {
                    ...prev,
                    [`${filter}`]: {
                      ...prev[`${filter}`],
                      no: !prev[`${filter}`].no,
                    },
                  }
                })
              }
            />
          }
          label="No"
          labelPlacement="start"
        />
        <FormControlLabel
          control={
            <Switch
              checked={filterState[`${filter}`].ok}
              onChange={e =>
                setFilterState(prev => {
                  return {
                    ...prev,
                    [`${filter}`]: {
                      ...prev[`${filter}`],
                      ok: !prev[`${filter}`].ok,
                    },
                  }
                })
              }
            />
          }
          label="Ok"
          labelPlacement="start"
        />
      </>
    )
  }

  if (filter === 'lastPlayed') {
    return (
      <>
        <h4>Last Played:</h4>

        <FormControlLabel
          control={
            <Switch
              checked={filterState.lastPlayed.usingStart}
              onChange={e =>
                setFilterState(prev => {
                  return {
                    ...prev,
                    lastPlayed: {
                      ...prev.lastPlayed,
                      usingStart: !prev.lastPlayed.usingStart,
                    },
                  }
                })
              }
              size="small"
            />
          }
          label="from"
          labelPlacement="start"
        />

        <input
          type="date"
          value={filterState.lastPlayed.start}
          disabled={!filterState.lastPlayed.usingStart}
          onChange={e =>
            setFilterState(prev => {
              return {
                ...prev,
                lastPlayed: {
                  ...prev.lastPlayed,
                  start: new Date(e.target.value).toISOString().slice(0, 10),
                },
              }
            })
          }
        />

        <FormControlLabel
          control={
            <Switch
              checked={filterState.lastPlayed.usingEnd}
              onChange={e =>
                setFilterState(prev => {
                  return {
                    ...prev,
                    lastPlayed: {
                      ...prev.lastPlayed,
                      usingEnd: !prev.lastPlayed.usingEnd,
                    },
                  }
                })
              }
              size="small"
            />
          }
          label="to"
          labelPlacement="start"
        />

        <input
          type="date"
          value={filterState.lastPlayed.end}
          disabled={!filterState.lastPlayed.usingEnd}
          onChange={e =>
            setFilterState(prev => {
              return {
                ...prev,
                lastPlayed: {
                  ...prev.lastPlayed,
                  end: new Date(e.target.value).toISOString().slice(0, 10),
                },
              }
            })
          }
        />
      </>
    )
  }

  return <div>{filter}</div>
}

export default GameFilter
