import { createTheme } from '@mui/material/styles'

const borderColor = '#B99755'
const checkedColor = '#B99755'
// #222222

const customTheme = createTheme({
  components: {
    MuiRadio: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'unset',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'Noto Serif JP',
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          '&[data-testid="RadioButtonUncheckedIcon"]': {
            fill: borderColor,
          },
          '&[data-testid="RadioButtonCheckedIcon"]': {
            fill: checkedColor,
          },
        },
      },
    },
  },
})

export default customTheme
