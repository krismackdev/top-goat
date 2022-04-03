import React, { useContext } from 'react'
import { PlayersContext } from '../../store'
import styles from './PlayerPage.module.css'
import { GameTableCell as PlayerTableCell } from '../../mui'
import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { PlayerTableRow } from '../../components'

const PlayerPage = () => {
  const { players } = useContext(PlayersContext)

  return (
    <div className={styles['player-page-container']}>
      <TableContainer component={Paper} sx={{ width: '85%', margin: '0 auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <PlayerTableCell
                sx={{ minWidth: 232 }}
                // onClick={() => handleGameColumnSort('title')}
              >
                Name
                {/* &nbsp;
                {activeSortingColumn === 'title' ? (
                  reverseSortGames ? (
                    <FontAwesomeIcon icon={faCaretDown} />
                  ) : (
                    <FontAwesomeIcon icon={faCaretUp} />
                  )
                ) : (
                  ''
                )} */}
              </PlayerTableCell>
              <PlayerTableCell
                align="center"
                sx={{ minWidth: 100 }}
                // onClick={() => handleGameColumnSort('played')}
              >
                Score
                {/* &nbsp;
                {activeSortingColumn === 'played' ? (
                  reverseSortGames ? (
                    <FontAwesomeIcon icon={faCaretDown} />
                  ) : (
                    <FontAwesomeIcon icon={faCaretUp} />
                  )
                ) : (
                  ''
                )} */}
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
