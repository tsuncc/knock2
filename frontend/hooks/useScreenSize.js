import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const useScreenSize = () => {
  const router = useRouter()

  const [userClientWidth, setUserClientWidth] = useState(0)

  useEffect(() => {
    setUserClientWidth(document.body.clientWidth)

    const handleResize = () => {
      // setWindowWidth(window.innerWidth)
      setUserClientWidth(document.body.clientWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [router.isReady])

  return userClientWidth
}

export default useScreenSize
