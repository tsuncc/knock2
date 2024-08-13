import styles from './checkout-total-table.module.css'
import CheckoutTotalRow from '../checkout-total-row'
import HDivider from '@/components/UI/divider/horizontal-divider'

export default function CheckoutTotalTable({
  subtotal,
  checkoutTotal,
  totalDiscount,
}) {
  return (
    <div className={styles.totalBox}>
      <CheckoutTotalRow label="訂金" content={subtotal} />

      <HDivider margin="0.75rem 0" />
      <CheckoutTotalRow label="總計" content={checkoutTotal} />
    </div>
  )
}
