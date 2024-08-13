import { useEffect } from 'react'
import styles from './reservation-list-cards.module.css'
import AOS from 'aos'
// components
import OrderDetailRow from '../../orders/order-detail-row'
import CardHeader from '../../orders/order-list-layout/card-header'
import { formatDate, formatDateWithWeekday } from '@/hooks/numberFormat'

export default function ReservationListCards({
  reservation_date = 'reservation_date',
  theme_name = 'theme_name',
  theme_img = 'theme_img',
  session = 'start_time ~ end_time',
  participants = 'participants',
  deposit,
  created_at,
  payment_date,
  payment_type,
  cancel,
  rtn_code,
  reservation_status_id = 0,
  handleCancel,
  handlePayment,
  index,
}) {
  const currentDate = new Date().toJSON().slice(0, 10)

  const getPaymentDate = () => {
    if (rtn_code === 1) {
      return payment_date
    } else {
      if (cancel === 1) {
        return '已取消'
      } else if (reservation_date < currentDate) {
        return '已逾期'
      } else {
        return '待付款'
      }
    }
  }

  const getPaymentType = () => {
    if (rtn_code === 1) {
      return ` / ${payment_type}`
    } else {
      return ''
    }
  }

  // 是否顯示取消訂單
  const showCancelBtn = () => {
    return cancel === 0 && reservation_date > currentDate ? false : true
  }

  // 是否顯示重新付款
  const showPaymentBtn = () => {
    return (!rtn_code || rtn_code === 0) &&
      cancel === 0 &&
      reservation_date > currentDate
      ? false
      : true
  }

  const getDelay = () => {
    return index % 2 === 0 ? 0 : 200
  }

  useEffect(() => {
    AOS.init()
  }, [])

  return (
    <div
      className={styles.reservationContainer}
      data-aos="fade-right"
      data-aos-delay={getDelay()}
    >
      <CardHeader
        title={formatDate(reservation_date)}
        btn1Text={'取消訂單'}
        btn1Hidden={showCancelBtn()}
        btn1OnClick={handleCancel} // 從父層 reservation page 設定
        btn2Text={'重新付款'}
        btn2Hidden={showPaymentBtn()}
        btn2OnClick={handlePayment} // 從父層 reservation page 設定
        btn3Hidden={true}
      />

      <div className={styles.reservationContent}>
        <div className={styles.reservationLeft}>
          <div className={styles.themeImgBox}>
            <img src={theme_img} />
          </div>
        </div>

        <div className={styles.reservationRight}>
          <div className={styles.reservationInfoBox}>
            <OrderDetailRow
              label="行程日期"
              content={formatDateWithWeekday(reservation_date)}
            />
            <OrderDetailRow label="密室主題" content={theme_name} />
            <OrderDetailRow label="預約場次" content={session} />
            <OrderDetailRow label="預約人數" content={`${participants} 人`} />
            <OrderDetailRow label="訂金金額" content={deposit} />
            <OrderDetailRow label="成立日期" content={formatDate(created_at)} />
            <OrderDetailRow
              label="付款日期"
              content={`${getPaymentDate()} ${getPaymentType()}`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
