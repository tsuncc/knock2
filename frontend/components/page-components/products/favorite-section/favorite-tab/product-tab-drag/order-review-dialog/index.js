import styles from './order-review-dialog.module.css'

export default function OrderReviewDialog() {
  return (
    <div className={styles.orderReviewHintBox}>
      <img src="/ghost/ghost_05.png" alt="" />
      <div className={styles.orderReviewDialog}>
        可以分類收藏及自訂收藏夾名稱喔!
      </div>
    </div>
  )
}
