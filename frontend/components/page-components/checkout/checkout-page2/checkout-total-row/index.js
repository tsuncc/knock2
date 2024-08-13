import styles from './checkout-total-row.module.css'
import { formatPrice } from '@/hooks/numberFormat'

export default function CheckoutTotalRow({
  label='label',
  content=0,
}) {
  return (
    <div className={styles.totalRow}>
      <p>{label}</p>
      <p>{formatPrice(content)}</p>
    </div>
  )
}
