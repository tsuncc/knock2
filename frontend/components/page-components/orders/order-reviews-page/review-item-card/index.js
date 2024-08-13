import React from 'react'
import styles from './review-item-card.module.css'
import OrderProductImgBox from '../../order-product-img-box'
import OrderRating from '@/components/UI/rating'
import Input01 from '@/components/UI/form-item/input01'

export default function ReviewItemCard({
  order_product_id = 0,
  product_name = '',
  product_img = '',
  placeholder = '請輸入評價',
  review = '',
  rate = 0,
  onChange,
  onRatingChange,
  readOnly = false,
  review_date,
}) {
  return (
    <div className={styles.orderItemBox}>
      <OrderProductImgBox imgSrc={product_img} width="128px" height="128px" smallWidth='72px' smallHeight='112px'/>
      <div className={styles.orderItemBoxRight}>
        <p className={styles.productName}>{product_name}</p>
        {readOnly ? (
          <p>{review}</p>
        ) : (
          <Input01
            name="review"
            placeholder={placeholder}
            value={review}
            inputStyles="line"
            onChange={onChange}
          />
        )}
        <div className={styles.ratingBox}>
          <OrderRating
            readOnly={readOnly}
            rate={rate}
            onChange={onRatingChange}
          />
          <small>{review_date}</small>
        </div>
      </div>
    </div>
  )
}
