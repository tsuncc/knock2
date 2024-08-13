import { createTheme, ThemeProvider } from '@mui/material/styles'
import styles from './coupon-win-dialog.module.css'
import { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import CouponCard from '../coupon-card'
import BlackBtn from '@/components/UI/black-btn'

export default function CouponWinDialog({
  isOpen,
  isClose,
  description,
  winCoupon,
  handleClose,
  handleAddCoupon,
}) {
  const [hasCoupon, setHasCoupon] = useState(false)

  const theme = createTheme({
    components: {
      MuiDialog: {
        styleOverrides: {
          paper: {
            width: '376px',
            height: 'auto',
            borderRadius: '10rem 10rem 2.5rem 2.5rem',
            overflow: 'visible',
            backgroundImage: `url(/order/coupon-bg.jpg)`, // 使用 url() 函數設置背景圖片
            backgroundSize: 'cover', // 設置背景圖片大小為 cover
            backgroundPosition: 'center', // 設置背景圖片位置為 center
          },
        },
      },
      MuiBackdrop: {
        styleOverrides: {
          root: {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
  })

  const ghostImg = () => {
    return hasCoupon ? '/ghost/ghost_10.png' : '/ghost/ghost_12.png'
  }

  const isObjectHaveValues = (obj) => {
    return Object.values(obj).length > 0
  }

  useEffect(() => {
    setHasCoupon(isObjectHaveValues(winCoupon))
    ghostImg()
  }, [winCoupon])

  return (
    <ThemeProvider theme={theme}>
      <Dialog open={isOpen} onClose={isClose}>
        <img src={ghostImg()} className={styles.ghostImg} />

        <div className={styles.modalBody}>
          <h6 className={styles.title}>{description}</h6>
          {hasCoupon && (
            <div className={styles.couponBox}>
              <CouponCard
                selectable={false}
                coupon_name={winCoupon.coupon_name}
                minimum_order={winCoupon.minimum_order}
                valid_until={winCoupon.valid_until}
              />
            </div>
          )}
          {hasCoupon ? (
            <BlackBtn
              btnText="領取"
              href={null}
              onClick={handleAddCoupon}
              paddingType="medium"
            />
          ) : (
            <BlackBtn
              btnText="關閉"
              href={null}
              onClick={handleClose}
              paddingType="medium"
            />
          )}
        </div>
      </Dialog>
    </ThemeProvider>
  )
}
