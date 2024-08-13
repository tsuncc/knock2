import React from 'react'
import IndexLayout from '@/components/layout'
import CheckoutSuccess from '@/components/page-components/checkout/checkout-success'

export default function OrderDetailsPage() {
  return (
    <>
      <IndexLayout title="訂單付款完成" background="light">
        <CheckoutSuccess />
      </IndexLayout>
    </>
  )
}
