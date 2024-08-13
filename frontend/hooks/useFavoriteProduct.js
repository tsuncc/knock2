import { useState, useEffect } from 'react'
import { PRODUCT_FAVORITE } from '@/configs/api-path'
import { useSnackbar } from '@/context/snackbar-context'
import 'hover.css/css/hover-min.css'
import { useAuth } from '@/context/auth-context'

export const useFavoriteProduct = (product_id) => {
  const { auth, authIsReady } = useAuth()
  const { openSnackbar } = useSnackbar()

  const [animate, setAnimate] = useState(false)

  const [data, setData] = useState([])
  const [likeMe, setLikeMe] = useState(false)

  const dataChange = (id) => {
    let newData = [...data]
    if (!data.includes(id)) {
      newData.push(id)
    } else if (data.includes(id)) {
      newData = newData.filter((v) => v !== id)
    } else {
      console.log('dataChange出錯了')
    }

    setData(newData)
  }

  const getFavoriteArray = async (user_id) => {
    user_id = user_id || 1

    const url = `${PRODUCT_FAVORITE}/api?user_id=${user_id}`
    let newData = []
    try {
      const res = await fetch(url)
      const resData = await res.json()
      if (resData.success) {
        resData.rows.map((v) => {
          newData.push(v.fav_product_id)
        })
        // 連結此商品有無在table state
        setLikeMe(newData.includes(product_id))
        // 取得使用者所有[fav_product_id]
        setData(newData)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    getFavoriteArray(auth.id)
  }, [product_id, authIsReady])

  const toggleButton = async (e) => {
    if (!likeMe) {
      try {
        const r = await fetch(
          `${PRODUCT_FAVORITE}/add/${product_id}?user_id=${auth.id}`,
          {
            method: 'POST',
          }
        )
        dataChange(product_id) //改顯示狀態
        openSnackbar('成功加入收藏')
      } catch (ex) {
        console.log(ex)
      }
    } else {
      try {
        const r = await fetch(
          `${PRODUCT_FAVORITE}/delete/${product_id}?user_id=${auth.id}`,
          {
            method: 'DELETE',
          }
        )
        dataChange(product_id) //改顯示狀態
        openSnackbar('已取消收藏', 'error')
        setAnimate(true)
        setTimeout(() => {
          setAnimate(false)
        }, 2000)
      } catch (ex) {
        console.log('DELETE', ex)
      }
    }

    setLikeMe(!likeMe)
  }
  return { toggleButton, animate, data }
}
