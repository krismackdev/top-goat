import React, { useContext, useState } from 'react'
import { PlayersContext } from '../../store'
import styles from './PlayerPage.module.css'
import { GameTableCell as PlayerTableCell } from '../../mui'
import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { AddPlayerForm, PlayerTableRow } from '../../components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons'

const PlayerPage = () => {
  const [activeSortingColumn, setActiveSortingColumn] = useState('player')
  const [formIsActive, setFormIsActive] = useState(false)
  const { players, reverseSortPlayers, sortPlayers } =
    useContext(PlayersContext)

  const handlePlayerColumnSort = (columnName: string) => {
    sortPlayers({ field: columnName })
    setActiveSortingColumn(columnName)
  }

  return (
    <div className={styles['player-page-container']}>
      <Grid
        container
        sx={{
          width: '85%',
          margin: '0 auto',
          marginBottom: 1,
        }}
      >
        <Grid item>
          <Button
            variant="contained"
            color="success"
            onClick={() => setFormIsActive(true)}
          >
            Add Player
          </Button>
        </Grid>
      </Grid>

      {formIsActive && <AddPlayerForm setFormIsActive={setFormIsActive} />}

      <TableContainer component={Paper} sx={{ width: '85%', margin: '0 auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <PlayerTableCell
                sx={{ minWidth: 232 }}
                onClick={() => handlePlayerColumnSort('player')}
              >
                Player &nbsp;
                {activeSortingColumn === 'player' ? (
                  reverseSortPlayers ? (
                    <FontAwesomeIcon icon={faCaretDown} />
                  ) : (
                    <FontAwesomeIcon icon={faCaretUp} />
                  )
                ) : (
                  ''
                )}
              </PlayerTableCell>
              <PlayerTableCell
                align="center"
                sx={{ minWidth: 100 }}
                onClick={() => handlePlayerColumnSort('score')}
              >
                Score &nbsp;
                {activeSortingColumn === 'score' ? (
                  reverseSortPlayers ? (
                    <FontAwesomeIcon icon={faCaretDown} />
                  ) : (
                    <FontAwesomeIcon icon={faCaretUp} />
                  )
                ) : (
                  ''
                )}
              </PlayerTableCell>
              <PlayerTableCell align="center">Delete</PlayerTableCell>
              <PlayerTableCell align="center">Edit</PlayerTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(players) && players.length > 0 ? (
              players.map(player => (
                <PlayerTableRow player={player} key={player.id} />
              ))
            ) : (
              <TableRow>
                <PlayerTableCell>NO GAMES FOUND</PlayerTableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default PlayerPage
