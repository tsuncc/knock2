import React from 'react'
import IndexLayout from '@/components/layout'
import ECPayCheckout from '@/components/page-components/checkout/ecpay-checkout-page'

export default function OrderDetailsPage() {
  return (
    <>
      <IndexLayout title="付款" background="light">
        <ECPayCheckout />
      </IndexLayout>
    </>
  )
}
