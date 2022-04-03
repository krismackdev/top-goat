import React, { useState } from 'react'
import { IconButton, MenuItem, Select, TableRow } from '@mui/material'
import { GameTableCell as PlayerTableCell } from '../../mui'
import CancelIcon from '@mui/icons-material/Cancel'
import CheckIcon from '@mui/icons-material/Check'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

interface PlayerObject {
  name: string
  id: string
  owner: string
  score: number
}

interface PlayerTableRowProps {
  player: PlayerObject
}

const PlayerTableRow: React.FC<PlayerTableRowProps> = ({ player }) => {
  const [editPlayerRowState, setEditPlayerRowState] = useState({
    isActive: false,
  })

  // if (editPlayerRowState?.isActive) {
  //   return (
  //     <TableRow sx={{ height: '20px' }}>
  //       <PlayerTableCell
  //         className="editing editing-start"
  //         sx={{
  //           '&:focus-within': {
  //             backgroundColor: '#d4ff32',
  //           },
  //         }}
  //       >
  //         <StyledTextField
  //           variant="standard"
  //           value={editGameRowState.title}
  //           onChange={e =>
  //             dispatch({ type: 'changeTitle', payload: e.target.value })
  //           }
  //         />
  //       </PlayerTableCell>
  //       <PlayerTableCell
  //         className="editing"
  //         sx={{
  //           '&:focus-within': {
  //             backgroundColor: '#d4ff32',
  //           },
  //         }}
  //       >
  //         <StyledTextField
  //           variant="standard"
  //           value={editGameRowState.image}
  //           onChange={e =>
  //             dispatch({ type: 'changeImage', payload: e.target.value })
  //           }
  //         />
  //       </PlayerTableCell>
  //       <PlayerTableCell
  //         className="editing"
  //         sx={{
  //           '&:focus-within': {
  //             backgroundColor: '#d4ff32',
  //           },
  //         }}
  //       >
  //         <StyledTextField
  //           variant="standard"
  //           value={editGameRowState.link}
  //           onChange={e =>
  //             dispatch({ type: 'changeLink', payload: e.target.value })
  //           }
  //         />
  //       </PlayerTableCell>
  //       <PlayerTableCell className="editing"></PlayerTableCell>
  //       <PlayerTableCell
  //         className="editing"
  //         sx={{
  //           '&:focus-within': {
  //             backgroundColor: '#d4ff32',
  //           },
  //         }}
  //       >
  //         <Select
  //           sx={{
  //             '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
  //               border: '4px solid #d4ff32',
  //             },
  //             '&:hover': {
  //               backgroundColor: '#d4ff32',
  //             },
  //           }}
  //           value={editGameRowState.players.one}
  //           onChange={e =>
  //             dispatch({ type: 'changePlayerOne', payload: e.target.value })
  //           }
  //         >
  //           <MenuItem value={'no'}>no</MenuItem>
  //           <MenuItem value={'ok'}>ok</MenuItem>
  //           <MenuItem value={'yes'}>yes</MenuItem>
  //         </Select>
  //       </PlayerTableCell>
  //       <PlayerTableCell
  //         className="editing"
  //         sx={{
  //           '&:focus-within': {
  //             backgroundColor: '#d4ff32',
  //           },
  //         }}
  //       >
  //         <Select
  //           sx={{
  //             '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
  //               border: '4px solid #d4ff32',
  //             },
  //             '&:hover': {
  //               backgroundColor: '#d4ff32',
  //             },
  //           }}
  //           value={editGameRowState.players.two}
  //           onChange={e =>
  //             dispatch({ type: 'changePlayerTwo', payload: e.target.value })
  //           }
  //         >
  //           <MenuItem value={'no'}>no</MenuItem>
  //           <MenuItem value={'ok'}>ok</MenuItem>
  //           <MenuItem value={'yes'}>yes</MenuItem>
  //         </Select>
  //       </PlayerTableCell>
  //       <PlayerTableCell
  //         className="editing"
  //         sx={{
  //           '&:focus-within': {
  //             backgroundColor: '#d4ff32',
  //           },
  //         }}
  //       >
  //         <Select
  //           sx={{
  //             '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
  //               border: '4px solid #d4ff32',
  //             },
  //             '&:hover': {
  //               backgroundColor: '#d4ff32',
  //             },
  //           }}
  //           value={editGameRowState.players.three}
  //           onChange={e =>
  //             dispatch({ type: 'changePlayerThree', payload: e.target.value })
  //           }
  //         >
  //           <MenuItem value={'no'}>no</MenuItem>
  //           <MenuItem value={'ok'}>ok</MenuItem>
  //           <MenuItem value={'yes'}>yes</MenuItem>
  //         </Select>
  //       </PlayerTableCell>
  //       <PlayerTableCell
  //         className="editing"
  //         sx={{
  //           '&:focus-within': {
  //             backgroundColor: '#d4ff32',
  //           },
  //         }}
  //       >
  //         <Select
  //           sx={{
  //             '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
  //               border: '4px solid #d4ff32',
  //             },
  //             '&:hover': {
  //               backgroundColor: '#d4ff32',
  //             },
  //           }}
  //           value={editGameRowState.players.four}
  //           onChange={e =>
  //             dispatch({ type: 'changePlayerFour', payload: e.target.value })
  //           }
  //         >
  //           <MenuItem value={'no'}>no</MenuItem>
  //           <MenuItem value={'ok'}>ok</MenuItem>
  //           <MenuItem value={'yes'}>yes</MenuItem>
  //         </Select>
  //       </PlayerTableCell>
  //       <PlayerTableCell
  //         className="editing"
  //         sx={{
  //           '&:focus-within': {
  //             backgroundColor: '#d4ff32',
  //           },
  //         }}
  //       >
  //         <Select
  //           sx={{
  //             '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
  //               border: '4px solid #d4ff32',
  //             },
  //             '&:hover': {
  //               backgroundColor: '#d4ff32',
  //             },
  //           }}
  //           value={editGameRowState.players.five}
  //           onChange={e =>
  //             dispatch({ type: 'changePlayerFive', payload: e.target.value })
  //           }
  //         >
  //           <MenuItem value={'no'}>no</MenuItem>
  //           <MenuItem value={'ok'}>ok</MenuItem>
  //           <MenuItem value={'yes'}>yes</MenuItem>
  //         </Select>
  //       </PlayerTableCell>
  //       <PlayerTableCell className="editing"></PlayerTableCell>
  //       <PlayerTableCell className="editing"></PlayerTableCell>
  //       <PlayerTableCell className="editing">
  //         {/* delete cell is empty during edit by design */}
  //       </PlayerTableCell>

  //       <PlayerTableCell className="editing editing-end" align="center">
  //         <IconButton
  //           sx={{ color: 'green' }}
  //           onClick={() => {
  //             const { isActive, ...updatedGame } = editGameRowState
  //             updateGame(updatedGame)
  //             dispatch({ type: 'toggleEditingMode' })
  //           }}
  //         >
  //           <CheckIcon />
  //         </IconButton>
  //         <IconButton
  //           sx={{ color: 'red' }}
  //           onClick={() => dispatch({ type: 'toggleEditingMode' })}
  //         >
  //           <CancelIcon />
  //         </IconButton>
  //       </PlayerTableCell>
  //     </TableRow>
  //   )
  //                                                    //
  //               .. edit mode ABOVE ..                //
  //                                                    //
  //                                                    //
  //               .. normal row BELOW ..               //
  //                                                    //
  // } else {
  return (
    <>
      {/* {showDeleteConfirmation && (
          <DeleteConfirmation
            type="game"
            id={game.id}
            setShowDeleteConfirmation={setShowDeleteConfirmation}
          />
        )} */}
      <TableRow key={player.id}>
        <PlayerTableCell>{player.name}</PlayerTableCell>
        <PlayerTableCell>{player.score}</PlayerTableCell>
        <PlayerTableCell align="center">
          <IconButton
            sx={{ color: 'black' }}
            // onClick={handleMatchDelete}
          >
            <DeleteIcon />
          </IconButton>
        </PlayerTableCell>
        <PlayerTableCell align="center">
          <IconButton
            disableRipple
            sx={{ color: 'black' }}
            // onClick={() => dispatch({ type: 'toggleEditingMode' })}
          >
            <EditIcon />
          </IconButton>
        </PlayerTableCell>
      </TableRow>
    </>
  )
}

export default PlayerTableRow
