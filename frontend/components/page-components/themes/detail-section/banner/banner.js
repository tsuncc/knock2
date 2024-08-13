import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useTheme } from '@/context/theme-context'
import { useRouter } from 'next/router'
import myStyle from './banner.module.css'
import { FaStar } from 'react-icons/fa'
import BasicModal02 from '@/components/UI/basic-modal02'
import { motion } from 'framer-motion'
import { FaPlay, FaPause } from 'react-icons/fa'

const Banner = () => {
  const { themeDetails, getThemeDetails } = useTheme()
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const router = useRouter()
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)
  const [soundBars, setSoundBars] = useState([])
  const [showMusicPrompt, setShowMusicPrompt] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [currentThemeId, setCurrentThemeId] = useState(null)

  const FuzzyOverlay = () => (
    <motion.div
      animate={{
        opacity: [0.1, 0.15, 0.1],
        backgroundPosition: ['0% 0%', '130% 100%', '56% 0%'],
      }}
      transition={{
        repeat: Infinity,
        duration: 0.05,
        ease: 'linear',
      }}
      style={{
        backgroundImage: 'url("/noise2.jpg")',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundSize: '150% 100%',
        pointerEvents: 'none',
        opacity: 1,
        zIndex: 3,
      }}
      className="absolute inset-0"
    />
  )

  const togglePlay = useCallback(
    (e) => {
      e.preventDefault()
      if (!audioLoaded || !audioRef.current) return
      if (audioRef.current.paused) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((error) => {
            console.error('播放失敗:', error)
            setIsPlaying(false)
          })
      } else {
        audioRef.current.pause()
        setIsPlaying(false)
      }
    },
    [audioLoaded]
  )

  const handleAcceptMusic = useCallback(() => {
    setShowMusicPrompt(false)
    if (audioLoaded && audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => {
          console.error('播放失敗:', error)
          setIsPlaying(false)
        })
    }
  }, [audioLoaded])

  const handleDeclineMusic = useCallback(() => {
    setShowMusicPrompt(false)
  }, [])

  useEffect(() => {
    const handleRouteChange = (url) => {
      const newThemeId = new URL(url, window.location.origin).searchParams.get(
        'branch_themes_id'
      )
      if (newThemeId !== currentThemeId) {
        if (audioRef.current) {
          audioRef.current.pause()
          setIsPlaying(false)
        }
        setShowMusicPrompt(true)
        setCurrentThemeId(newThemeId)
      }
    }

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router, currentThemeId])

  useEffect(() => {
    const { branch_themes_id } = router.query
    if (branch_themes_id && branch_themes_id !== currentThemeId) {
      setLoading(true)
      setVideoLoaded(false)
      setAudioLoaded(false)
      setCurrentThemeId(branch_themes_id)
      getThemeDetails(branch_themes_id).finally(() => {
        setLoading(false)
        setShowMusicPrompt(true)
      })
    }

    setSoundBars(
      Array.from({ length: 20 }, () => ({
        minHeight: Math.floor(Math.random() * 3) + 3,
        maxHeight: Math.floor(Math.random() * 7) + 20,
        delay: Math.random() * 0.5,
      }))
    )
  }, [router.query, getThemeDetails, currentThemeId])

  useEffect(() => {
    if (themeDetails.bg_music) {
      if (audioRef.current) {
        audioRef.current.src = `/music/${themeDetails.bg_music}`
        setAudioLoaded(false)
        setIsPlaying(false)
      }
    }
    if (themeDetails.theme_mp4) {
      setVideoLoaded(false)
    }
  }, [themeDetails.bg_music, themeDetails.theme_mp4])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleCanPlayThrough = () => {
      setAudioLoaded(true)
    }
    const handleError = (e) => console.error('音訊錯誤:', e)

    audio.addEventListener('canplaythrough', handleCanPlayThrough)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlayThrough)
      audio.removeEventListener('error', handleError)
    }
  }, [themeDetails.bg_music])

  const openModal = (e) => {
    e.preventDefault()
    setModalOpen(true)
  }
  const closeModal = () => setModalOpen(false)

  const createStars = useCallback(
    (count) =>
      Array.from({ length: count }, (_, index) => (
        <FaStar key={index} style={{ marginRight: '6px' }} />
      )),
    []
  )

  return (
    <div
      style={{
        position: 'relative',
        minHeight: 'calc(100vh - 100px)',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <video
        key={themeDetails.theme_mp4}
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={() => setVideoLoaded(true)}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
          display: videoLoaded ? 'block' : 'none',
        }}
      >
        <source src={`/mp4/${themeDetails.theme_mp4}`} type="video/mp4" />
        您的瀏覽器不支援 video 標籤。
      </video>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(155, 155, 155, 0.1))',
          zIndex: 2,
        }}
      />
      <FuzzyOverlay />
      <div
        className="container px-5 md-px-1"
        style={{ position: 'relative', zIndex: 4 }}
      >
        <div className="row">
          <div className="col-12 col-md-6">
            <h1 className={myStyle.h1}>{themeDetails.theme_name}</h1>
            <p className={myStyle.p}>{themeDetails.theme_desc}</p>
            <hr className={myStyle.hr} />
            <div className={myStyle.comment}>
              <div className={myStyle.section}>
                <span className={myStyle.title}>主題與劇情</span>
                <span className={myStyle.star}>
                  {createStars(themeDetails.storyline)}
                </span>
              </div>
              <div className={myStyle.section}>
                <span className={myStyle.title}>謎題與設計</span>
                <span className={myStyle.star}>
                  {createStars(themeDetails.puzzle_design)}
                </span>
              </div>
              <div className={myStyle.section}>
                <span className={myStyle.title}>環境與氛圍</span>
                <span className={myStyle.star}>
                  {createStars(themeDetails.atmosphere)}
                </span>
                <button className={myStyle.warning} onClick={openModal}>
                  注意事項
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={myStyle.play}>
        <div className={myStyle.playerWrapper}>
          {isPlaying && (
            <div className={myStyle.soundBarsContainer}>
              {soundBars.map((bar, i) => (
                <div
                  key={i}
                  className={myStyle.soundBar}
                  style={{
                    '--min-height': `${bar.minHeight}px`,
                    '--max-height': `${bar.maxHeight}px`,
                    animationDelay: `${bar.delay}s`,
                  }}
                />
              ))}
            </div>
          )}
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: '100%' }}
          >
            <button onClick={togglePlay} className={myStyle.playerButton}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
          </div>
        </div>

        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio ref={audioRef} loop>
          <source src={`/music/${themeDetails.bg_music}`} type="audio/mpeg" />
          您的瀏覽器不支援 audio 元素。
        </audio>
      </div>

      {showMusicPrompt && (
        <div className={myStyle.musicPromptOverlay}>
          <div className={myStyle.musicPrompt}>
            <p>是否播放背景音樂來增強您的體驗？</p>
            <div className={myStyle.musicPromptButtons}>
              <button
                className={myStyle.acceptButton}
                onClick={handleAcceptMusic}
              >
                播放音樂
              </button>
              <button
                className={myStyle.declineButton}
                onClick={handleDeclineMusic}
              >
                不要播放
              </button>
            </div>
          </div>
        </div>
      )}

      <BasicModal02
        open={modalOpen}
        onClose={closeModal}
        modalTitle="注意事項"
        modalBody={
          <div>
            <p className={myStyle.p1}>
              1. 活動採包場制，不協助並團，預約須達「遊戲最低人數」。
            </p>
            <p className={myStyle.p1}>
              2.
              變更或取消預訂日期，請於預約日前一日來電通知。臨時取消將會影響您下次預約的優先權利。
            </p>
            <p className={myStyle.p1}>
              3.
              在遊戲人數範圍內可以臨時追加人數，不需與客服聯繫，當日將以現場人數收費。遇天災或不可抗力因素取消或變更場次，以網站公告為準。
            </p>
            <p className={myStyle.p1}>
              4. 請「準時到場」集合報到，現場以
              <span style={{ color: '#B99755', fontWeight: 'bold' }}>
                現金收費
              </span>
              並進行事前說明。超過表定時間未報到入場，即取消場次，開放給現場玩家預約。
            </p>
            <p className={myStyle.p1}>
              5.
              活動流程包含事前說明、進行密室逃脫、遊戲後故事解說（無全程謎題講解）。
            </p>
            <p className={myStyle.p1}>
              6.
              遊玩人數低於建議人數時難度較高，不足開場人數時將導致活動無法進行。本遊戲因場景及遊戲設計，
              <span className={myStyle.p3}>
                未滿12歲、孕婦及行動不便者不得入場
              </span>
              。
            </p>
            <p className={myStyle.p1}>
              8.
              如因年齡未達遊戲主題限制，本工作室有權拒絕玩家入場，並不得將未成年孩童托管在場館內。如有特殊需求（嬰兒車、寵物等），請先來電詢問。
            </p>
            <p className={myStyle.p1}>9. 遊戲期間請勿飲食、攝影及錄音。</p>
            <p className={myStyle.p1}>
              10. 場內設置各項活動機關，請「穿著方便活動的衣物」。
            </p>
            <p className={myStyle.p3}>
              遊戲過程中如有毀損道具及場景之行為，造成本工作室損失，將提出求償。（包含道具維修、場景修復、營業損失之費用等等）。
            </p>
          </div>
        }
      />
    </div>
  )
}

export default Banner
