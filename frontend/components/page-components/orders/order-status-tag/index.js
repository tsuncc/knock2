// Order Status Component
import styles from './order-status-tag.module.css'

export default function OrderStatusTag({ statusText }) {
  let statusClass = ''
  // let statusText = ''

  switch (statusText) {
    case '待付款':
      statusClass = styles.orderStatusOrange
      // statusText = '處理中'
      break
    case '待出貨':
      statusClass = styles.orderStatusBlue
      // statusText = '已出貨'
      break
    case '已完成':
      statusClass = styles.orderStatusGreen
      // statusText = '已完成'
      break
    case '已取消':
      statusClass = styles.orderStatusGrey
      // statusText = '已完成'
      break
    default:
      statusClass = styles.orderStatusOrange
      // statusText = ''
      break
  }

  return (
    <div className={`${styles.orderStatusTag} ${statusClass}`}>
      {statusText}
    </div>
  )
}
