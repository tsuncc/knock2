import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { VERIFY_OTP_MAIL_POST } from '@/configs/api-path'
import IndexLayout from '@/components/layout'
import UserLayout from '@/components/layout/user-layout'
import ResetPasswordForm from '@/components/page-components/user/reset-password-form'
import { useAuth } from '@/context/auth-context'
import UserTab from '@/components/UI/user-tab'
import TokenExpired from '@/components/page-components/user/token-expired'

export default function Profile() {
  const router = useRouter()
  const [isVerified, setIsVerified] = useState(false)
  const { auth } = useAuth() // 登入狀態的話就直接改密碼，不驗證ＯＴＰ
  const [user_id, setUser_id] = useState(0)

  useEffect(() => {
    if (!router.isReady) return

    if (!auth.id && !!router.query.t) {
      fetch(VERIFY_OTP_MAIL_POST, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: router.query.t }),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.success) {
            setUser_id(result.user_id)
            setIsVerified(true)
          } else {
            setIsVerified(false)
            console.error(result.error)
          }
        })
    }
    // eslint-disable-next-line
  }, [router.isReady, isVerified, auth.id])

  return (
    <>
      <IndexLayout title="重設密碼" pageName="user" background="light">
        <UserLayout
          userTab={auth.id ? <UserTab /> : ''}
          sectionRight={
            isVerified || auth.id ? (
              <ResetPasswordForm user_id={user_id} />
            ) : (
              <TokenExpired />
            )
          }
        />
      </IndexLayout>
    </>
  )
}
