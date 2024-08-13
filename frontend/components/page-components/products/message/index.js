import { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { API_SERVER } from '@/configs/api-path'
import { useRouter } from 'next/router'
import { io } from 'socket.io-client'
import { useAuth } from '@/context/auth-context'
import myStyle from './message.module.css'
import { IoIosArrowBack } from 'react-icons/io'
import { GoPaperAirplane } from 'react-icons/go'
import { AiFillMessage } from 'react-icons/ai'
import { FaCheckDouble } from 'react-icons/fa6'
import 'animate.css/animate.css'
// import EmojiPicker from 'emoji-picker-react'
import { FaRegFaceLaugh, FaPaperclip, FaRegNoteSticky } from 'react-icons/fa6'
import dynamic from 'next/dynamic'
import StickerWindow from './sticker-window'

const socket = io('http://localhost:4040')

export default function Message() {
  const router = useRouter()
  // ****************IT 畫面在最頂端時隱藏top按鈕
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 100) {
        setVisible(false)
      } else {
        setVisible(true)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  // ****************IT

  // emoji避免undefine
  const Picker = dynamic(
    () => {
      return import('emoji-picker-react')
    },
    { ssr: false }
  )

  // emoji顯示
  const [toggleEmoji, setToggleEmoji] = useState(false)
  const [emojiData, setEmojiData] = useState(null)
  // sticker顯示
  const [toggleSticker, setToggleSticker] = useState(false)
  const [stickerData, setStickerData] = useState(null)
  //上傳圖片顯示
  const [uploadImg, setUploadImg] = useState('')
  // 選擇圖片
  const [selectedImage, setSelectedImage] = useState(null)
  const inputFileRef = useRef(null)

  //toggle
  const [toggleButton, setToggleButton] = useState(false)
  // 使用者名稱
  const [username, setUsername] = useState('')
  // 訊息
  const [type, setType] = useState('text')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  // 新房間
  const [room, setRoom] = useState('')

  // 取得會員id
  const { auth, authIsReady } = useAuth()
  useEffect(() => {
    // 設定room名稱 [room_XXX]
    const roomName = `room_${auth.id}`
    // console.log('會員資料:', auth)
    if (roomName === 'room_0') return
    setUsername(auth.nickname)
    setRoom(roomName)

    socket.emit('joinRoom', { room: roomName, username: auth.nickname })
  }, [authIsReady, auth])

  useEffect(() => {
    socket.on('chat message', ({ room, username, type, message }) => {
      // console.log('前台clint:', { room, username, type, message })
      setMessages((prevMsg) => [...prevMsg, { room, username, type, message }])
    })

    socket.on('history', (history) => {
      // console.log('history 監聽', history)
      setMessages(history)
    })
    socket.on('disconnect', () => {
      // console.log('前端用戶斷開連接')
      // socket.emit('user_offline', room)
    })

    return () => {
      socket.off('chat message')
      socket.off('history')
      socket.off('joinRoom')
    }
  }, [])

  //上傳圖片
  const sendUpload = async () => {
    if (selectedImage) {
      const formData = new FormData()
      formData.append('file', selectedImage)

      // console.log(' formData.append:', formData)
      try {
        const res = await fetch('http://localhost:3001/products/upload', {
          method: 'POST',
          body: formData,
          enctype: 'multipart/form-data',
        })
        // console.log('---fecth res', res)
        const resData = await res.json()
        setUploadImg(resData.filePath)
        setType('img')
      } catch (e) {
        console.log(e)
      }
    }
  }

  useEffect(() => {
    sendUpload()
  }, [selectedImage])

  // 點送出按鈕
  const sendMessage = (e) => {
    e.preventDefault()
    if (message) {
      // 傳給server
      // console.log('發送訊息:', room, username, type, message)
      socket.emit('chat message', { room, username, type, message })
      // setMessages((prevMsg) => [...prevMsg, { room, username, message }])
      setMessage('')
    } else if (uploadImg) {
      // console.log('發送圖片:', room, username, type, uploadImg)
      socket.emit('chat message', {
        room,
        username,
        type: type,
        message: uploadImg,
      })
      setType('text')
      setUploadImg('')
    } else if (message === '') return
  }

  // 送出貼圖
  const sendSticker = (stickerNum) => {
    socket.emit('chat message', {
      room,
      username,
      type: 'sticker',
      message: stickerNum,
    })
  }

  const messageEndRef = useRef(null)

  // 跳到底端
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ block: 'end', inline: 'nearest' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, uploadImg, toggleButton])

  useEffect(() => {
    if (messageEndRef.current) {
      scrollToBottom()
    }
  }, [messageEndRef.current])

  useEffect(() => {
    const container = document.querySelector(`.${myStyle.msgtext}`)
    if (container) {
      const resizeObserver = new ResizeObserver(() => {
        scrollToBottom()
      })
      resizeObserver.observe(container)
      return () => resizeObserver.disconnect()
    }
  }, [])

  // --------------
  const handleButton = () => {
    setToggleButton(!toggleButton)
  }
  const handleEmoji = () => {
    setToggleEmoji(!toggleEmoji)
  }

  const handleEmojiClick = useCallback((emojiObject) => {
    setMessage((prevMsg) => prevMsg + emojiObject.emoji)
  }, [])

  // 使用 useMemo 記憶
  const memoizedEmojiPicker = useMemo(
    () => (
      <Picker
        autoFocusSearch={false}
        previewConfig={{
          showPreview: false,
        }}
        skinTonesDisabled={true}
        onEmojiClick={handleEmojiClick}
        data={emojiData}
      />
    ),
    [handleEmojiClick, emojiData]
  )

  // -----------------
  // 預加載表情數據
  useEffect(() => {
    const preloadEmojiData = async () => {
      try {
        const data = await import('emoji-picker-react/src/data/emojis')
        setEmojiData(data)
      } catch (error) {
        console.error('Failed to preload emoji data:', error)
      }
    }

    preloadEmojiData()
  }, [])
  // -----------------

  const handleStickers = () => {
    setToggleSticker(!toggleSticker)
  }

  const handleClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click()
    }
  }

  return toggleButton ? (
    // 最外層

    <div
      className={`${myStyle.fix} animate__animated animate__fadeInUp animate__faster`}
    >
      {/* 頂端區 */}
      <div className={myStyle.top}>
        <button className={myStyle.topArrow} onClick={handleButton}>
          <IoIosArrowBack />
        </button>
        {/* <h5>悄瞧{room}</h5> */}
        <h5>悄瞧</h5>
      </div>

      {/* 文字區 */}
      <div id={myStyle.messageArea}>
        <div className={myStyle.msgtext} ref={messageEndRef}>
          {/* 訊息放置處 */}
          {messages.length < 1 ? (
            <div className={`${myStyle.right}`}>
              <img id={myStyle.adminImg} src="/ghost/ghost_15.png" alt="" />
              <p className={myStyle.msgRight}>您好!請問需要什麼服務呢?</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              if (msg.username !== '管理員') {
                if (msg.type === 'text') {
                  return (
                    <div key={index} className={`${myStyle.left}`}>
                      <p key={index} className={myStyle.msgLeft}>
                        {msg.message}
                      </p>
                    </div>
                  )
                } else if (msg.type === 'img') {
                  return (
                    <div key={index} className={`${myStyle.left}`}>
                      <img
                        key={index}
                        className={myStyle.msgLeftImg}
                        src={`${API_SERVER}/img/${msg.message}`}
                        alt="img"
                      />
                    </div>
                  )
                } else if (msg.type === 'sticker') {
                  return (
                    <div key={index} className={`${myStyle.left}`}>
                      <img
                        key={index}
                        className={myStyle.msgLeftSticker}
                        src={`/sticker/ghost_${msg.message}.png`}
                        alt="img"
                      />
                    </div>
                  )
                }
              } else {
                return (
                  <div key={index} className={`${myStyle.right}`}>
                    <img
                      id={myStyle.adminImg}
                      src="/ghost/ghost_15.png"
                      alt=""
                    />
                    <p key={index} className={myStyle.msgRight}>
                      {msg.message}
                    </p>
                  </div>
                )
              }
            })
          )}
        </div>
      </div>

      {/* 按鈕區 */}
      <div className={myStyle.bottom}>
        <form
          id={myStyle.form}
          className={myStyle.input}
          onSubmit={sendMessage}
        >
          {/* emoji */}
          <div className={myStyle.emojiArea}>
            <button onClick={handleEmoji} type="button">
              <FaRegFaceLaugh style={{ width: '26px', height: '26px' }} />
            </button>
            {toggleEmoji && emojiData && (
              <div className={myStyle.emojiPicker}>{memoizedEmojiPicker}</div>
            )}
          </div>

          {/* 貼圖 */}
          <div className={myStyle.stickersArea}>
            <button onClick={handleStickers} type="button">
              <FaRegNoteSticky style={{ width: '26px', height: '26px' }} />
            </button>
            {toggleSticker && <StickerWindow sendSticker={sendSticker} />}
          </div>

          {/* 上傳圖片 */}
          <div className={myStyle.uploadImgArea}>
            <button onClick={handleClick} type="button">
              <FaPaperclip style={{ width: '26px', height: '26px' }} />
            </button>

            {/* 原始輸入框 */}
            <div id={myStyle.originalInput}>
              <input
                type="file"
                id="myImage"
                name="myImage"
                ref={inputFileRef}
                onChange={(event) => {
                  setSelectedImage(event.target.files[0])
                  // console.log(event.target.files[0])
                }}
              />
            </div>
            {uploadImg && (
              <div className={myStyle.uploadWindow}>
                <img src={`${API_SERVER}/img/${uploadImg}`} alt="img" />
              </div>
            )}
          </div>

          <input className={myStyle.messageInp}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit">
            <GoPaperAirplane />
          </button>
        </form>
      </div>
    </div>
  ) : (
    <div className={`${visible ? '' : myStyle['visible']}`}>
      <button
        className={`${myStyle.openButton} animate__animated animate__fadeInDown animate__faster`}
        onClick={handleButton}
      >
        <AiFillMessage />
      </button>
    </div>
  )
}
