import React from 'react'
import IndexLayout from '@/components/layout'
import GetCouponSection from '@/components/page-components/coupon/get-coupon-section'

export default function GetCouponPage() {
  return (
    <IndexLayout title="領取優惠券" background="light">
      <GetCouponSection />
    </IndexLayout>
  )
}
