import { Button } from '@mui/material'
import styles from './coupon-promote-button.module.css'
import { motion } from 'framer-motion'

export default function CouponPromoteButton({
  btnText = 'button',
  type = 'button',
  href = '/',
  onClick = () => {},
  paddingType = '',
  className,
  disabled = false,
}) {
  return (
    <motion.div
      animate={{ x: [0, 50, 0] }}
      transition={{ ease: 'easeOut', duration: 2, repeat: Infinity }}
    >
      <Button
        type={type}
        href={href}
        variant="outlined"
        onClick={onClick}
        className={`${styles.button} ${className}`}
        sx={{
          color: 'white',
          fontFamily: 'Noto Serif JP',
          borderRadius: '0',
          borderColor: '#222',
          background: '#222',
          fontSize: '16px',
          padding: "8px 16px 8px 80px",
          ':hover': {
            color: 'var(--pri-1)',
            border: '1px solid var(--pri-1)',
            backgroundColor: 'rgb(34, 34, 34, 0.1)',
          },
          // disabled style by Iris
          '&.Mui-disabled': {
            color: 'var(--text-grey)',
            borderColor: 'var(--pri-3)',
            background: 'var(--pri-3)',
            cursor: 'not-allowed',
          },
        }}
        disabled={disabled} // 設置 disabled 屬性 by Iris
      >
        {btnText}
        <img src="/order/icon-arrow-special.svg" className={styles.arrow} />
      </Button>
    </motion.div>
  )
}
