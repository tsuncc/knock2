// page components checkout success
import styles from './checkout-success.module.css'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
// contexts
import { useAuth } from '@/context/auth-context'
import { useCart } from '@/context/cart-context'
// hooks
import useFetchOrderData from '@/hooks/fetchOrderDetails'
// components
import BlackBtn from '@/components/UI/black-btn'
import OrderItemDetail from '../../orders/order-item-detail'
import CheckoutTotalTable from '../checkout-total-table'
// api path
import { PRODUCT_IMG } from '@/configs/api-path'

export default function CheckoutSuccess() {
  const router = useRouter()
  const { order_id } = router.query
  const { auth, authIsReady } = useAuth() // 取得 auth.id, authIsReady
  const { calculateProductDiscount } = useCart()

  const { order, detail, fetchOrderData } = useFetchOrderData()

  useEffect(() => {
    if (router.isReady && authIsReady && auth.id) {
      fetchOrderData(order_id)
    }
  }, [order_id, auth.id, router.isReady, authIsReady])

  return (
    <section className={styles.sectionContainer}>
      <h3 className={styles.titleStyles}>訂單付款完成</h3>

      <div className={styles.contentContainer}>
        <img className={styles.ghostImg} src="/ghost/ghost_03.png" alt="" />
        {detail.map((detail) => (
          <OrderItemDetail
            key={detail.product_id}
            productName={detail.product_name}
            originalPrice={detail.order_unit_price}
            discountedPrice={
              calculateProductDiscount(
                detail.order_unit_price,
                detail.order_quantity,
                detail.discount_amount,
                detail.discount_percentage,
                detail.minimum_order,
              )
            }
            productImg={`${PRODUCT_IMG}/${detail.product_img}`}
            orderQty={detail.order_quantity}
          />
        ))}

        <CheckoutTotalTable
          subtotal={order.subtotal_price}
          deliverFee={order.deliver_fee}
          totalDiscount={order.discountTotal}
          checkoutTotal={
            order.subtotal_price + order.deliver_fee - order.discountTotal
          }
        />
      </div>

      <div className={styles.btnStack}>
        <BlackBtn btnText="繼續購物" href="/product" paddingType="medium" />
        <BlackBtn
          btnText="檢視訂單"
          href={`/user/orders/details/${order_id}`}
          paddingType="medium"
        />
      </div>
    </section>
  )
}
