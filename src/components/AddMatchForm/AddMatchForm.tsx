import React, { useContext, useState } from 'react'
import './AddMatchForm.css'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import { GamesContext } from '../../store/games-context'

interface AddMatchFormProps {
  setFormIsActive: React.Dispatch<React.SetStateAction<boolean>>
}

const AddMatchForm: React.FC<AddMatchFormProps> = ({ setFormIsActive }) => {
  const [numberOfPlayers, setNumberOfPlayers] = useState(1)
  const { games } = useContext(GamesContext)

  console.log('games in AMF = ', games)

  return (
    <Dialog open={true} onClose={() => setFormIsActive(false)}>
      <DialogTitle>Add a new match</DialogTitle>

      <DialogContent>
        <form>
          <TextField size="small" type="date" />
          <br />
          <br />
          <FormControl size="small" sx={{ minWidth: 125 }}>
            <InputLabel id="game-label">Game</InputLabel>
            <Select
              sx={{ minHeight: 40 }}
              size="small"
              label="Game"
              labelId="game-label"
            >
              <MenuItem key={'null'}></MenuItem>
              {Array.isArray(games) &&
                games.length > 0 &&
                games.map(game => (
                  <MenuItem value={game.id} key={game.id}>
                    {game.title}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <br />

          {/* for # of players, add one below, w/ dynamic fields as needed */}

          {Array.from({ length: numberOfPlayers }, (v, i) => i + 1).map(n => {
            return (
              <>
                <Divider textAlign="left" sx={{ margin: '15px 0' }}>
                  {`Player #${n}`}
                </Divider>

                <div className="player-box">
                  <FormControl size="small" sx={{ minWidth: '125px' }}>
                    <InputLabel id={`p${n}-name-label`}>Name</InputLabel>
                    <Select
                      label="Name"
                      labelId={`p${n}-name-label`}
                      sx={{ minHeight: 40 }}
                    >
                      <MenuItem key={'null'}></MenuItem>
                      {true
                        ? ['dinis', 'kris', 'lais', 'susan'].map(player => {
                            return (
                              <MenuItem value={player} key={player}>
                                {player}
                              </MenuItem>
                            )
                          })
                        : ''}
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ minWidth: '125px' }}>
                    <InputLabel id={`p${n}-result-label`}>Result</InputLabel>
                    <Select
                      label="Result"
                      labelId={`p${n}-result-label`}
                      sx={{ minHeight: 40 }}
                    >
                      <MenuItem key={'null'}></MenuItem>
                      <MenuItem value="win">win</MenuItem>
                      <MenuItem value="loss">loss</MenuItem>
                      <MenuItem value="draw">draw</MenuItem>
                      <MenuItem value="n/a">n/a</MenuItem>
                    </Select>
                  </FormControl>

                  <div>
                    <TextField label="Score" size="small" type="text" />
                  </div>
                </div>
              </>
            )
          })}
          <IconButton
            size="large"
            onClick={() => setNumberOfPlayers(prev => prev + 1)}
            color="success"
          >
            <AddCircleIcon fontSize="inherit" />
          </IconButton>
          {numberOfPlayers > 1 ? (
            <IconButton
              size="large"
              onClick={() => setNumberOfPlayers(prev => prev - 1)}
              color="error"
            >
              <RemoveCircleIcon fontSize="inherit" />
            </IconButton>
          ) : (
            ''
          )}

          <DialogActions>
            <Button variant="contained">Add</Button>
            <Button variant="outlined" onClick={() => setFormIsActive(false)}>
              Close
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddMatchForm
