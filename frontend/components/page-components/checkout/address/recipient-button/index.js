import styles from './recipient-button.module.css'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
// icons
import { IoIosArrowForward, IoMdAdd } from 'react-icons/io'

const RecipientBtn = styled(Button)(({ bgtype }) => ({
  gridColumn: 'span 2',
  display: 'flex',
  justifyContent: 'space-between',
  color: 'var(--text-dark)',
  fontSize: '1.125rem',
  fontFamily: '"Noto Serif JP", serif',
  backgroundColor: bgtype === 'fill' ? '#F2F2F2' : 'white',
  border: bgtype === 'fill' ? 'none' : '2px solid #F2F2F2',
  padding: '0.875rem 1.25rem',
  borderRadius: 'var(--input-radius)',
  boxShadow: 'none',
  width: '100%',
  '&:hover': {
    backgroundColor: '#fafafa',
    boxShadow: 'none',
  },
}))

export default function RecipientButton({
  btnText = '請選擇收件人資料',
  iconType = 'arrow',
  bgtype = 'fill',
  onClick = { onClick },
}) {
  return (
    <RecipientBtn bgtype={bgtype} onClick={onClick} type='button'>
      <p className={styles.btnTextStyle}>{btnText}</p>
      {iconType === 'arrow' ? <IoIosArrowForward /> : <IoMdAdd />}
    </RecipientBtn>
  )
}
