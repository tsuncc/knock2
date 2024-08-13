import { Dialog } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import ThirdPartyLoginButton from '../third-party-login-button'
import { useLoginModal } from '@/context/login-context/index'

// styles
import styles from '../login-form.module.scss'
// components
import AuthFormInput from '../auth-form-input'
import ClearButton from '@/components/UI/clear-button'

const dialogTheme = createTheme({
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          overflow: 'visible',
          borderRadius: '1rem',
          backgroundColor: '#343434',
          margin: '10px',
        },
      },
    },
  },
})

export default function ForgotPasswordForm() {
  const {
    forgotPasswordState,
    forgotPasswordData,
    forgotForgotPasswordErrors,
    quickInput,
    handleForgotPasswordChange,
    forgotPasswordSubmit,
    loginFormSwitch,
    formatTime,
  } = useLoginModal()

  return (
    <>
      <ThemeProvider theme={dialogTheme}>
        <Dialog
          open={forgotPasswordState}
          onClose={() => loginFormSwitch()}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <form className={styles.forms} onSubmit={forgotPasswordSubmit}>
            <div className={styles.title}>
              <ClearButton
                btnText={<h3>忘記密碼</h3>}
                onClick={() => {
                  quickInput(
                    {
                      account: 'ez003612@gmail.com',
                      password: 'asdasdasd',
                    },
                    {
                      account: 'ez003612@gmail.com',
                      password: 'qweqweqwe',
                      reenter_password: 'qweqweqwe',
                      name: '銀耳機',
                    },
                    { account: 'ez003612@gmail.com' }
                  )
                }}
              />
            </div>
            <div className={styles.box}>
              <AuthFormInput
                name="account"
                type="text"
                value={forgotPasswordData.account}
                placeholder="請輸入 Email"
                onChange={handleForgotPasswordChange}
              />
              <span className={styles.errorText}>
                {forgotForgotPasswordErrors.account}
                {forgotForgotPasswordErrors.result}
              </span>
            </div>
            <div className={styles.box}>
              <input
                type="submit"
                value={
                  formatTime === 'ok'
                    ? '送出'
                    : `請等候 ${formatTime} 秒後才能重新發送`
                }
                disabled={formatTime === 'ok' ? false : true}
              />
            </div>
            <div className={styles.links}>
              <ClearButton
                onClick={() => {
                  loginFormSwitch('Login')
                }}
                btnText={<span>想起密碼了嗎？ 返回登入</span>}
              />
            </div>
            <div className={styles.links}>
              <span>——— 或選擇其他方式登入 ———</span>
            </div>
            <div className={styles.links}>
              <ThirdPartyLoginButton />
            </div>
          </form>
        </Dialog>
      </ThemeProvider>
    </>
  )
}
