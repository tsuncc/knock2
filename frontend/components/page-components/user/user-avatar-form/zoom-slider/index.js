import { Box, Slider, Stack, IconButton } from '@mui/material'
import { FiZoomIn, FiZoomOut } from 'react-icons/fi'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      light: '#c7ab77',
      main: '#B99755',
      dark: '#81693b',
      contrastText: '#fff',
    },
  },
})

export default function ZoomSlider({ disabled = false, value, zoomChange }) {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: 300 }}>
        <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
          <IconButton
            aria-label="zoom-out"
            onClick={() => zoomChange(null, value - 0.1)}
          >
            <FiZoomOut />
          </IconButton>

          <Slider
            disabled={disabled}
            value={value}
            step={0.01}
            min={0.1}
            max={2}
            aria-label="Zoom"
            onChange={zoomChange}
            color="primary"
          />
          <IconButton
            aria-label="zoom-in"
            onClick={() => zoomChange(null, value + 0.1)}
          >
            <FiZoomIn />
          </IconButton>
        </Stack>
      </Box>
    </ThemeProvider>
  )
}
