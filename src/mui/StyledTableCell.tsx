import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import { styled } from '@mui/system'

const StyledTableCell = styled(TableCell)({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'rgb(48, 43, 43)',
    color: 'white',
    fontWeight: 'bold',
    borderRight: '1px solid rgb(48, 43, 43)',
  },
  [`&.${tableCellClasses.body}`]: {
    borderRight: '1px solid black',
  },
  '&:last-child': {
    minWidth: 130,
    borderRight: '0',
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

export default StyledTableCell
