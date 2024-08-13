import styles from './checkout-total-table.module.css'
import CheckoutTotalRow from './checkout-total-row'
import HDivider from '@/components/UI/divider/horizontal-divider'

export default function CheckoutTotalTable({
  subtotal,
  deliverFee,
  checkoutTotal,
  totalDiscount,
}) {
  return (
    <div className={styles.totalBox}>
      <CheckoutTotalRow label="小計" content={subtotal} />
      <CheckoutTotalRow label="折扣" content={totalDiscount} />
      <CheckoutTotalRow label="運費" content={deliverFee} />
      <HDivider margin="0.75rem 0" />
      <CheckoutTotalRow label="合計" content={checkoutTotal} />
    </div>
  )
}
