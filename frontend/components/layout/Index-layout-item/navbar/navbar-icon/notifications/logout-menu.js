import { MenuItem, Avatar, Divider, Box } from '@mui/material'
import { MdLogout } from 'react-icons/md'
import ClearButton from '@/components/UI/clear-button'

import { API_SERVER } from '@/configs/api-path'
import { useAuth } from '@/context/auth-context'

export default function LogoutMenu({ closeMenu }) {
  const { logout, auth } = useAuth()
  return (
    <>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: '#eeeeee',
          padding: '8px 0 0 0',
        }}
      >
        <MenuItem>
          <Avatar
            alt="avatar"
            src={auth.avatar ? `${API_SERVER}/avatar/${auth.avatar}` : ''}
          />
          <p style={{ flex: 1, marginLeft: '1rem' }}>{auth.nickname}</p>
          <ClearButton
            onClick={(e) => {
              logout()
              closeMenu(e)
            }}
            btnText={
              <>
                <MdLogout />
                <p>登出</p>
              </>
            }
          />
        </MenuItem>
        <Divider variant="middle" component="li" />
      </Box>
    </>
  )
}
