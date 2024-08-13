import Image from 'next/image'
import { MdLogout } from 'react-icons/md'
import { Menu, Slide } from '@mui/material'
import Avatar from '@mui/joy/Avatar'

import { useAuth } from '@/context/auth-context'
import { API_SERVER } from '@/configs/api-path'

import styles from './nav-menu.module.scss'
import MenuItem from './menu-item'
import ClearButton from '@/components/UI/clear-button'

export default function NavMenu({ anchorEl, open, onClose }) {
  const { logout, auth } = useAuth()
  return (
    <>
      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'left' }}
        disableScrollLock={true}
        sx={{
          top: '34px',
          '.MuiMenu-paper': {
            backgroundColor: '#5b5b5b',
            borderRadius: '0 0 16px 16px',
          },
          '.MuiList-root': {
            padding: 0,
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <div className={`${styles['nav-menu']} `}>
          <ul className={styles['user']}>
            <li>
              <div className={styles['avatar']}>
                <Avatar
                  size="lg"
                  variant="plain"
                  alt=""
                  src={auth.avatar ? `${API_SERVER}/avatar/${auth.avatar}` : ''}
                />
              </div>
              <span>{auth.nickname}</span>
            </li>
            <li>
              <ClearButton
                onClick={logout}
                btnText={
                  <>
                    <MdLogout />
                    <span>登出</span>
                  </>
                }
              />
            </li>
          </ul>
          <div className={styles['line']}></div>
          <div>
            <MenuItem />
          </div>
          <Image
            src="/ghost/ghost_02.png"
            alt="bg"
            width={317}
            height={234}
            className={styles['bg-ghost']}
          />
        </div>
      </Menu>
    </>
  )
}
