import styles from './error-hint.module.css'
import { BiSolidErrorCircle } from 'react-icons/bi'

export default function ErrorHint({ hintText = 'hintText' }) {
  return (
    <div className={styles.validateFailedBox}>
      <BiSolidErrorCircle />
      <small>{hintText}</small>
    </div>
  )
}
