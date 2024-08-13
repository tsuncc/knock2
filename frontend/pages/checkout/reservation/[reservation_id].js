import React from 'react'
import IndexLayout from '@/components/layout'
import ReservationSuccessSection from '@/components/page-components/checkout/reservation-success'

export default function ReservationSuccessPage() {
  return (
    <>
      <IndexLayout title="訂單付款完成" background="dark">
        <ReservationSuccessSection />
      </IndexLayout>
    </>
  )
}
