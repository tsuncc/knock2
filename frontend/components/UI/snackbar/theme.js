import { createTheme } from '@mui/material/styles'
import { FaCheckCircle } from 'react-icons/fa'
import { FaExclamationCircle } from 'react-icons/fa'

export const alertIcons = {
  success: <FaCheckCircle />,
  // info: <InfoIcon />,
  // warning: <WarningIcon />,
  error: <FaExclamationCircle />,
}

const backgroundColor = '#ffffff'
const iconColorSuccess = '#61DCB0'
const iconColorError = '#A43131'

const customTheme = createTheme({
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: backgroundColor,
          borderRadius: 20,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          backgroundColor: backgroundColor,
          padding: '1rem 2rem',
          fontSize: '1.2rem',
          lineHeight: '1.2rem',
          letterSpacing: '0.12rem',
          fontFamily: 'Noto Serif JP, serif',
          color: '#222222',
        },
        icon: {
          fontSize: '1.5rem',
        },
        standardSuccess: {
          '& .MuiAlert-icon': {
            color: iconColorSuccess,
          },
        },
        // standardInfo: {
        //   color: '#0c5460',
        // },
        // standardWarning: {
        //   color: '#856404',
        // },
        standardError: {
          '& .MuiAlert-icon': {
            color: iconColorError,
          },
        },
      },
    },
  },
})

export default customTheme
