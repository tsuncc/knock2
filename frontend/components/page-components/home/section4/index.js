import React from 'react'
import styles from './section4.module.scss'
import HomeBtn from '@/components/UI/home-btn'
import Image from 'next/image'

export default function HomeSection4() {
  return (
    <>
      <div className={styles['home-section4']}>
        <div className={styles['section-item']}>
          <div className={styles['title']}>
            <h1>Join a Team</h1>
            <div></div>
            <span>微光引路，共同解鎖密室謎題</span>
          </div>
          <Image
            src="/ghost/ghost_18.png"
            alt="LOGO"
            width={332}
            height={290}
          />
          <HomeBtn linkSrc="/teams" btnText="報名揪團" />
        </div>
        <div className={styles['section-item']}>
          <div className={styles['title']}>
            <h1>Create a Team</h1>
            <div></div>
            <span>成為故事的主角，帶領隊伍走出迷霧</span>
          </div>
          <Image
            src="/ghost/ghost_17.png"
            alt="LOGO"
            width={295}
            height={290}
          />
          <HomeBtn linkSrc="/themes" btnText="揪團開團" />
        </div>
      </div>
    </>
  )
}
