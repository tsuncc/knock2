import styles from './redirect-guide.module.css'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/context/auth-context'
import { useLoginModal } from '@/context/login-context'
import BlackBtn from '@/components/UI/black-btn'

export default function RedirectionGuide({
  text = '請先登入',
  btnText = '登入',
  href = null,
  hideBtn = false,
}) {
  const router = useRouter()
  const { auth, authIsReady } = useAuth()
  const { loginFormSwitch } = useLoginModal()
  const openLoginFrom = () => {
    loginFormSwitch('Login')
  }

  // 登入驗證
  useEffect(() => {
    if (router.isReady && authIsReady && !auth.id) {
      loginFormSwitch('Login')
    }
  }, [auth.id, router.isReady, authIsReady])

  return (
    <div className={styles.container}>
      <h6>{text}</h6>
      <img src="/ghost/ghost_06.png" alt="" className={styles.ghostImg} />
      {!hideBtn && (
        <BlackBtn
          btnText={btnText}
          href={href}
          paddingType="medium"
          onClick={openLoginFrom}
        />
      )}
    </div>
  )
}
