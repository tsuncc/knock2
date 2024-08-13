import React, { useState, useEffect } from 'react'
import styles from './get-coupon-section.module.css'
import axios from 'axios'
// context
import { useAuth } from '@/context/auth-context'
import { useRouter } from 'next/router'
// components
import CouponWheel from '../coupon-wheel'
import CouponCard from '../coupon-card'
// api path
import { COUPON_GET_NEW } from '@/configs/api-path'

export default function GetCouponSection() {
  const { auth, authIsReady } = useAuth()
  const router = useRouter()
  const [availableCoupons, setAvailableCoupons] = useState([])

  // 取得會員尚未領取的優惠券
  const fetchNewCoupons = async (memberId) => {
    try {
      const response = await axios.get(
        `${COUPON_GET_NEW}?member_id=${memberId}`
      )
      if (response.data.status) {
        setAvailableCoupons(response.data.rows)
        console.log('fetch available coupons!!!!!!!', response.data.rows)
      }
    } catch (error) {
      console.error('Error fetching available coupons:', error)
    }
  }

  useEffect(() => {
    if (router.isReady && authIsReady && auth.id) {
      fetchNewCoupons(auth.id)
    }
  }, [auth.id, router.isReady, authIsReady])

  return (
    <section className={styles.sectionContainer}>
      <h3 className={styles.title}>領取優惠券</h3>
      <div className={styles.wheelContainer}>
        <CouponWheel
          availableCoupons={availableCoupons}
          memberId={auth.id}
          fetchNewCoupons={fetchNewCoupons}
        />
      </div>
      <div className={styles.couponContainer}>
        <h6>快來抽獎把優惠券拿回家吧！</h6>

        <div className={styles.couponGrid}>
          {availableCoupons.length > 0 &&
            availableCoupons.map((v, i) => (
              <CouponCard
                key={v.id}
                coupon_id={v.id}
                coupon_name={v.coupon_name}
                minimum_order={v.minimum_order}
                valid_until={v.valid_until}
                btnHidden={true}
                selectable={false}
              />
            ))}
        </div>
      </div>
    </section>
  )
}
