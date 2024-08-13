import Image from 'next/image'
import ReviewStar from '@/components/UI/review-rating'
import { useState, useEffect } from 'react'
import myStyle from './tabs.module.css'
import { PRODUCT_LIST, API_SERVER } from '@/configs/api-path'

export default function ProductReview({ product_id }) {
  const [productId, setProductId] = useState(product_id)
  const [reviewData, setReviewData] = useState([])

  useEffect(() => {
    if (product_id && product_id.length > 0) {
      const newData = { ...product_id[0] }
      setProductId(newData)
      console.log('ProductReview------------')
    }
  }, [product_id])

  const getReview = async (id) => {
    console.log('getReview------------')

    const url = `${PRODUCT_LIST}/review?product_id=${id}`
    try {
      const res = await fetch(url)
      const resData = await res.json()
      if (resData.success) {
        setReviewData(resData.rows)
        console.log('執行完fetch', resData.rows) //返回array
      } else {
        console.log('success=false', resData)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    getReview(productId)
  }, [productId])

  return (
    <>
      {reviewData.length ? (
        reviewData.map((value) => {
          return (
            <div className={myStyle.reviewed} key={value.id}>
              <div className={myStyle.mask}>
                <Image
                  src={`${API_SERVER}/avatar/${value.avatar}`}
                  width={100}
                  height={100}
                  alt="Picture of the author"
                />
              </div>
              {/* 星星 */}
              <div className={`${myStyle.starArea} text-nowrap`}>
                <ReviewStar size={'small'} rate={value.rate} />
              </div>

              <div className={myStyle.customerReview}>

               {/* 星星780出現 */}
               <div className={`${myStyle.star780} text-nowrap`}>
                <ReviewStar size={'small'} rate={value.rate} />
              </div>


                {/* 內容 */}
                <div className={myStyle.content}>
                  {value.review ? value.review : '非常喜歡!'}
                </div>

                {/* 購買人資訊 */}
                {/* "d-flex justify-content-end" */}
                <div className={myStyle.customer}>
                  <div>
                    {/* <p>購買人：</p> */}
                    <p>{value.nick_name[0] + 'OO'}</p>
                  </div>

                  <div>
                    {/* <p>評價日期：</p> */}
                    <p>{value.order_date}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })
      ) : (
        <div className={myStyle.noReview}>尚無評價</div>
      )}
    </>
  )
}
