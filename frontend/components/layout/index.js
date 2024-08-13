import { useState, useEffect } from 'react'
import Head from 'next/head'
import Navbar from './Index-layout-item/navbar/index'
import Footer from './Index-layout-item/footer/index'
import TopBtn from './Index-layout-item/top-btn'
import Router from 'next/router'
import LoadingSpinner from '@/components/UI/loading-spinner'

export default function IndexLayout({
  children = '',
  title = '',
  pageName = '',
  background = '',
}) {
  const siteTitle = '悄瞧'

  const [pageLoading, setPageLoading] = useState() // 控制網頁 loading
  const [loadingVisible, setLoadingVisible] = useState(false)
  // 控制網頁 loading
  useEffect(() => {
    let timer

    const handleStart = () => {
      timer = setTimeout(() => setLoadingVisible(true), 1200) // Delay loading spinner by 3 seconds
      setPageLoading(true)
    }

    const handleComplete = () => {
      clearTimeout(timer)
      setLoadingVisible(false)
      setPageLoading(false)
    }

    Router.events.on('routeChangeStart', handleStart)
    Router.events.on('routeChangeComplete', handleComplete)
    Router.events.on('routeChangeError', handleComplete)

    return () => {
      Router.events.off('routeChangeStart', handleStart)
      Router.events.off('routeChangeComplete', handleComplete)
      Router.events.off('routeChangeError', handleComplete)
    }
  }, [])


  return (
    <>
      <section className={`layout ${background}`}>
        <Head>
          <title>{`${title ? `${title} | ` : ''}${siteTitle}`}</title>
        </Head>
        {pageLoading && loadingVisible && <LoadingSpinner />}
        <Navbar pageName={pageName} />
        <main className="main">{children}</main>
        <TopBtn />
        <Footer />
      </section>
      <style jsx>
        {`
          .layout {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            background-color: #ffffff;
          }
          .light {
            background: url('/bg-light.png') no-repeat;
            background-attachment: fixed;
            background-size: cover;
          }
          .dark {
            background: url('/bg-dark.png') no-repeat;
            background-attachment: fixed;
            background-size: cover;
          }

          .main {
            flex: 1;
          }
        `}
      </style>
    </>
  )
}
