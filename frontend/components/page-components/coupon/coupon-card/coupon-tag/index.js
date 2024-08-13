import styles from './coupon-tag.module.css'

export default function CouponTag({tagText}) {
  return (
    <div className={styles.tagBox}>
      {tagText}
    </div>
  )
}
