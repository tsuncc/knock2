import styles from './top-btn.module.scss'
import 'animate.css/animate.css'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function TopBtn() {
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
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // 平滑滾動
    })
  }
  return (
    <>
      <button
        onClick={scrollToTop}
        className={`${styles['top-btn']} ${visible ? styles['visible'] : ''}`}
      >
        <>
          <Image
            src="/ghost/ghost_15.png"
            alt="top-button-default"
            width={100}
            height={84}
            className={`${styles['default']} animate__animated animate__pulse animate__infinite animate__slow`}
            priority={false}
          />
          <Image
            src="/ghost/ghost_07.png"
            alt="top-button-hover"
            width={100}
            height={84}
            className={`${styles['hover']} animate__animated animate__tada animate__infinite`}
            priority={false}
          />
        </>
      </button>
    </>
  )
}
