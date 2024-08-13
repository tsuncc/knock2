import Button from '@mui/material/Button'
import styles from './more-info-text-btn.module.css'
import { HiOutlineInformationCircle } from 'react-icons/hi'

export default function MoreInfoBtn({ onClick }) {
  return (
    <Button sx={{ color: 'white', padding: '0' }} onClick={onClick}>
      <HiOutlineInformationCircle />
      <small className={styles.text}>使用說明</small>
    </Button>
  )
}
