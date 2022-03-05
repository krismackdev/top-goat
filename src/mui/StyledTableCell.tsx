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
    minWidth: 120,
  },
})

export default StyledTableCell
