import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/context/auth-context'

import IndexLayout from '@/components/layout'
import UserTab from '@/components/UI/user-tab'
import UserLayout from '@/components/layout/user-layout'
import UserProfileForm from '@/components/page-components/user/user-profile-form'
import { useLoginModal } from '@/context/login-context'

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

  if (!auth.id) return null

  return (
    <>
      <IndexLayout title="會員中心" pageName="user" background="light">
        <UserLayout userTab={<UserTab />} sectionRight={<UserProfileForm />} />
      </IndexLayout>
    </>
  )
}
