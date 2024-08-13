import { IconButton, ThemeProvider } from '@mui/material'
import { FaGoogle, FaFacebookF, FaApple } from 'react-icons/fa'
import useFirebase from '@/hooks/useFirebase'

export default function ThirdPartyLoginButton() {
  const { loginWithGooglePopup } = useFirebase()

  const customTheme = {
    components: {
      MuiIconButton: {
        styleOverrides: {
          root: {
            border: '2px solid #fff',
            color: '#fff',
          },
        },
      },
    },
  }

  return (
    <>
      <ThemeProvider theme={customTheme}>
        <IconButton aria-label="delete" onClick={loginWithGooglePopup}>
          <FaGoogle />
        </IconButton>
        <IconButton aria-label="delete">
          <FaFacebookF />
        </IconButton>
        <IconButton aria-label="delete">
          <FaApple />
        </IconButton>
        {/* <button type="button" onClick={loginWithGooglePopup}>
        loginWithGooglePopup
      </button>
      <button type="button" onClick={loginWithGoogleRedirect}>
        loginWithGoogleRedirect
      </button> */}
      </ThemeProvider>
    </>
  )
}
