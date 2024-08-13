import { useAuth } from '@/context/auth-context'
import { API_SERVER } from '@/configs/api-path'
import { useNotifications } from '@/context/notifications-context'
import Avatar from '@mui/joy/Avatar'
import Badge from '@mui/material/Badge'
import { styled } from '@mui/material/styles'
import { motion } from 'framer-motion'

const StyledBadge = styled(Badge)(() => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: -3,
    color: 'white',
    backgroundColor: 'var(--sec-1)',
  },
}))
export default function AvatarIcon() {
  const { auth } = useAuth()
  const { unreadCount } = useNotifications()
  return (
    <>
      <motion.div
        key={unreadCount} // 使用 key 屬性強制重新渲染
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.3,
          ease: [0, 0.71, 0.2, 1.01],
          scale: {
            type: 'spring',
            damping: 5,
            stiffness: 50,
            restDelta: 0.001,
          },
        }}
      >
        <StyledBadge
          badgeContent={unreadCount}
          color="secondary"
          max={99}
          sx={{ top: '-18px', right: '-32px' }}
        ></StyledBadge>
      </motion.div>
      <Avatar
        size="md"
        variant="solid"
        alt={auth.nickname}
        src={auth.avatar ? `${API_SERVER}/avatar/${auth.avatar}` : ''}
        sx={{ width: 32, height: 32, zIndex: -1 }}
      />
    </>
  )
}
