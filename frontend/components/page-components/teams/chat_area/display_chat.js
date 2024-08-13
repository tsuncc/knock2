import { useState, useEffect } from 'react'
import { DISPLAY_CHAT } from '@/configs/api-path'
import styles from '@/components/page-components/teams/teams.module.css'
import UserAvatar from '@/components/page-components/teams/user_avatar'

import { formatDateTime } from '@/hooks/useDateFormatter'
// import Image from 'next/image'

const ChatDisplay = ({ chat_at, submissionCount }) => {
  const [chatData, setChatData] = useState([])

  const fetchChatData = async (chat_at) => {
    const url = DISPLAY_CHAT + chat_at
    try {
      const resChat = await fetch(url)
      const resChatData = await resChat.json()

      if (resChatData.success) {
        setChatData(resChatData.data)
      }
    } catch (e) {
      console.error('Error fetching chat data: ', e)
    }
  }

  useEffect(() => {
    if (chat_at) {
      fetchChatData(chat_at)
    }
  }, [chat_at, submissionCount])

  return (
    <>
      <div className="row">
        {chatData.map((chat) => (
          <div key={chat.chat_id}>
            <div className="row">
              <div className={styles.chatlist}>
                <UserAvatar
                  avatar={chat.avatar}
                  nickName={chat.nick_name}
                  width={26}
                  height={26}
                />
                <span style={{ marginLeft: '12px' }}>{chat.nick_name}：</span>
              </div>
              <div style={{ padding: '0 0 12px 24px' }}>{chat.chat_text}</div>
              <div style={{ padding: '0 0 12px 24px' }}>-- {formatDateTime(chat.create_at)}</div>
              <hr />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default ChatDisplay
