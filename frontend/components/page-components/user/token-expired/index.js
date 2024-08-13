import EmptyFavorite from '@/components/page-components/products/favorite-section/favorite-tab/empty-favorite'
import styles from './token-expired.module.scss'
import BlackBtn from '@/components/UI/black-btn'
import { useLoginModal } from '@/context/login-context'

export default function TokenExpired() {
  const { loginFormSwitch } = useLoginModal()
  return (
    <>
      <section className={styles['card']}>
        <div className={styles['box']}>
          <EmptyFavorite
            text="驗證連結無效或已經過期，請再重新申請忘記密碼。"
            hideBtn={true}
          />
        </div>
        <div className={styles['box']}>
          <BlackBtn
            btnText="重新申請"
            href={null}
            paddingType="medium"
            onClick={() => loginFormSwitch('ForgotPassword')}
          />
        </div>
      </section>
    </>
  )
}
