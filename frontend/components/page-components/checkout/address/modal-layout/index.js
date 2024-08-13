import styles from './modal-layout.module.css'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import BlackBtn from '@/components/UI/black-btn'
import OutlineBtn from '@/components/UI/outline-btn'
import Dialog from '@mui/material/Dialog'

export default function ModalLayout({
  children,
  title = '標題',
  btnTextLeft = '按鈕左',
  btnTextRight = '按鈕右',
  btnLeftHidden = false,
  btnRightHidden = false,
  modalWidth = '480px',
  modalHeight = 'auto',
  isOpen,
  handleClose,
  onClickRight = handleClose,
  onClickLeft = handleClose,
}) {
  const theme = createTheme({
    components: {
      MuiDialog: {
        styleOverrides: {
          paper: {
            width: modalWidth,
            height: modalHeight,
            maxHeight: '640px',
            borderRadius: 'var(--popup-radius)',
          },
        },
      },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <Dialog open={isOpen} onClose={handleClose}>
        {/* 整個彈出視窗 */}
        <div className={styles.modalBody}>
          {/* 標題 */}
          <div className={styles.title}>{title}</div>

          {/* 內容 */}
          <div className={styles.modalContent}>{children}</div>
          {/* 按鈕群組 */}
          <div className={styles.btnBar}>
            {!btnLeftHidden && (
              <OutlineBtn
                btnText={btnTextLeft}
                onClick={onClickLeft}
                href={null}
              />
            )}
            {!btnRightHidden && (
              <BlackBtn
                btnText={btnTextRight}
                onClick={onClickRight}
                href={null}
              />
            )}
          </div>
        </div>
      </Dialog>
    </ThemeProvider>
  )
}
