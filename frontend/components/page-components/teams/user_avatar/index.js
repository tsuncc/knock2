import React from 'react'
import Image from 'next/image'
import { API_SERVER } from '@/configs/api-path'

const UserAvatar = ({ avatar, nickName, height = 40, width = 40 }) => {
  return (
    <Image
      src={avatar ? `${API_SERVER}/avatar/${avatar}` : '/default-avatar.png'} // 預設圖片路徑
      height={height}
      width={width}
      alt={`${nickName} avatar`}
      style={{ borderRadius: '50%' }}
    />
  )
}

export default UserAvatar
