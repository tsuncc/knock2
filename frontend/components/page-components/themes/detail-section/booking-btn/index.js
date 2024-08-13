import styles from './details.module.scss'
import 'animate.css/animate.css'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function BookingBtn({ targetId }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
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

  const scrollToTarget = () => {
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      const targetPosition =
        targetElement.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({
        top: targetPosition - 130,
        behavior: 'smooth',
      })
    }
  }

  return (
    <>
      <button
        onClick={scrollToTarget}
        className={`${styles['top-btn']} ${visible ? styles['visible'] : ''}`}
      >
        <>
          <Image
            src="/ghost/ghost_08.png"
            alt="top-button-default"
            width={130}
            height={110}
            className={`${styles['default']} animate__animated animate__pulse animate__infinite animate__slow`}
            priority={false}
          />
          <Image
            src="/ghost/ghost_21.png"
            alt="top-button-hover"
            width={130}
            height={110}
            className={`${styles['hover']} animate__animated animate__tada animate__infinite`}
            priority={false}
          />
        </>
      </button>
    </>
  )
}
