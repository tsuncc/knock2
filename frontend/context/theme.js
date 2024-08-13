import { createTheme, ThemeProvider } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#B99755',
    },
    secondary: {
      main: '#A29415',
    },
    standard: {
      main: '#B99755',
    },
    grey: {
      main: '#5B5B5B',
      light: '#D9D9D9',
      dark: '#495057',
      contrastText: 'rgba(255, 255, 255, 1)',
    },
    black: {
      main: '#222',
      light: '#D9D9D9',
      dark: '#343a40',
      contrastText: 'rgba(255, 255, 255, 1)',
    },
    favRed: {
      main: '#BA0606',
      light: '#D9D9D9',
      dark: '#990101',
      contrastText: '#BA0606',
    },
  },
})
export default theme
