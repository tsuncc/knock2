// order item component for checkout page
import styles from './order-item-detail.module.css'
import OrderProductImgBox from '../order-product-img-box'
import OrderPriceBox from '../order-price-box'

export default function OrderItemDetail({
  productId = 0,
  productName = '產品名稱',
  originalPrice = 0,
  discountedPrice = 0,
  productImg = '',
  orderQty = 1,
}) {
  return (
    <div className={styles.itemBox}>
      <OrderProductImgBox imgSrc={productImg} productId={productId} />

      <div className={styles.itemInfo}>
        <p>{productName}</p>

        <div className={styles.qtyPriceStack}>
          <div className={styles.qty}>x {orderQty}</div>

          <OrderPriceBox
            originalPrice={originalPrice}
            discountedPrice={discountedPrice}
          />
        </div>
      </div>
    </div>
  )
}
