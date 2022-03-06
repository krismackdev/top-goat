import Select from '@mui/material/Select'
import { styled } from '@mui/system'

const StyledSelect = styled(Select)({
  select: {
    '.MuiOutlinedInput-notchedOutline': {
      borderColor: 'red',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'red',
      borderWidth: '0.15rem',
    },
  },
})

export default StyledSelect
