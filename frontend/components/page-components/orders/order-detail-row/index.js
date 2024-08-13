import styles from './order-detail-row.module.css'

export default function OrderDetailRow({ label, content }) {
  return (
    <div className={styles.iconTextRow}>
      <p className={styles.label}>{label}</p>
      <p>{content}</p>
    </div>
  )
}
