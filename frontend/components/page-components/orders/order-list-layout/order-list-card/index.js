import styles from './order-list-card.module.css'
import { formatPrice } from '@/hooks/numberFormat'
import { PRODUCT_IMG } from '@/configs/api-path'
import CardHeader from '../card-header'
import IconTextRow from '../icon-text-row'
import OrderStatusTag from '../../order-status-tag'
import OrderProductImgBox from '../../order-product-img-box'
import { HiOutlineCreditCard, HiOutlineCube } from 'react-icons/hi'
import { useRouter } from 'next/router'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react'

export default function OrderListCard({
  order_id,
  merchant_trade_no,
  order_date,
  total_price,
  payment_type,
  full_address,
  status,
  // order_status_name,
  orderDetailData,
  handlePayment, // 接收父層 order list layout
  handleCancel, // 接收父層 order list layout
  index,
}) {
  const router = useRouter()

  const goToDetail = () => {
    router.push(`/user/orders/details/${order_id}`)
  }

  const showCancelBtn = () => {
    return status === 'ongoing' || status === 'shipping' ? false : true
  }

  const showPaymentBtn = () => {
    return status === 'ongoing' ? false : true
  }

  const getStatus = () => {
    switch (status) {
      case 'ongoing':
        return '待付款'
      case 'shipping':
        return '待出貨'
      case 'completed':
        return '已完成'
      case 'canceled':
        return '已取消'
      default:
        '已取消'
        break
    }
  }

  const getDelay = () => {
    return index % 2 === 0 ? 0 : 200
  }

  const getPaymentType = () => {
    if (status === 'canceled') {
      return '已取消'
    } else {
      return payment_type
    }
  }

  useEffect(() => {
    AOS.init()
  }, [])

  return (
    <div className={styles.orderBox} data-aos="fade-right" data-aos-delay={getDelay()}>
      <CardHeader
        title={order_date}
        btn1Text="詳情"
        btn1OnClick={goToDetail}
        btn2Hidden={showPaymentBtn()}
        btn2Text="重新付款"
        btn2OnClick={handlePayment}
        btn3Hidden={showCancelBtn()}
        btn3Text="取消訂單"
        btn3OnClick={handleCancel}
      />
      <div className={styles.orderBody}>
        <div  className={styles.orderInfoRowBox}>
  
            <IconTextRow content={merchant_trade_no} />
            <IconTextRow
              content={`${formatPrice(total_price)} / ${getPaymentType()}`}
              icon={HiOutlineCreditCard}
            />
            <IconTextRow content={full_address} icon={HiOutlineCube} />
  

          <OrderStatusTag statusText={getStatus()} />
        </div>

        <div className={styles.imgListBox}>
          {orderDetailData
            .filter((detail) => detail.order_id === order_id)
            .map((detail, i) => (
              <OrderProductImgBox
                key={i}
                imgSrc={
                  detail.product_img
                    ? `${PRODUCT_IMG}/${detail.product_img}`
                    : ''
                }
                productId={detail.product_id}
              />
            ))}
        </div>
      </div>
    </div>
  )
}
