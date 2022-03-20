import React, { useContext, useState } from 'react'
import { GamesContext } from '../../store/games-context'
import { FormControlLabel, Switch } from '@mui/material'

import './GameFilter.css'
import { useEffect } from 'react'

interface GameFilterProps {
  filter: string
}

const GameFilter: React.FC<GameFilterProps> = ({ filter }) => {
  const { gameFilterState, setGameFilterState } = useContext(GamesContext)
  const [minValue, setMinValue] = useState(0)
  const [maxValue, setMaxValue] = useState(1000000)

  console.log('gamefilterstate =', gameFilterState)

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setGameFilterState(prev => {
        return {
          ...prev,
          playCount: {
            ...prev.playCount,
            min: minValue,
            max: maxValue,
          },
        }
      })
    }, 50)

    return () => clearTimeout(timeOutId)
  }, [minValue, maxValue])

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
          checked={gameFilterState.played.value === 'any'}
          onChange={e =>
            setGameFilterState(prev => {
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
          checked={gameFilterState.played.value === 'yes'}
          onChange={e =>
            setGameFilterState(prev => {
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
          checked={gameFilterState.played.value === 'no'}
          onChange={e =>
            setGameFilterState(prev => {
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
              checked={gameFilterState[`${filter}`].yes}
              onChange={e =>
                setGameFilterState(prev => {
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
              checked={gameFilterState[`${filter}`].no}
              onChange={e =>
                setGameFilterState(prev => {
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
              checked={gameFilterState[`${filter}`].ok}
              onChange={e =>
                setGameFilterState(prev => {
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
              checked={gameFilterState.lastPlayed.usingStart}
              onChange={e =>
                setGameFilterState(prev => {
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
          value={gameFilterState.lastPlayed.start}
          disabled={!gameFilterState.lastPlayed.usingStart}
          onChange={e =>
            setGameFilterState(prev => {
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
              checked={gameFilterState.lastPlayed.usingEnd}
              onChange={e =>
                setGameFilterState(prev => {
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
          value={gameFilterState.lastPlayed.end}
          disabled={!gameFilterState.lastPlayed.usingEnd}
          onChange={e =>
            setGameFilterState(prev => {
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

  if (filter === 'playCount') {
    return (
      <>
        <h4>Play Count:</h4>

        <FormControlLabel
          control={
            <Switch
              checked={gameFilterState.playCount.usingMin}
              onChange={e =>
                setGameFilterState(prev => {
                  return {
                    ...prev,
                    playCount: {
                      ...prev.playCount,
                      usingMin: !prev.playCount.usingMin,
                    },
                  }
                })
              }
              size="small"
            />
          }
          label="min"
          labelPlacement="start"
        />
        <input
          onChange={e => setMinValue(+e.target.value)}
          type="number"
          value={minValue}
          disabled={!gameFilterState.playCount.usingMin}
        />

        <FormControlLabel
          control={
            <Switch
              checked={gameFilterState.playCount.usingMax}
              onChange={e =>
                setGameFilterState(prev => {
                  return {
                    ...prev,
                    playCount: {
                      ...prev.playCount,
                      usingMax: !prev.playCount.usingMax,
                    },
                  }
                })
              }
              size="small"
            />
          }
          label="max"
          labelPlacement="start"
        />
        <input
          onChange={e => setMaxValue(+e.target.value)}
          type="number"
          value={maxValue}
          disabled={!gameFilterState.playCount.usingMax}
        />
      </>
    )
  }

  return <div>{filter}</div>
}

export default GameFilter
