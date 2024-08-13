import React from 'react'
import { useRouter } from 'next/router'
import IndexLayout from '@/components/layout'
import UserLayout from '@/components/layout/user-layout'
import UserTab from '@/components/UI/user-tab'
import InvoicePaper from '@/components/page-components/invoice-paper'

export default function InvoicePage() {
  const router = useRouter()
  const { order_id } = router.query

  return (
    <>
      <IndexLayout title="訂單發票" pageName="user" background="light">
        <UserLayout
          userTab={null}
          sectionRight={<InvoicePaper order_id={order_id} />}
        />
      </IndexLayout>
    </>
  )
}
