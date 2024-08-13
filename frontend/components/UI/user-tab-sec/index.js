// 會員資料 第二層選單 components
import styles from './user-tab-sec.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function UserTabSec({ tabItems = [] }) {
  const router = useRouter()

  return (
    <div className={styles.userTabContainer}>
      <ul className={styles.userTabSec}>
        {tabItems.map((v, i) => (
          <li
            key={v.key}
            className={router.asPath.includes(v.path) ? styles.active : ''}
          >
            <Link href={v.path}>
              <span>{v.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
