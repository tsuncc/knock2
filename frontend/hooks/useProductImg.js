import { useState, useEffect } from 'react'
import { PRODUCT_BACKEND_IMG } from '@/configs/api-path'
import 'hover.css/css/hover-min.css'

export const useProductImg = (product_id) => {
  const [data, setData] = useState([])
  // 取得商品join img 內容

  const getImgArray = async (myId) => {
    const url = `${PRODUCT_BACKEND_IMG}/${myId}`

    let newData = []
    try {
      const res = await fetch(url)
      const resData = await res.json()
      if (resData.success) {
        resData.rows.map((v) => {
          newData.push(v.product_img)
        })
        setData(newData)

      }
    } catch (e) {
      console.error(e)
    }
  }
  useEffect(() => {
    if (product_id) {
      getImgArray(product_id)
    }
  }, [product_id])

  return { data }
}
