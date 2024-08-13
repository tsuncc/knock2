import { Dialog } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import ThirdPartyLoginButton from '../third-party-login-button'
import { useLoginModal } from '@/context/login-context/index'
import ReCAPTCHA from 'react-google-recaptcha'

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

export default function RegisterForm() {
  const {
    registerState,
    registerData,
    registerErrors,
    quickInput,
    handleRegisterChange,
    registerSubmit,
    loginFormSwitch,
    recaptchaRef,
  } = useLoginModal()

  return (
    <>
      <ThemeProvider theme={dialogTheme}>
        <Dialog
          open={registerState}
          onClose={() => loginFormSwitch()}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <form className={styles.forms} onSubmit={registerSubmit}>
            <div className={styles.title}>
              <ClearButton
                btnText={<h3>會員註冊</h3>}
                onClick={() =>
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
                }
              />
            </div>
            <div className={styles.box}>
              <AuthFormInput
                name="account"
                type="text"
                value={registerData.account}
                placeholder="請輸入Email"
                onChange={handleRegisterChange}
              />
              <span className={styles.errorText}>{registerErrors.account}</span>
              <AuthFormInput
                name="password"
                type="password"
                value={registerData.password}
                placeholder="請輸入密碼"
                onChange={handleRegisterChange}
              />{' '}
              <span className={styles.errorText}>
                {registerErrors.password}
              </span>
              <AuthFormInput
                name="reenter_password"
                type="password"
                value={registerData.reenter_password}
                placeholder="請再次輸入密碼"
                onChange={handleRegisterChange}
              />
              <span className={styles.errorText}>
                {registerErrors.reenter_password}
              </span>
              <AuthFormInput
                name="name"
                type="text"
                value={registerData.name}
                placeholder="請輸入姓名"
                onChange={handleRegisterChange}
              />
              <span className={styles.errorText}>
                {registerErrors.name}
                {registerErrors.result}
              </span>
            </div>
            <div className={styles.links}>
              <ReCAPTCHA
                ref={recaptchaRef}
                theme="dark"
                sitekey="6Le-2xAqAAAAADHbVaVe5nndmuEYZZ7Uyw0FclUU"
              />
            </div>
            <div className={styles.box}>
              <input type="submit" value="註冊" />
            </div>
            <div className={styles.links}>
              <ClearButton
                onClick={() => {
                  loginFormSwitch('Login')
                }}
                btnText={<span>已有註冊會員？ 返回登入</span>}
              />
            </div>
            <div className={styles.links}>
              <span>——— 或選擇其他方式註冊 ———</span>
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
