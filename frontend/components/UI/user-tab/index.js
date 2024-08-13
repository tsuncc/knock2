// components > user-tab
import { useRouter } from 'next/router'
import Link from 'next/link'
import styles from './user-tab.module.css'
import { FaGhost } from 'react-icons/fa'

export default function UserTab() {
  const router = useRouter()
  const isActive = (paths) => {
    return paths.some((path) => router.pathname.startsWith(path))
  }

  const tabItems = [
    {
      key: 'profile',
      name: '會員資料',
      link: '/user/profile',
      paths: ['/user/profile', '/user/reset-password'],
    },
    {
      key: 'reservation',
      name: '行程預約',
      link: '/user/reservation/ongoing',
      paths: ['/user/reservation'],
    },
    {
      key: 'orders',
      name: '商品訂單',
      link: '/user/orders/ongoing',
      paths: ['/user/orders'],
    },
    {
      key: 'favorite',
      name: '我的收藏',
      link: '/user/favorite',
      paths: ['/user/favorite'],
    },
    {
      key: 'coupons',
      name: '優惠券',
      link: '/user/coupon/ongoing',
      paths: ['/user/coupon'],
    },
  ]

  return (
    <ul className={styles.userTab}>
      {tabItems.map((v, i) => (
        <li key={v.key} className={isActive(v.paths) ? styles.active : ''}>
          <Link href={v.link}>
            <FaGhost />
            <span>{v.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
