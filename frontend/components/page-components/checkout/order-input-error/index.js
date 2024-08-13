import styles from './order-input-error.module.css'

export default function OrderInputError({ errorText = '' }) {
  return (
    <div className={styles.errorBox}>
      <span className={styles.errorText}>{errorText}</span>
    </div>
  )
}
