import React, { useEffect, useState } from 'react'
import styles from './checkout-offcanvas.module.css'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
// mui
import Drawer from '@mui/material/Drawer'
import Badge from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'
import { styled, ThemeProvider, createTheme } from '@mui/material/styles'
// context
import { useCart } from '@/context/cart-context'
// components
import CheckoutTotalTable from '../checkout-total-table'
import BlackBtn from '@/components/UI/black-btn'
import OrderItemCheckout from '../../orders/order-item-checkout'
import EmptyCart from '../empty-cart'
import CouponSelectModal from '../../coupon/coupon-select-modal'
// icons
import { FaCartShopping } from 'react-icons/fa6'

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -24,
    top: -20,
    color: 'white',
    backgroundColor: 'var(--sec-1)',
  },
}))

const drawerTheme = createTheme({
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          width: '40%',
          maxWidth: '480px',
          minWidth: '352px',
          backgroundColor: 'white',
          '@media (max-width:400px)': {
            width: '90%',
          },
        },
      },
    },
  },
})

export default function CheckoutOffcanvas() {
  const router = useRouter()
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const toggleShow = () => setShow((s) => !s)
  // 取得會員購物車資料、更新訂單總金額、接收商品數量變化
  const {
    // checkoutItems,
    checkoutTotal,
    subtotal,
    deliverFee,
    cartBadgeQty,
    // handleQuantityChange,
    discountTotal,
  } = useCart()

  const handleGoToCart = () => {
    router.push('/checkout')
  }

  return (
    <>
      <IconButton
        aria-label="cart"
        onClick={toggleShow}
        sx={{ width: '2rem', height: '2rem', padding: '2px' }}
      >
        <motion.div
          key={subtotal} // 使用 key 屬性強制重新渲染
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.3,
            ease: [0, 0.71, 0.2, 1.01],
            scale: {
              type: 'spring',
              damping: 5,
              stiffness: 50,
              restDelta: 0.001,
            },
          }}
        >
          <StyledBadge
            badgeContent={cartBadgeQty}
            color="secondary"
            max={99}
          ></StyledBadge>
        </motion.div>
        <FaCartShopping />
      </IconButton>

      <ThemeProvider theme={drawerTheme}>
        <Drawer open={show} onClose={handleClose} anchor="right">
          {/* drawer header */}

          <div className={styles.drawerContainer}>
            {/* drawer top (title + checkout items list) */}
            <div>
              {/* title */}
              <div className={styles.checkoutTitle}>
                <h5>購物車</h5>

                <div className={styles.cartItemCount}>{cartBadgeQty}</div>
              </div>

              {/* 如果購物車「無」商品： */}
              {cartBadgeQty <= 0 && <EmptyCart />}

              {/* 如果購物車有商品： */}
              {cartBadgeQty > 0 && (
                <div className={styles.checkoutList}>
                  <OrderItemCheckout type="small" />
                </div>
              )}
            </div>

            {cartBadgeQty > 0 && (
              <div className={styles.checkoutBottom}>
                <CouponSelectModal />

                <CheckoutTotalTable
                  subtotal={subtotal}
                  checkoutTotal={checkoutTotal}
                  deliverFee={deliverFee}
                  totalDiscount={discountTotal}
                />
                <BlackBtn
                  btnText="前往購物車"
                  href={null}
                  onClick={handleGoToCart}
                  paddingType="medium"
                />
              </div>
            )}
          </div>
        </Drawer>
      </ThemeProvider>
    </>
  )
}
