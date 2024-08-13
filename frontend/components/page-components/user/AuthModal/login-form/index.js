import Image from 'next/image'
import { Dialog } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import ThirdPartyLoginButton from '../third-party-login-button'
import { useLoginModal } from '@/context/login-context/index'

// styles
import styles from '../login-form.module.scss'
// components
import ClearButton from '@/components/UI/clear-button'
import LoginInput from './login-input'
import OTPInput from '@/components/UI/form-item/otp-input'

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

export default function LoginForm() {
  const {
    loginModalState,
    loginData,
    loginErrors,
    handleLoginChange,
    loginSubmit,
    quickInput,
    loginFormSwitch,
    totpEnabled, // 2FA
    totpDataState,
    setTotpDataState,
    login2faSubmit,
  } = useLoginModal()

  return (
    <>
      <ThemeProvider theme={dialogTheme}>
        <Dialog
          open={loginModalState}
          onClose={() => loginFormSwitch()}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <ClearButton
            btnText={
              <figure className={styles.ghost}>
                <Image
                  src="/ghost/ghost_04.png"
                  alt=""
                  width={133}
                  height={138}
                />
                <Image
                  src="/ghost/ghost_13.png"
                  alt=""
                  width={115}
                  height={115}
                />
              </figure>
            }
            onClick={() =>
              quickInput(
                {
                  account: 'test7@test.com',
                  password: '12345678',
                },
                {
                  account: '',
                  password: '',
                  reenter_password: '',
                  name: '',
                },
                { account: '' }
              )
            }
          />
          <form
            className={styles.forms}
            onSubmit={totpEnabled ? login2faSubmit : loginSubmit}
          >
            <div className={styles.title}>
              <ClearButton
                btnText={<h3>會員登入</h3>}
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
              {totpEnabled === true ? (
                <>
                  <span style={{ paddingBottom: '10px' }}>
                    請輸入兩步驗證的驗證碼
                  </span>
                  <OTPInput
                    state={totpDataState}
                    setState={setTotpDataState}
                    color="#fff"
                  />
                </>
              ) : (
                <LoginInput
                  loginData={loginData}
                  handleLoginChange={handleLoginChange}
                  loginErrors={loginErrors}
                />
              )}
              <div className={styles.box2}>
                <span className={styles.errorText}>{loginErrors.result}</span>
                <ClearButton
                  onClick={() => {
                    loginFormSwitch('ForgotPassword')
                  }}
                  btnText={<span>忘記密碼？</span>}
                />
              </div>
            </div>
            <div className={styles.box}>
              <input type="submit" value="登入" />
            </div>
            <div className={styles.links}>
              <ClearButton
                onClick={() => {
                  loginFormSwitch('Register')
                }}
                btnText={<span>尚未註冊會員？ 立即註冊</span>}
              />
            </div>
            <div className={styles.links}>
              <ClearButton
                btnText={<span>——— 或選擇其他方式登入 ———</span>}
                onClick={() =>
                  quickInput(
                    {
                      account: 'lala@mail.com',
                      password: 'wwwwqqqq',
                    },
                    {
                      account: '',
                      password: '',
                      reenter_password: '',
                      name: '',
                    },
                    { account: '' }
                  )
                }
              />
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
