import styles from './empty-cart.module.css'
import BlackBtn from '@/components/UI/black-btn'
import { useRouter } from 'next/router'

export default function EmptyCart() {
  const router = useRouter()
  const onClick = () => {
    router.push('/product')
  }
  return (
    <div className={styles.emptyCartInfoContainer}>
      <h6>購物車尚無商品</h6>
      <BlackBtn
        btnText="前往桌遊商城"
        onClick={onClick}
        href={null}
        paddingType="medium"
      />
    </div>
  )
}
