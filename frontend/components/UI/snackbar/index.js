import { Slide, Alert, Snackbar, ThemeProvider } from '@mui/material'
import customTheme, { alertIcons } from './theme'

function SlideTransition(props) {
  return <Slide {...props} direction="down" />
}

export default function AutohideSnackbar({
  open = false,
  text = '成功',
  severity = 'success',
  vertical = 'top',
  horizontal = 'center',
  onClose,
}) {
  return (
    <ThemeProvider theme={customTheme}>
      <Snackbar
        open={open}
        autoHideDuration={1500}
        anchorOrigin={{ vertical, horizontal }}
        TransitionComponent={SlideTransition}
        onClose={onClose}
      >
        <Alert
          icon={alertIcons[severity]}
          color={severity}
          sx={{ width: '100%' }}
        >
          {text}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  )
}
