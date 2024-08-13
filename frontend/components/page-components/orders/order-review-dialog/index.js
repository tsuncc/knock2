import styles from './order-review-dialog.module.css'
import FilterBtn from '@/components/UI/filter-btn'

export default function OrderReviewDialog({
  order_id,
  content = `喜歡您的商品嗎？<br />請留下您大大的讚賞！`,
  btnText = "評價",
}) {
  return (
    <div className={styles.orderReviewHintBox}>
      <img src="/ghost/ghost_05.png" alt="" />
      <div className={styles.orderReviewDialog}>
      <p dangerouslySetInnerHTML={{ __html: content }} />
        <FilterBtn
          btnText={btnText}
          href={`/user/orders/details/reviews/${order_id}`}
        />
      </div>
    </div>
  )
}
