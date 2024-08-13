import React from 'react'
import IndexLayout from '@/components/layout'
import CheckoutPage from '@/components/page-components/checkout/checkout-page'
import { AddressProvider } from '@/context/address-context'

export default function OrderDetailsPage() {
  return (
    <IndexLayout title="結帳" background="light">
      <AddressProvider>
        <CheckoutPage />
      </AddressProvider>
    </IndexLayout>
  )
}
