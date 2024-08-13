import { useRouter } from 'next/router'
import axios from 'axios'
// api path
import {
  ECPAY_GET,
  CANCEL_ORDER,
  RESERVATION_ECPAY_GET,
  CANCEL_RESERVATION,
} from '@/configs/api-path'

const usePayment = () => {
  const router = useRouter()

  const handleOrderCancel = async (order_id) => {
    try {
      const updateOrderStatus = await axios.post(
        `${CANCEL_ORDER}?order_id=${order_id}`
      )

      if (updateOrderStatus.data.success) {
        return { success: true }
      } else {
        return { success: false, error: '取消訂單失敗' }
      }
    } catch (error) {
      console.error('取消訂單錯誤', error)
      return { success: false, error: '取消訂單錯誤' }
    }
  }

  // 訂單付款
  const handleOrderPayment = async (order_id, total_price) => {
    try {
      const orderId = order_id
      const checkoutTotal = total_price

      const ecpayResponse = await axios.get(ECPAY_GET, {
        params: {
          orderId,
          checkoutTotal,
        },
      })

      if (ecpayResponse.data.success) {
        // Redirect to a new payment page
        router.push({
          pathname: '/ecpay-checkout',
          query: {
            html: encodeURIComponent(ecpayResponse.data.html),
          },
        })
      }
    } catch (error) {
      console.error('提交表單時出錯', error)
    }
  }

  // 取消預約
  const handleReservationCancel = async (reservation_id) => {
    try {
      const updateOrderStatus = await axios.post(
        `${CANCEL_RESERVATION}?reservation_id=${reservation_id}`
      )

      if (updateOrderStatus.data.success) {
        return { success: true }
      } else {
        return { success: false, error: '取消預約失敗' }
      }
    } catch (error) {
      console.error('取消預約錯誤', error)
      return { success: false, error: '取消預約錯誤' }
    }
  }

  // 預約付款
  const handleReservationPayment = async (reservation_id) => {
    try {
      const ecpayResponse = await axios.get(RESERVATION_ECPAY_GET, {
        params: {
          reservation_id,
        },
      })

      if (ecpayResponse.data.success) {
        // Redirect to a new payment page
        router.push({
          pathname: '/ecpay-checkout',
          query: {
            html: encodeURIComponent(ecpayResponse.data.html),
          },
        })
      }
    } catch (error) {
      console.error('提交表單時出錯', error)
    }
  }

  return {
    handleOrderCancel,
    handleOrderPayment,
    handleReservationPayment,
    handleReservationCancel,
  }
}

export default usePayment
