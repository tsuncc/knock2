import React, { useState, useEffect } from 'react'
import styles from './order-reviews-page.module.css'
import axios from 'axios'
// hooks
import useFetchOrderData from '@/hooks/fetchOrderDetails'
// components
import BlackBtn from '@/components/UI/black-btn'
import ReviewItemCard from './review-item-card'
import UserHeader from '@/components/UI/user-header'
import OrderDetailInfo from '../order-detail-info'
import { useSnackbar } from '@/context/snackbar-context'

import {
  PRODUCT_IMG,
  ORDER_REVIEW_POST,
  ORDER_REVIEW_GET,
} from '@/configs/api-path'

export default function OrderReviewsSection({ order_id }) {
  const [reviews, setReviews] = useState([])
  const [formData, setFormData] = useState([])
  const [anyReviewed, setAnyReviewed] = useState(false)
  // const { orderData, orderDetails } = useFetchOrderData(orderId)
  const { order, detail, fetchOrderData } = useFetchOrderData()
  const { openSnackbar } = useSnackbar()

  const fetchOrderReviews = async () => {
    try {
      const response = await axios.get(`${ORDER_REVIEW_GET}/${order_id}`)
      if (response.data.success) {
        setReviews(response.data.rows)

        // 初始化 formData
        const initialFormData = response.data.rows.map((v) => ({
          order_id: +order_id,
          order_product_id: v.order_product_id,
          review: v.review || '',
          rate: v.rate || 0,
        }))
        setFormData(initialFormData)

        // 檢查是否有任一 review_status 為 1
        const anyReviewed = response.data.rows.find(
          (v) => v.review_status === 1
        )
        setAnyReviewed(!!anyReviewed)

        console.log('fetch', response.data.rows)
      }
    } catch (error) {
      console.error('Error fetching order reviews:', error)
    }
  }

  useEffect(() => {
    if (order_id > 0) {
      fetchOrderData(order_id)
      fetchOrderReviews()
    }
  }, [order_id])

  // 控制表單輸入欄位，更新 formData
  const handleInputChange = (e, order_product_id) => {
    const { name, value } = e.target
    setFormData((prevFormData) =>
      prevFormData.map((item) =>
        item.order_product_id === order_product_id
          ? { ...item, [name]: value }
          : item
      )
    )
    console.log(formData)
  }

  const handleRatingChange = (order_product_id, rate) => {
    setFormData((prevFormData) =>
      prevFormData.map((item) =>
        item.order_product_id === order_product_id ? { ...item, rate } : item
      )
    )
    console.log(formData)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(ORDER_REVIEW_POST, formData)

      const data = response.data
      console.log(data)

      if (data.success) {
        fetchOrderReviews()
        openSnackbar('您的評價已送出！', 'success')
        // window.location.reload()
      }
    } catch (error) {
      console.error('提交表單時出錯', error)
    }
  }

  return (
    <form
      name="orderReviews"
      onSubmit={handleSubmit}
      className={styles.orderDetailBox}
    >
      {/* card header */}
      <UserHeader type="icon" title="訂單評價" btnHidden={true} />

      <OrderDetailInfo
        order_date={order?.order_date}
        merchant_trade_no={order?.merchant_trade_no}
        paymentHidden={true}
      />

      {/* card body */}
      {reviews.length > 0 &&
        reviews.map((v) => {
          const formDataItem = formData.find(
            (f) => f.order_product_id === v.order_product_id
          ) || { review: '', rate: 0 }

          const isAnyReviewed = anyReviewed === true
          const review = isAnyReviewed ? v.review : formDataItem.review
          const rate = isAnyReviewed ? v.rate : formDataItem.rate
          const readOnly = isAnyReviewed

          return (
            <ReviewItemCard
              key={v.order_product_id}
              order_product_id={v.order_product_id}
              product_name={v.product_name}
              product_img={`${PRODUCT_IMG}/${v.product_img}`}
              review={review}
              rate={rate}
              onChange={(e) => handleInputChange(e, v.order_product_id)}
              onRatingChange={(rate) =>
                handleRatingChange(v.order_product_id, rate)
              }
              review_date={v.review_date}
              readOnly={readOnly}
            />
          )
        })}

      {anyReviewed === false && (
        <div className={styles.btnStack}>
          <BlackBtn
            type="submit"
            btnText="送出評價"
            href={null}
            paddingType="medium"
          />
        </div>
      )}
    </form>
  )
}
