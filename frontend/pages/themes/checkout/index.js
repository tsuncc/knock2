import React from 'react'
import IndexLayout from '@/components/layout'
import CheckoutPage2 from '@/components/page-components/checkout/checkout-page2/index'

export default function OrderDetailsPage() {
  return (
    <IndexLayout title="結帳" background="light">
      <CheckoutPage2 />
    </IndexLayout>
  )
}
