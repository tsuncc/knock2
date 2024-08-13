import { color } from 'framer-motion'
import styles from './checkout-coupon-btn.module.css'
import CouponBtn from './couponBtn'

export default function CheckoutCouponBtn({
  content = '請選擇優惠券',
  btnText = '全站優惠券',
  onClick,
}) {
  const textColor = content.includes('請選擇') ? 'Silver' : 'var(---pri-1)'
  return (
    <div className={styles.couponBox}>
      <div className={styles.content} style={{ color: textColor }}>
        {content}
      </div>
      <CouponBtn btnText={btnText} onClick={onClick} />
    </div>
  )
}
