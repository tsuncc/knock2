import styles from './footer-styles.module.scss'
import { FaFacebook, FaInstagram, FaXTwitter } from 'react-icons/fa6'
import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <>
      <footer className={styles['my-footer']}>
        <div>
          <Image
            src="/home/tree.png"
            alt="footer-tree"
            width={1440}
            height={205}
            priority={false}
          />
          <Image
            src="/home/tree.png"
            alt="footer-tree"
            width={1440}
            height={205}
            priority={false}
          />
        </div>
        <div>
          <ul>
            <li>
              <ul>
                <li>
                  <p>聯絡我們</p>
                </li>
                <li>
                  <span>地址：天堂市地獄路444號4樓</span>
                  <span>電話：04 4444 4444</span>
                  <span>電子郵件：info@knock-knock.com</span>
                </li>
              </ul>
            </li>
            <li className={styles['mobile-hide']}>
              <div />
            </li>
            <li className={styles['mobile-hide']}>
              <Image
                src="/home/ghost-logo.svg"
                alt="ghost-logo"
                width={74}
                height={69}
              />
              <Image src="/home/LOGO.svg" alt="LOGO" width={94} height={42} />
            </li>
            <li className={styles['mobile-hide']}>
              <div />
            </li>
            <li>
              <ul className={styles['mobile-hide']}>
                <li>
                  <p>法律資訊</p>
                </li>
                <li>
                  <Link href="/">
                    <span>隱私政策</span>
                  </Link>
                  <Link href="/">
                    <span>使用條款</span>
                  </Link>
                  <Link href="/">
                    <span>退款政策</span>
                  </Link>
                </li>
              </ul>
              <ul>
                <li>
                  <p>追蹤我們</p>
                  <Link href="/">
                    <FaFacebook />
                  </Link>
                  <Link href="/">
                    <FaInstagram />
                  </Link>
                  <Link href="/">
                    <FaXTwitter />
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </footer>
    </>
  )
}
