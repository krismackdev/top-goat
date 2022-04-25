import React, { useContext, useState } from 'react'
import { GamesContext } from '../../store'
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  TextField,
} from '@mui/material'
import './GameFilter.css'
import { useEffect } from 'react'

interface GameFilterProps {
  filter: string
}

type PlayedValues = 'any' | 'yes' | 'no'

const GameFilter: React.FC<GameFilterProps> = ({ filter }) => {
  const { gameFilterState, setGameFilterState } = useContext(GamesContext)
  const [minValue, setMinValue] = useState(0)
  const [maxValue, setMaxValue] = useState(1000000)

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
      <RadioGroup
        row
        sx={{ marginLeft: 2 }}
        value={gameFilterState.played.value}
        onChange={e =>
          setGameFilterState(prev => {
            return {
              ...prev,
              played: {
                value: (e.target as HTMLInputElement).value as PlayedValues,
              },
            }
          })
        }
      >
        <FormControlLabel value="any" control={<Radio />} label="Any" />
        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="no" control={<Radio />} label="No" />
      </RadioGroup>
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
      <div style={{ display: 'flex' }}>
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
          label=""
          labelPlacement="start"
        />

        <TextField
          type="date"
          size="small"
          label="start"
          sx={{
            maxWidth: 150,
            marginLeft: 2,
          }}
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
          label=""
          labelPlacement="start"
        />

        <TextField
          type="date"
          size="small"
          label="end"
          sx={{
            maxWidth: 150,
            marginLeft: 2,
          }}
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
      </div>
    )
  }

  if (filter === 'playCount') {
    return (
      <div style={{ display: 'flex' }}>
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
          label=""
          labelPlacement="start"
        />
        <TextField
          onChange={e => setMinValue(+e.target.value)}
          type="number"
          value={minValue}
          disabled={!gameFilterState.playCount.usingMin}
          label="min"
          size="small"
          sx={{
            maxWidth: 125,
            marginLeft: 2,
          }}
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
          label=""
          labelPlacement="start"
        />
        <TextField
          onChange={e => setMaxValue(+e.target.value)}
          type="number"
          value={maxValue}
          label="max"
          size="small"
          disabled={!gameFilterState.playCount.usingMax}
          sx={{ maxWidth: 125, marginLeft: 2 }}
        />
      </div>
    )
  }

  return <div>{filter}</div>
}

export default GameFilter
