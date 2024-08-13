import styles from './loading.module.scss'
import Image from 'next/image'

export default function Loading() {
  return (
    <>
      <div className={styles.ring}>
        <i className={styles.border1}></i>
        <i className={styles.border2}></i>
        <i className={styles.border3}></i>
        <div className={styles.ghost}>
          <Image
            src="/ghost/ghost_18.png"
            alt="loading"
            fill="true"
            sizes="350px"
          />
        </div>
      </div>
    </>
  )
}
