import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/context/auth-context'
import { useLoginModal } from '@/context/login-context'

import IndexLayout from '@/components/layout'
import UserTab from '@/components/UI/user-tab'
import UserLayout from '@/components/layout/user-layout'
import UserSet2fa from '@/components/page-components/user/user-set-2fa'

export default function Profile() {
  const router = useRouter()
  const { auth, authIsReady } = useAuth()
  const { loginFormSwitch } = useLoginModal()

  useEffect(() => {
    if (!router.isReady) return
    if (!auth.id && authIsReady) {
      router.push('/')
      loginFormSwitch('Login')
    }
    // 下面這行 讓eslint略過一行檢查
    // eslint-disable-next-line
  }, [auth.id, authIsReady])
  return (
    <>
      <IndexLayout title="兩步驟驗證" pageName="user" background="light">
        <UserLayout userTab={<UserTab />} sectionRight={<UserSet2fa />} />
      </IndexLayout>
    </>
  )
}
