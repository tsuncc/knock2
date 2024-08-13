import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import IndexLayout from '@/components/layout'
import UserLayout from '@/components/layout/user-layout'
import UserTab from '@/components/UI/user-tab'
import OrderReviewsSection from '@/components/page-components/orders/order-reviews-page'



export default function OrderReviewsPage() {

  const router = useRouter()
  const {order_id} = router.query
  
  return (
    <>
      <IndexLayout title="訂單評價" pageName="user" background="light">
        <UserLayout
          userTab={<UserTab />}
          sectionRight={<OrderReviewsSection order_id={order_id} />}
        />
      </IndexLayout>
    </>
  )
}
