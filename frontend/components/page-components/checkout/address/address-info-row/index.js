import styles from './address-info-row.module.css'
import { FaPhoneAlt } from 'react-icons/fa'

export default function AddressInfoRow({
  icon: IconComponent = FaPhoneAlt,
  content,
}) {
  return (
    <div className={styles.iconTextRow}>
      <IconComponent />
      <p className={styles.contentText}>{content}</p>
    </div>
  )
}
