import * as React from 'react'
import TextField from '@mui/material/TextField'
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles'
import { useProduct } from '@/context/product-context'
import { useRouter } from 'next/router'
import { outlinedInputClasses } from '@mui/material/OutlinedInput'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import { BsSearch } from 'react-icons/bs'

const customTheme = (outerTheme) =>
  createTheme({
    palette: {
      mode: outerTheme.palette.mode,
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '--TextField-brandBorderColor': '#5B5B5B',
            '--TextField-brandBorderHoverColor': 'rgba(34, 34, 34, 1)',
            '--TextField-brandBorderFocusedColor': '#B99755',
            '& label.Mui-focused': {
              color: 'var(--TextField-brandBorderFocusedColor)',
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            borderColor: 'var(--TextField-brandBorderColor)',
            borderRadius: '100px',
            color: 'black',
            fontFamily: 'Noto Serif JP',
          },
          root: {
            fontFamily: 'Noto Serif JP',
            height: '45px',
            [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: 'var(--TextField-brandBorderHoverColor)',
            },
            [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: 'var(--TextField-brandBorderFocusedColor)',
            },
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: {
            fontFamily: 'Noto Serif JP',
            '&::before': {
              borderBottom: '2px solid var(--TextField-brandBorderColor)',
            },
            '&::after': {
              borderBottom: '2px solid var(--TextField-brandBorderColor)',
            },
            '&:hover:not(.Mui-disabled, .Mui-error):before': {
              borderBottom: '2px solid var(--TextField-brandBorderHoverColor)',
            },
            '&.Mui-focused:after': {
              borderBottom:
                '2px solid var(--TextField-brandBorderFocusedColor)',
            },
          },
        },
      },
    },
  })

export default function SearchInput() {
  const outerTheme = useTheme()
  const router = useRouter()

  const { userSearch, setUserSearch } = useProduct()
  const handleSearch = (e) => {
    setUserSearch(e.target.value)
  }

  const handleClick = (event) => {
    event.preventDefault()
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, userSearch: userSearch },
      },
      undefined,
      { scroll: false }
    )
  }

  return (
    <ThemeProvider theme={customTheme(outerTheme)}>
      <TextField
        // label="搜尋商品"
        placeholder="搜尋商品"
        variant="outlined"
        value={userSearch}
        sx={{ width: '8.25rem', height: '45.82px' }}
        onChange={handleSearch}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="handleClick"
                onClick={handleClick}
                edge="end"
              >
                {<BsSearch />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </ThemeProvider>
  )
}
