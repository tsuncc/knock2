import ReactDOM from 'react-dom'
import styles from './success-modal.module.css'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'

export default function SuccessModal({ show, msg }) {
  const theme = createTheme({
    components: {
      MuiDialog: {
        styleOverrides: {
          paper: {
            minWidth: '240px',
            maxWidth: '480px',
            borderRadius: 'var(--popup-radius)',
            padding: '1.5rem',
            zIndex: 9000,
          },
        },
      },
    },
  })
  if (!show) return null

  return ReactDOM.createPortal(
    <ThemeProvider theme={theme}>
      <Dialog open={show}>
        <div className={styles.modalContent}>
          <div className={styles.imgBox}>
            <img src="/ghost/ghost_06.png" />
          </div>
          <h6>{msg}</h6>
        </div>
      </Dialog>
    </ThemeProvider>,
    document.body
  )
}
