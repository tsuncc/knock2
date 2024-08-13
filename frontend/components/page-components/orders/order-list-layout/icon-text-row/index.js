import styles from './icon-text-row.module.css'
import { HiOutlineShoppingBag } from 'react-icons/hi'

export default function IconTextRow({
  icon: IconComponent = HiOutlineShoppingBag,
  content = '',
}) {
  return (
    <div className={styles.orderInfoRow}>
      <IconComponent className={styles.iconStyle}/>
      <p>{content}</p>
    </div>
  )
}
