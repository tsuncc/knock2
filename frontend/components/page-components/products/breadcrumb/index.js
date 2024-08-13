import { useState, useEffect } from 'react'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import NextLink from 'next/link'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import myStyle from './bread.module.css'
import { useRouter } from 'next/router'

export default function Breadcrumb({ productName = '商品名稱' }) {
  const router = useRouter()
  const [name, setName] = useState('')

  useEffect(() => {
    if (productName) {
      setName(productName)
    }
  }, [productName])

  let breadcrumbs = [
    <Link
      className={myStyle.font}
      underline="hover"
      key="1"
      color="#000"
      component={NextLink}
      href="/"
    >
      首頁
    </Link>,
    <Link
      className={myStyle.font}
      underline="hover"
      key="2"
      color="#000"
      component={NextLink}
      href="/product"
    >
      商品列表
    </Link>,
    <Link className={myStyle.font} underline="none" key="3" color="#000">
      {name}
    </Link>,
  ]

  if (router.asPath.split('/').length < 4) {
    breadcrumbs.pop()
  }

  return (
    <>
      {/* material方式 */}

      <Breadcrumbs
        className={myStyle.bread}
        separator={
          <NavigateNextIcon htmlColor="rgba(91, 91, 91, 1)" fontSize="small" />
        }
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>
    </>
  )
}
