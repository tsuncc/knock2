import React, { useState } from 'react'
import Link from 'next/link'
import styles from '@/components/page-components/teams/teams.module.css'
import AddChatForm from './add_chat'
import ChatDisplay from './display_chat'

const ChatArea = ({ chat_at, chat_by }) => {
  const [submissionCount, setSubmissionCount] = useState(0)

  const handleFormSubmit = () => {
    setSubmissionCount((prevCount) => prevCount + 1)
  }

  return (
    <>
      <div className={styles.borderbox}>
        <div className="row">
          <Link href="#addChat" style={{ color: '#b99755' }}>
            <h4 style={{ textAlign: 'center', padding: '12px' }}>留言區</h4>
          </Link>
          <div className={styles.titleBL}></div>
          <ChatDisplay chat_at={chat_at} submissionCount={submissionCount} />
          {!chat_by ? (
            <></>
          ) : (
            <div id="addChat">
              <AddChatForm
                chat_at={chat_at}
                chat_by={chat_by}
                onSubmit={handleFormSubmit}
              />
            </div>
          )}
        </div>
      </div>{' '}
    </>
  )
}

export default ChatArea
