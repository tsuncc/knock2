import styles from './reservation-success-rows.module.css'

export default function SuccessRows({ label = 'label', content = 'content' }) {
  return (
    <div className={styles.rowBox}>
      <h6>{label}</h6>
      <h6>{content}</h6>
    </div>
  )
}
