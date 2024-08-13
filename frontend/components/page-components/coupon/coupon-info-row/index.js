import styles from './coupon-info-row.module.css'

export default function CouponInfoRow({ label = '標題', content = '內容' }) {
  return (
    <div className={styles.rowBox}>
      <p>{label}</p>
      <p>{content}</p>
    </div>
  )
}
