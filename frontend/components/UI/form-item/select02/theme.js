import { createTheme } from '@mui/material/styles'

const borderColor = '#d9d9d9'
const borderWidth = '2px'
const borderRadius = '8px'
const borderColorHover = '#bbb29f'
const borderColorFocus = '#bbb29f'
const boxShadowFocus = '#efede8'
const selectedBackgroundColor = '#efede8'
const selectedBackgroundColorHover = '#efede8'

const customTheme = createTheme({
  components: {
    MuiSelect: {
      styleOverrides: {
        root: {
          height: '44px',
          width: '100%',
          fontFamily: 'Noto Serif JP, serif',
          '& .MuiSelect-select': {
            padding: '8px 16px',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: `${borderWidth} solid ${borderColor}`,
            lineHeight: 1,
            borderRadius: borderRadius,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: borderColorHover,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: borderColorFocus,
            boxShadow: `0 0 0 3px ${boxShadowFocus}`,
          },
          '& .MuiSelect-icon': {
            transition: '200ms',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: `${borderWidth} solid ${borderColor}`,
          borderRadius: borderRadius,
          boxShadow: 'none',
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          maxHeight: '300px',
          overflow: 'auto',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: 'Noto Serif JP, serif',
          '&.Mui-selected': {
            backgroundColor: selectedBackgroundColor,
          },
          '&.Mui-selected:hover': {
            backgroundColor: selectedBackgroundColorHover,
          },
        },
      },
    },
  },
})

export default customTheme
