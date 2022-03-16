import React, { useContext } from 'react'
import { MatchesContext } from '../../store/matches-context'
import { GamesContext } from '../../store/games-context'
import { PlayersContext } from '../../store/players-context'

import {
  Autocomplete,
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from '@mui/material'
import './MatchFilter.css'

type MatchFilterPlayerOptions = 'include' | 'exclude' | 'require'

interface MatchFilterProps {
  filter: string
}

const MatchFilter: React.FC<MatchFilterProps> = ({ filter }) => {
  const { matchFilterState, setMatchFilterState } = useContext(MatchesContext)
  const { games } = useContext(GamesContext)
  const { players } = useContext(PlayersContext)

  console.log('MFS =', matchFilterState)

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

  if (filter === 'playedDate') {
    return (
      <>
        <h4 style={{ display: 'inline' }}>Played Date:</h4>
        <FormGroup sx={{ display: 'inline', marginRight: '10px' }}>
          <FormControlLabel
            control={
              <Switch
                checked={matchFilterState.dates.usingStart}
                onChange={e => {
                  setMatchFilterState(prev => {
                    return {
                      ...prev,
                      dates: {
                        ...prev.dates,
                        usingStart: !prev.dates.usingStart,
                      },
                    }
                  })
                }}
              />
            }
            label="from"
            labelPlacement="start"
          />
        </FormGroup>
        <input
          type="date"
          value={matchFilterState.dates.start}
          disabled={!matchFilterState.dates.usingStart}
          onChange={e => {
            setMatchFilterState(prev => {
              return {
                ...prev,
                dates: {
                  ...prev.dates,
                  start: e.target.value,
                },
              }
            })
          }}
        />

        <FormGroup sx={{ display: 'inline', marginRight: '10px' }}>
          <FormControlLabel
            control={
              <Switch
                checked={matchFilterState.dates.usingEnd}
                onChange={e => {
                  setMatchFilterState(prev => {
                    return {
                      ...prev,
                      dates: {
                        ...prev.dates,
                        usingEnd: !prev.dates.usingEnd,
                      },
                    }
                  })
                }}
              />
            }
            label="to"
            labelPlacement="start"
          />
        </FormGroup>

        <input
          type="date"
          value={matchFilterState.dates.end}
          disabled={!matchFilterState.dates.usingEnd}
          onChange={e => {
            setMatchFilterState(prev => {
              return {
                ...prev,
                dates: {
                  ...prev.dates,
                  end: e.target.value,
                },
              }
            })
          }}
        />
      </>
    )
  }
  if (filter === 'players') {
    return (
      <>
        <h3>Players: </h3>
        {players
          ?.map(player => {
            return player.name
          })
          .map(player => {
            return (
              <>
                <FormControl size="small">
                  <InputLabel
                    id={`player-label-${player}`}
                  >{`${player}`}</InputLabel>
                  <Select
                    labelId={`player-label-${player}`}
                    id={`player-${player}`}
                    value={matchFilterState.players[player]}
                    label={`${player}`}
                    // onChange={e => {
                    //   dispatch(
                    //     filterMatchesActions.updateFilter({
                    //       type: 'players',
                    //       filter: {
                    //         active: filterSettings.players.active,
                    //         display: {
                    //           ...filterSettings.players.display,
                    //           [player]: e.target.value,
                    //         },
                    //       },
                    //     })
                    //   )
                    // }}
                    onChange={e => {
                      setMatchFilterState(prev => {
                        return {
                          ...prev,
                          players: {
                            ...prev.players,
                            [player]: e.target
                              .value as MatchFilterPlayerOptions,
                          },
                        }
                      })
                    }}
                  >
                    <MenuItem value="include">include</MenuItem>
                    <MenuItem value="exclude">exclude</MenuItem>
                    <MenuItem value="require">require</MenuItem>
                  </Select>
                </FormControl>
              </>
            )
          })}
      </>
    )
  }

  return <div></div>
}

export default MatchFilter
