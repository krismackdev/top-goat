import React, { useContext } from 'react'
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
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { GamesContext } from '../../store/games-context'

interface AddMatchFormProps {
  setFormIsActive: React.Dispatch<React.SetStateAction<boolean>>
}

const AddMatchForm: React.FC<AddMatchFormProps> = ({ setFormIsActive }) => {
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
          <>
            <Divider textAlign="left" sx={{ margin: '15px 0' }}>
              Player #1
            </Divider>

            <div className="player-box">
              <FormControl size="small" sx={{ minWidth: '125px' }}>
                <InputLabel id="name-label">Name</InputLabel>
                <Select
                  label="Name"
                  labelId="name-label"
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
                <InputLabel id="result-label">Result</InputLabel>
                <Select
                  label="Result"
                  labelId="result-label"
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
