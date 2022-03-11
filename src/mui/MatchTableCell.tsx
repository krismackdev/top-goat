import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import { styled } from '@mui/system'

const MatchTableCell = styled(TableCell)({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#333',
    color: 'white',
  },
  [`&.${tableCellClasses.body}`]: {
    padding: '0 16px',
    fontSize: 10,
  },
  '&.editing': {
    borderTop: '5px solid #d4ff32',
    borderBottom: '5px solid #d4ff32',
    borderRight: '0',
  },
  '&.editing-start': {
    borderLeft: '5px solid #d4ff32',
  },
  '&.editing-end': {
    borderRight: '5px solid #d4ff32',
  },
})

export default MatchTableCell
