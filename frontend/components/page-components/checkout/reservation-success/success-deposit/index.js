import styles from './success-deposit.module.css'

export default function SuccessDeposit({
  deposit = '500 元',
  payment_date = '2024-08-01 10:22',
}) {
  return (
    <div>
      <h5 className={styles.alignRight}>{deposit}</h5>
      <p className={styles.alignRight}>
        {payment_date ? payment_date : '2024-08-01 10:22'}
      </p>
    </div>
  )
}
