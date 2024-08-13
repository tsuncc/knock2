import { useState } from 'react'
// styles
import styles from './nav-styles.module.scss'
// components
import NavbarIcon from './navbar-icon'
import NavbarLinks from './navbar-links'

import AuthModal from '@/components/page-components/user/AuthModal'

export default function Navbar({ pageName }) {
  // context && Ref

  // state
  const [menuState, setMenuState] = useState(`${styles['menu-hide']}`)

  // function
  const handleMobileMenu = () => {
    const newMenu =
      menuState === 'animate__bounceInDown'
        ? 'animate__bounceOutUp'
        : 'animate__bounceInDown'
    setMenuState(newMenu)
  }

  return (
    <>
      <header className={styles['navbar']}>
        <AuthModal />
        <nav>
          <NavbarIcon handleMobileMenu={handleMobileMenu} />
          <NavbarLinks pageName={pageName} menuState={menuState} />
        </nav>
      </header>
    </>
  )
}
