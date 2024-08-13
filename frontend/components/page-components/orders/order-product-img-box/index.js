import styles from './order-product-img-box.module.css'
import Button from '@mui/material/Button'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import NoData from '@/components/UI/no-data'
import { useEffect } from 'react'

export default function OrderProductImgBox({
  imgSrc = '',
  imgAlt = 'knock_knock_product_image',
  width = '6.25rem',
  height = '6.25rem',
  radius = '1rem',
  smallWidth = '5.75rem',
  smallHeight = '5.75rem',
  smallRadius = '0.75rem',
  productId,
}) {
  const router = useRouter()
  const goToProductPage = () => {
    window.location.href = `/product/product-details/${productId}`
  }

  return (
    <Button
      sx={{
        padding: '0',
        margin: '0',
        borderRadius: 'var(--img-radius)',
        '&:hover': {
          backgroundColor: 'transparent',
        },
      }}
      onClick={() => {
        goToProductPage()
      }}
    >
      <motion.div
        className={styles.itemImgBox}
        style={{
          '--img-width': width,
          '--img-height': height,
          '--img-radius': radius,
          '--small-img-width': smallWidth,
          '--small-img-height': smallHeight,
          '--small-img-radius': smallRadius,
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.3,
          ease: [0, 0.71, 0.2, 1.01],
        }}
      >
        {imgSrc ? (
          <motion.img src={`${imgSrc}.jpg`} alt={imgAlt} />
        ) : (
          <NoData text="無商品圖" borderRadius="0rem" />
        )}
      </motion.div>
    </Button>
  )
}
