import Link from 'next/link'
import Image from 'next/image'

import styles from '../nav-styles.module.scss'

export default function NavbarLinks({ pageName, menuState }) {
  return (
    <>
      <ul
        className={`${styles['navbar-links']} animate__animated ${menuState}`}
      >
        <li>
          <Link href="/themes">
            <span className={styles[pageName === 'themes' ? 'page-name' : '']}>
              密室逃脫
            </span>
          </Link>
        </li>
        <li>
          <Link href="/teams">
            <span className={styles[pageName === 'teams' ? 'page-name' : '']}>
              揪團行程
            </span>
          </Link>
        </li>
        <li className="logo">
          <Link href="/">
            <Image
              src="/home/LOGO.svg"
              alt="LOGO"
              width={134.96}
              height={61.26}
              className={styles['logo-screen']}
            />
          </Link>
        </li>
        <li>
          <Link href="/product">
            <span className={styles[pageName === 'product' ? 'page-name' : '']}>
              桌遊商城
            </span>
          </Link>
        </li>
        <li>
          <Link href="/user/profile">
            <span className={styles[pageName === 'user' ? 'page-name' : '']}>
              會員中心
            </span>
          </Link>
        </li>
      </ul>
    </>
  )
}
