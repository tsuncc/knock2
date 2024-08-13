import React from 'react'
import styles from './user-layout.module.css'

export default function UserLayout({ userTab, userTabSec, sectionRight }) {
  return (
    <section className={styles.sectionContainer}>
      <div className={styles.sectionBody}>
        {userTab}
        <div className={styles.sectionRight}>
          {userTabSec}
          {sectionRight}
        </div>
      </div>
    </section>
  )
}
