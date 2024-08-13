import { createTheme } from '@mui/material/styles'

const menuBackGroundColor = '#eeeeee'
const iconColorIsRead = '#d9d9d9'
const iconColorUnread = '#63AA90'
const titleColor = '#222222'
const alertTextColor = '#222222'

const customTheme = createTheme({
  components: {
    MuiAlert: {
      styleOverrides: {
        root: {
          width: '100%',
          padding: '0 16px',
          backgroundColor: 'transparent',
          color: alertTextColor,
          '& .MuiAlert-message': {
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            padding: 0,
          },
        },
        standardSuccess: {
          '& .MuiAlert-icon': {
            padding: '4px 0',
            fontSize: '16px',
            color: iconColorIsRead,
          },
        },
        standardInfo: {
          '& .MuiAlert-icon': {
            padding: '4px 0',
            fontSize: '16px',
            color: iconColorUnread,
          },
        },
      },
    },
    MuiAlertTitle: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
          color: titleColor,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        root: {
          top: '32px',
          left: '6px',
        },
        paper: {
          backgroundColor: menuBackGroundColor,
          borderRadius: '0 0 0px 16px',
          maxHeight: '700px',
          width: '450px',
        },
        list: {
          padding: 0,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: '50px',
          height: '50px',
          backgroundColor: '#B99755',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          // color: '#fff',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'Noto Serif JP , serif',
        },
      },
    },
  },
})

export default customTheme
