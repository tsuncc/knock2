import Link from 'next/link'
import Image from 'next/image'

import { useAuth } from '@/context/auth-context'

import { FaCircleUser } from 'react-icons/fa6'
import { TiThMenu } from 'react-icons/ti'
import ClearButton from '@/components/UI/clear-button'
import CheckoutOffcanvas from '@/components/page-components/checkout/checkout-offcanvas'
import styles from '../nav-styles.module.scss'
import { useState } from 'react'
import { useLoginModal } from '@/context/login-context/index'
import AvatarIcon from './avatar-icon'
import Notifications from './notifications'

export default function NavbarIcon({ handleMobileMenu }) {
  const { auth } = useAuth()
  const { loginFormSwitch } = useLoginModal()

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleNavMenuOpen = (event) => {
    event.preventDefault()
    if (open) {
      setAnchorEl(null)
    } else {
      if (!auth.id) {
        loginFormSwitch('Login')
      } else {
        setAnchorEl(event.currentTarget)
      }
    }
  }

  return (
    <>
      <ul className={styles['navbar-icon']}>
        <li>
          <Link href="/">
            <Image
              src="/home/ghost-logo.svg"
              alt="LOGO"
              width={50}
              height={50}
              className={styles['logo-mobile']}
            />
          </Link>
        </li>
        <li style={{ position: 'relative', zIndex: 100 }}>
          <ClearButton
            onClick={handleNavMenuOpen}
            btnText={auth.id ? <AvatarIcon /> : <FaCircleUser />}
          />
          <Notifications
            anchorEl={anchorEl}
            open={open}
            onClose={handleNavMenuOpen}
          />
          <a>
            <CheckoutOffcanvas />
          </a>
          <a>
            <TiThMenu onClick={handleMobileMenu} className={styles['menu']} />
          </a>
        </li>
      </ul>
    </>
  )
}
