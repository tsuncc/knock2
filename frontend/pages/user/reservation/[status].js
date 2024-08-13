import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import IndexLayout from '@/components/layout'
import UserLayout from '@/components/layout/user-layout'
import UserTab from '@/components/UI/user-tab'
import UserTabSec from '@/components/UI/user-tab-sec'
import ReservationPage from '@/components/page-components/reservation/reservation-page'

export default function ReservationSection() {
  const router = useRouter()
  const { status } = router.query // 取得動態路由參數

  const tabItems = [
    { key: 'ongoing', name: '進行中', path: '/user/reservation/ongoing' },
    { key: 'complete', name: '已完成', path: '/user/reservation/complete' },
    { key: 'canceled', name: '已取消', path: '/user/reservation/canceled' },
  ]

  useEffect(() => {
    if (!status) {
      router.push('/user/reservation/ongoing') // 如果沒有狀態，默認跳轉到 ongoing
    }
  }, [status])

  return (
    <>
      <IndexLayout title="商品訂單" pageName="user" background="light">
        <UserLayout
          userTab={<UserTab />}
          userTabSec={<UserTabSec tabItems={tabItems} />}
          sectionRight={<ReservationPage status={status} />}
        />
      </IndexLayout>
    </>
  )
}
