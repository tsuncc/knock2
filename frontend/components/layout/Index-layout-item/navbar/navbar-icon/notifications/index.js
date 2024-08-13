import { useEffect, useRef, useCallback } from 'react'
import {
  ThemeProvider,
  Menu,
  MenuItem,
  Slide,
  Alert,
  Divider,
  Box,
  Typography,
  Chip,
} from '@mui/material'
import customTheme from './theme'
import { FaCircle } from 'react-icons/fa6'

import { useNotifications } from '@/context/notifications-context'
import LogoutMenu from './logout-menu'

export default function Notifications({ anchorEl, open, onClose }) {
  const {
    messages,
    markMessageAsRead,
    loadMoreNotifications,
    hasMore,
    loading,
  } = useNotifications()

  const menuRef = useRef(null)
  const handleScroll = useCallback(() => {
    if (menuRef.current) {
      const menuListNode = menuRef.current?.parentNode
      const bottom =
        menuListNode.scrollHeight -
          menuListNode.scrollTop -
          menuListNode.clientHeight <=
        0.5
      if (bottom) {
        loadMoreNotifications()
      }
    }
  }, [loadMoreNotifications])

  useEffect(() => {
    const menuListNode = menuRef.current?.parentNode
    if (menuListNode) {
      menuListNode.addEventListener('scroll', handleScroll)
    }
    return () => {
      if (menuListNode) {
        menuListNode.removeEventListener('scroll', handleScroll)
      }
    }
  }, [handleScroll])

  return (
    <>
      <ThemeProvider theme={customTheme}>
        <Menu
          open={open}
          anchorEl={anchorEl}
          onClose={onClose}
          TransitionComponent={Slide}
          TransitionProps={transitionProps}
          disableScrollLock={true}
          anchorOrigin={anchorOrigin}
          transformOrigin={transformOrigin}
          MenuListProps={{
            ref: menuRef,
          }}
        >
          <LogoutMenu closeMenu={onClose} />
          {messages.map((message) => (
            <Box key={message.id}>
              <MenuItem onClick={() => markMessageAsRead(message.id)}>
                <Alert
                  icon={<FaCircle />}
                  severity={message.is_read === '1' ? 'success' : 'info'}
                >
                  <Typography variant="body1" noWrap={true}>
                    {message.message}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip
                      label={message.type}
                      size="small"
                      variant="outlined"
                    />
                    <Typography variant="caption">
                      {message.created_at}
                    </Typography>
                  </Box>
                </Alert>
              </MenuItem>
              <Divider variant="middle" component="li" />
            </Box>
          ))}
          <MenuItem onClick={loadMoreNotifications}>
            <span style={{ width: '100%', textAlign: 'center', lineHeight: 3 }}>
              {loading ? '載入中...' : !hasMore ? '沒有更多通知了' : '載入更多'}
            </span>
          </MenuItem>
        </Menu>
      </ThemeProvider>
    </>
  )
}

// 定義樣式
const anchorOrigin = {
  vertical: 'bottom',
  horizontal: 'right',
}

const transformOrigin = {
  vertical: 'top',
  horizontal: 'left',
}

const transitionProps = { direction: 'left' }
