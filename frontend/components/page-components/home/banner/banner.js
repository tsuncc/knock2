import styles from './banner.module.scss'
import Image from 'next/image'
import HomeBtn from '@/components/UI/home-btn'
import { useState, useEffect, useRef } from 'react'

export default function Banner() {
  const sectionRef = useRef(0)
  const [maskSize, setMaskSize] = useState(0)
  const [isFixed, setIsFixed] = useState(true)
  const [itemShow, setItemShow] = useState(false)

  const handleScroll = () => {
    if (!sectionRef.current) return
    const scrollPercentage =
      window.scrollY /
      (sectionRef.current.offsetHeight - (window.innerHeight + 0) * 2 + 50)

    // 0-1 沒字 要fix / 1-2 有字 要fix / >2 有字 不要fix
    if (scrollPercentage <= 1) {
      setItemShow(false)
      setIsFixed(true)
    } else if (scrollPercentage > 1 && scrollPercentage <= 2) {
      setItemShow(true)
      setIsFixed(true)
    } else {
      setItemShow(true)
      setIsFixed(false)
    }

    const newMaskSize = scrollPercentage * 200
    if (newMaskSize < 200) {
      setMaskSize(newMaskSize)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    // 清理事件監聽器
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <section
        ref={sectionRef}
        style={{
          height: '300vh',
          position: 'relative',
          backgroundColor: '#000000',
        }}
      >
        <div
          className={styles['banner']}
          style={{ position: isFixed ? 'fixed' : 'absolute' }}
        >
          <Image
            src="/home/bg-big.png"
            alt="banner-background"
            fill="true"
            priority={true}
            className={styles['banner-key']}
            style={{
              maskSize: `${maskSize}% , cover`,
              maskImage: `url('/home/key.svg')`,
              maskPosition: 'center',
              maskRepeat: 'no-repeat',
            }}
          />
          <div
            className={`${styles['banner-text']} 
            ${itemShow ? styles['text-show'] : ''}`}
          >
            <Image
              src="/home/bg-text-01.png"
              alt="banner-background"
              fill="true"
              priority={false}
            />
          </div>
          <div
            className={`${styles['banner-text']} 
            ${itemShow ? styles['text-show'] : ''}`}
          >
            <Image
              src="/home/bg-text-02.png"
              alt="banner-background"
              fill="true"
              priority={false}
            />
          </div>
          <div
            className={`${styles['title']} 
            ${itemShow ? styles['title-show'] : ''}`}
          >
            <span>searching for the truth</span>
          </div>
          <div
            className={`${styles['banner-btn']} 
          ${itemShow ? styles['btn-show'] : ''}`}
          >
            <HomeBtn
              linkSrc="/teams"
              btnText="立即去揪團"
              color="#b7b7b7"
              borderColor="#b7b7b7"
              hoverBorderColor="#7B7B7B"
            />
            <HomeBtn
              linkSrc="/themes"
              btnText="第一次遊玩"
              color="#b7b7b7"
              borderColor="#b7b7b7"
              hoverBorderColor="#7B7B7B"
            />
          </div>
        </div>
      </section>
    </>
  )
}
