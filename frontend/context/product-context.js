import React, { createContext, useContext } from 'react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { PRODUCT_FAVORITE, PRODUCT_LIST } from '@/configs/api-path'
import { useSnackbar } from '@/context/snackbar-context'
import { useAuth } from '@/context/auth-context'

const ProductContext = createContext()

export function useProduct() {
  return useContext(ProductContext)
}

export const ProductProvider = ({ children }) => {
  const router = useRouter()

  const { auth, authIsReady } = useAuth()

  const { openSnackbar } = useSnackbar()

  const [cardChange, setCardChange] = useState(true)

  // 數量在這裡
  const [buyQuantity, setBuyQuantity] = useState(1)

  const [data, setData] = useState({
    success: false,
    page: 0,
    totalRows: 0,
    totalPages: 0,
    rows: [],
  })

  const [favoriteData, setFavoriteData] = useState({
    success: false,
    page: 0,
    totalRows: 0,
    totalPages: 0,
    rows: [],
  })

  // 排序箭頭狀態
  const [showIcon, setShowIcon] = useState(false)
  const [showIconNew, setShowIconNew] = useState(false)
  const [userSearch, setUserSearch] = useState('')

  const getFavorite = async (page, user_id) => {
    page = page || 1
    user_id = user_id || 1

    const url = `${PRODUCT_FAVORITE}?page=${page}&user_id=${user_id}`
    try {
      const res = await fetch(url)
      const resData = await res.json()
      if (resData.success) {
        setFavoriteData(resData)
      } else {
        setFavoriteData({
          success: false,
          page: 0,
          totalRows: 0,
          totalPages: 0,
          rows: [],
        })
        console.log('getFavorite無資料')
        console.log('favoriteData:',favoriteData)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const getProductRows = async (
    page,
    category_id,
    sort,
    order,
    userSearch,
    price_start,
    price_end
  ) => {
    // if (!page) {
    //   router.push({
    //     pathname: router.pathname,
    //     query: { ...router.query, page: 1 },
    //   })
    // }
    page = page || 1
    category_id = category_id || ''
    sort = sort || ''
    order = order || ''
    userSearch = userSearch || ''
    price_start = price_start || ''
    price_end = price_end || ''
    const url = `${PRODUCT_LIST}?page=${page}&category_id=${category_id}&sort=${sort}&order=${order}&userSearch=${userSearch}&price_start=${price_start}&price_end=${price_end}`
    try {
      const res = await fetch(url)
      const resData = await res.json()
      if (resData.success) {
        setData(resData)
      } else {
        openSnackbar('無此商品', 'error')
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    let { page, category_id, sort, order, userSearch, price_start, price_end } =
      router.query

    if (router.isReady) {
      const url = router.asPath.split('?')
      if (url[0] === '/user/favorite') {
        getFavorite(page, auth.id)
      } else if (url[0] === '/product') {
        getProductRows(
          page,
          category_id,
          sort,
          order,
          userSearch,
          price_start,
          price_end
        )
      }
    }
    // window.scrollTo({ top: 0, behavior: 'auto' })
  }, [router.query, cardChange, authIsReady])

  return (
    <ProductContext.Provider
      value={{
        getFavorite,
        getProductRows,
        data,
        router,
        buyQuantity,
        showIcon,
        userSearch,
        cardChange,
        showIconNew,
        favoriteData, setFavoriteData,
        setShowIconNew,
        setCardChange,
        setUserSearch,
        setShowIcon,
        setBuyQuantity,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}
