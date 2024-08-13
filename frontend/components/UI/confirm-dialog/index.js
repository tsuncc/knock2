import { forwardRef } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import RedBtn from '../red-btn'
import OutlineBtn from '../outline-btn'
import styles from './confirm-dialog.module.css'
import Dialog from '@mui/material/Dialog'
import Slide from '@mui/material/Slide'
import { useConfirmDialog } from '@/context/confirm-dialog-context'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const theme = createTheme({
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflow: 'visible',
          padding: '1.5rem',
          borderRadius: 'var(--popup-radius)',
          border: '2px solid var(--danger)',
          width: '400px',
        },
      },
    },
  },
})

export default function ConfirmDialog({
  dialogTitle = '標題',
  btnTextRight = '確定',
  btnTextLeft = '取消',
}) {

  const { isConfirmDialogOpen, closeConfirmDialog, handleConfirm } = useConfirmDialog()

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={isConfirmDialogOpen}
        onClose={closeConfirmDialog}
        TransitionComponent={Transition}
        keepMounted
      >
        <img src="/ghost/ghost_14.png" className={styles.dialogImg} />

        <h6 className={styles.dialogTitle}>{dialogTitle}</h6>

        <div className={styles.btnStack}>
          <OutlineBtn
            btnText={btnTextLeft}
            paddingType="medium"
            onClick={closeConfirmDialog}
            href={null}
          />
          <RedBtn
            btnText={btnTextRight}
            paddingType="medium"
            onClick={handleConfirm}
            href={null}
          />
        </div>
      </Dialog>
    </ThemeProvider>
  )
}
