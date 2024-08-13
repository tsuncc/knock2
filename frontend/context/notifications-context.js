import {
  useState,
  useEffect,
  useCallback,
  useRef,
  createContext,
  useContext,
} from 'react'
import axios from 'axios'
import { useAuth } from '@/context/auth-context'
import {
  NOTIFICATION_CENTER_GET,
  PREVIOUS_NOTIFICATION_POST,
  MARK_MESSAGE_READ_POST,
} from '@/configs/api-path'

const NotificationsContext = createContext()

export function NotificationsContextProvider({ children }) {
  const [messages, setMessages] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState('連線中...')
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const eventSourceRef = useRef(null)
  const { auth } = useAuth()

  // 連線函式
  const connectToNotificationCenter = useCallback(() => {
    if (!auth.id) return
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    const eventSource = new EventSource(
      `${NOTIFICATION_CENTER_GET}?user_id=${auth.id}`
    )
    eventSourceRef.current = eventSource

    eventSource.onopen = () => setConnectionStatus('已連線')

    eventSource.onmessage = (event) => {
      try {
        const newMessage = JSON.parse(event.data)
        setMessages((prevMessages) => [newMessage, ...prevMessages])
        setUnreadCount((prevCount) => prevCount + 1)
      } catch (error) {
        console.error('訊息接收失敗:', error)
      }
    }

    eventSource.onerror = () => {
      setConnectionStatus('已斷線，嘗試重新連線中...')
      eventSource.close()
      setTimeout(connectToNotificationCenter, 5000)
    }
  }, [auth.id])

  // 取得舊通知
  const previousNotification = async () => {
    setLoading(true)
    try {
      const res = await axios.post(PREVIOUS_NOTIFICATION_POST, {
        user_id: auth.id,
        page: 1,
      })
      setMessages(res.data.data)
      setUnreadCount(res.data.unreadMessages)
      setHasMore(res.data.data.length === 10)
      setPage(2)
    } catch (error) {
      console.error('Failed to fetch initial notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  // 取得更多通知
  const loadMoreNotifications = async () => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const res = await axios.post(PREVIOUS_NOTIFICATION_POST, {
        user_id: auth.id,
        page: page,
      })
      const newMessages = res.data.data
      setMessages((prevMessages) => [...prevMessages, ...newMessages])
      setHasMore(newMessages.length === 10)
      setPage((prevPage) => prevPage + 1)
    } catch (error) {
      console.error('讀取更多通知失敗:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!auth.id) return
    previousNotification()
    connectToNotificationCenter()
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [connectToNotificationCenter])

  // 清空通知中心，目前只清空state
  const clearNotifications = () => setMessages([])

  const markMessageAsRead = async (notification_id) => {
    const user_id = auth.id
    try {
      const result = await axios.post(MARK_MESSAGE_READ_POST, {
        user_id,
        notification_id,
      })
      // 如果後端更新成功再更新前端 state
      if (result.data.success) {
        setMessages((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.id === notification_id
              ? {
                  ...notification,
                  is_read: '1',
                }
              : notification
          )
        )
        setUnreadCount(result.data.unreadMessages)
      }
    } catch (error) {
      console.error('已讀狀態更新失敗:', error)
    }
  }

  // 目前從後端format，前端先註解掉
  // const formatTime = (time) => {
  //   if (!time) return ''
  //   const date = new Date(time)
  //   return isNaN(date.getTime()) ? '' : date.toLocaleString()
  // }

  // 目前從後端分類type，前端先註解掉
  // const getMessageType = (message) => {
  //   if (message.type === 'personal') return '【個人通知】'
  //   if (message.type === 'public') return '【全站消息】'
  //   return '【系統通知】'
  // }

  return (
    <NotificationsContext.Provider
      value={{
        // state
        messages,
        unreadCount,
        hasMore,
        loading,
        // 已讀函式
        markMessageAsRead,
        // 清除函式
        clearNotifications,
        // 取得更多通知
        loadMoreNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationsContext)
export default NotificationsContext
