import IndexLayout from '@/components/layout'
import Loading from '@/components/UI/loading'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Custom404() {
  const router = useRouter()
  useEffect(() => {
    const backToHome = setTimeout(() => {
      router.push('/')
    }, 3000)
    return () => {
      clearTimeout(backToHome)
    }
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <IndexLayout title="迷路了！" background="dark">
        <div className="main">
          <Loading />
          <h1>404 - Page Not Found</h1>
          <h1>你迷路了！3秒後帶你回家</h1>
        </div>
      </IndexLayout>
      <style jsx>
        {`
          .main {
            padding: 3rem 0;
            margin: auto;
            text-align: center;
          }
        `}
      </style>
    </>
  )
}
