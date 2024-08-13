import React, { useEffect, useState } from 'react'
import styles from './coupon-card.module.css'
import { motion } from 'framer-motion'
import MoreInfoBtn from './more-info-text-btn'
import { formatPrice } from '@/hooks/numberFormat'
import CouponCheckbox from './coupon-checkbox'
import CouponMoreInfoModal from '../coupon-more-info-modal'
import CouponTag from './coupon-tag'

export default function CouponCard({
  status = 'ongoing',
  coupon_id,
  coupon_name,
  minimum_order,
  valid_until,
  isChecked,
  handelSelectedToggle,
  coupon,
  selectable = true,
  btnHidden = false,
  disabled,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [checkedBoolean, setCheckedBoolean] = useState(isChecked)

  const getStatusClass = (baseClass) => {
    switch (status) {
      case 'ongoing':
        return `${baseClass}`
      case 'used':
        return `${baseClass} ${styles.history}`
      case 'expired':
        return `${baseClass} ${styles.history}`
      default:
        return baseClass
    }
  }

  const handleMoreInfoClick = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleCheckboxOnChange = () => {
    setCheckedBoolean(!checkedBoolean)
    handelSelectedToggle(coupon_id)
  }

  const getBgStyles = () => {
    if (disabled) {
      return `${styles.cardBg} ${styles.cardBgDisabled}`
    } else if (isChecked) {
      return `${styles.cardBg} ${styles.cardBgChecked}`
    } else {
      return `${styles.cardBg}`
    }
  }

  const getCouponCardLeftStyles = () => {
    let classNames = `${styles.couponCardLeft}`
    if (disabled) {
      classNames += ` ${styles.couponCardLeftDisabled}`
    } else if (isChecked) {
      classNames += ` ${styles.couponCardLeftChecked}`
    }
    return classNames
  }

  const getClasses = (baseClass, conditionClasses) => {
    let classNames = baseClass
    Object.entries(conditionClasses).forEach(([condition, className]) => {
      if (condition) {
        classNames += ` ${className}`
      }
    })
    return classNames
  }

  useEffect(() => {
    setCheckedBoolean(isChecked)
  }, [isChecked])

  return (
    <motion.div
      className={getBgStyles()}
      // className={`${styles.cardBg} ${isChecked ? styles.cardBgChecked : ''}`}
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div className={getStatusClass(styles.couponCard)}>
        <div className={getCouponCardLeftStyles()}>
          {selectable && (
            <div className={styles.checkboxContainer}>
              <CouponCheckbox
                checked={checkedBoolean}
                onChange={handleCheckboxOnChange}
                disabled={disabled}
              />
            </div>
          )}

          <img
            src="/ghost/ghost_11.png"
            alt=""
            className={styles.webGhostImg}
          />
        </div>

        <div
          className={
            disabled
              ? `${styles.couponCardRightDisabled} ${styles.couponCardRight}`
              : styles.couponCardRight
          }
        >
          <div className={styles.couponInfo}>
            <p>{coupon_name}</p>
            <div className={styles.textBox}>
              <small>最低消費：{formatPrice(minimum_order)}</small>
              <small>有效期限：{valid_until}</small>
            </div>
            {!btnHidden && <MoreInfoBtn onClick={handleMoreInfoClick} />}

            {disabled && <CouponTag tagText="不符合資格" />}
            <img
              src="/ghost/ghost_11.png"
              alt=""
              className={styles.appGhostImg}
            />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <CouponMoreInfoModal
          coupon_id={coupon_id} // 將 coupon card 的 coupon_id, coupon 內容傳遞給 CouponMoreInfoModal
          coupon={coupon}
          handleClose={handleCloseModal}
        />
      )}
    </motion.div>
  )
}
