import styles from './order-detail-info.module.css'
import { formatPrice, formatDate } from '@/hooks/numberFormat'
import OrderDetailRow from '../order-detail-row'

export default function OrderDetailInfo({
  order_date,
  merchant_trade_no,
  deliver_fee,
  total_price,
  payment_date,
  payment_type,
  full_address,
  order_status_id,
  discount_total,
  order_status_name,
  paymentHidden = false,
}) {
  return (
    <div className={styles.orderInfoBox}>
      <OrderDetailRow label="訂單日期" content={formatDate(order_date)} />

      {!!merchant_trade_no && (
        <OrderDetailRow label="訂單編號" content={merchant_trade_no} />
      )}

      {!paymentHidden && (
        <OrderDetailRow label="折扣" content={formatPrice(discount_total)} />
      )}
      {!paymentHidden && (
        <OrderDetailRow label="運費" content={formatPrice(deliver_fee)} />
      )}
      {!paymentHidden && (
        <OrderDetailRow label="合計" content={formatPrice(total_price)} />
      )}
      {!paymentHidden && !!payment_date && (
        <OrderDetailRow
          label="付款時間"
          content={`${payment_date} / ${payment_type}`}
        />
      )}
      {!paymentHidden && <OrderDetailRow label="地址" content={full_address} />}

      <OrderDetailRow status={order_status_name} />
    </div>
  )
}
