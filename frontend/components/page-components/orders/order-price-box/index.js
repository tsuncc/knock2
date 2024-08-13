import styles from './order-price-box.module.css'
import { formatPrice } from '@/hooks/numberFormat'

export default function OrderPriceBox({ discountedPrice, originalPrice }) {
  const getFirstPrice = () => {
    if (discountedPrice > 0) {
      return formatPrice(discountedPrice)
    } else {
      return formatPrice(originalPrice)
    }
  }

  const getSecondPrice = () => {
    if (discountedPrice > 0 && discountedPrice !== originalPrice) {
      return formatPrice(originalPrice)
    } else {
      return null
    }
  }

  return (
    <div className={styles.itemPriceStyle}>
      <p>{getFirstPrice()}</p>
      <small>{getSecondPrice()}</small>
    </div>
  )
}
