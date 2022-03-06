import TextField from '@mui/material/TextField'
import { styled } from '@mui/system'

const StyledTextField = styled(TextField)({
  '& .MuiInput-underline:after': {
    borderBottom: '5px solid #d4ff32',
  },
  '&:hover': {
    backgroundColor: '#d4ff32',
  },
})

export default StyledTextField
