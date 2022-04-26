import React, { useContext } from 'react'
import { GamesContext, MatchesContext, PlayersContext } from '../../store'
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

  console.log('players HERE =', players)

  if (filter === 'games') {
    if (games) {
      return (
        <div style={{ display: 'flex' }}>
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
            sx={{ marginLeft: 2, minWidth: 150 }}
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
        </div>
      )
    }
  }

  if (filter === 'playedDate') {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <FormGroup>
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
                size="small"
              />
            }
            label=""
            labelPlacement="start"
          />
        </FormGroup>
        <TextField
          type="date"
          label="start"
          size="small"
          sx={{
            maxWidth: 150,
            marginLeft: 2,
          }}
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

        <FormGroup>
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
                size="small"
              />
            }
            label=""
            labelPlacement="start"
          />
        </FormGroup>

        <TextField
          type="date"
          label="end"
          size="small"
          sx={{
            maxWidth: 150,
            marginLeft: 2,
          }}
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
      </div>
    )
  }
  if (filter === 'players') {
    return (
      <div style={{ marginLeft: 20, display: 'flex' }}>
        {/* {players.length === 0 && 'no players to filter'} */}
        {players
          ?.map(player => {
            return player.name
          })
          .map(player => {
            return (
              <>
                <FormControl size="small" sx={{ m: 0.25, minWidth: 105 }}>
                  <InputLabel id={`player-label-${player}`} sx={{ m: -0.5 }}>
                    {`${player}`}
                  </InputLabel>
                  <Select
                    labelId={`player-label-${player}`}
                    id={`player-${player}`}
                    value={matchFilterState.players[player]}
                    label={`${player}`}
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
      </div>
    )
  }

  return <div></div>
}

export default MatchFilter
