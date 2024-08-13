import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import styles from './coupon-promote.module.css'
import CouponPromoteButton from './coupon-promote-button'

export default function CouponPromote() {
  const [isOpen, setIsOpen] = useState(true)
  const router = useRouter()

  const goToDrawing = () => {
    router.push('/coupon')
  }

  return (
    <div className={styles.container}>
      <motion.div
        layout
        data-isOpen={isOpen}
        className={styles.parent}
        onClick={() => setIsOpen(!isOpen)}
        // onHoverStart={() => setIsOpen(!isOpen)}
      >
        <div className={styles.contentBox}>
          <div className={styles.contentLeft}>
            <div className={styles.title}>桌遊商城抽獎活動</div>
            <p className={styles.validBox}>
            親愛的桌遊迷們，為了感謝大家一直以來的支持，特別舉辦了一場桌遊優惠券抽獎活動！現在就有機會贏取我們精心準備的優惠券，讓你在下一次購買桌遊時享受更多折扣！趕快來參加抽獎活動吧！祝各位桌遊迷們好運！🎉🎉🎉
            </p>
            <div className={styles.actionButton}>
              <CouponPromoteButton
                btnText="前往抽獎活動"
                href={null}
                onClick={goToDrawing}
              />
            </div>
          </div>

          <div className={styles.contentRight}>
            <img src="/order/sales-banner-01.png" />
          </div>
        </div>

        <motion.div className={styles.child}>
          <motion.img
            src="/ghost/ghost_gift.webp"
            animate={{ scale: [0.95, 1.05, 0.95] }}
            transition={{ ease: 'easeOut', duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
