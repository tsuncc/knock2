import * as React from 'react'
import TextField from '@mui/material/TextField'
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles'
import { useProduct } from '@/context/product-context'
import { useRouter } from 'next/router'
import { outlinedInputClasses } from '@mui/material/OutlinedInput'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { BsSearch } from 'react-icons/bs'
import { height } from '@mui/system'

const customTheme = (outerTheme) =>
  createTheme({
    palette: {
      mode: outerTheme.palette.mode,
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '--TextField-brandBorderColor': 'rgba(217, 217, 217, 1)',
            '--TextField-brandBorderHoverColor': 'rgba(34, 34, 34, 1)',
            '--TextField-brandBorderFocusedColor': '#B99755',
            '& label.Mui-focused': {
              color: 'var(--TextField-brandBorderColor)',
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            border: '2px solid var(--TextField-brandBorderHoverColor)',
            borderRadius: '8px',
            color: 'black',
            fontFamily: 'Noto Serif JP',
          },
          root: {
            height: '45px',
            [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: 'var(--TextField-brandBorderHoverColor)',
            },
            [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: 'var(--TextField-brandBorderHoverColor)',
            },
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: {
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
              borderBottom: '2px solid var(--TextField-brandBorderHoverColor)',
            },
          },
        },
      },
    },
  })

export default function SearchInputPhone() {
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
        sx={{ height: '45.82px', width: '100%' }}
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
