import ReviewStar from '@/components/UI/review-rating'
import PdSlick from '../pd-slick'
import NumInput from './num-input'
import BtnGroup from './btn-group'
import CategoryGroup from './category-group'
import myStyle from './features.module.css'
import { useEffect, useState } from 'react'
import ShareBtn from './share-btn'

export default function PdFeatures({ dbData }) {
  const [productData, setProductData] = useState({
    product_id: '',
    product_name: '',
    price: 0,
    summary: '',
    players: '',
    age: '',
    category_id: 0,
  })

  useEffect(() => {
    if (dbData && dbData.length > 0) {
      const newData = { ...dbData[0] }
      setProductData(newData)
    }
  }, [dbData])
  return (
    <>
      {/* 商品詳情 */}
      <div className={`${myStyle['container']} container`}>
        <div className={`${myStyle['pd-features']} row`}>
          {/*詳情左側-商品圖 */}
          <div
            className={`${myStyle['slick']} col-lg-5 px-0 position-relative`}
          >
            <PdSlick product_id={productData.product_id} />
          </div>

          {/* 詳情右側 */}
          <div
            className={`${myStyle['features-right']} col-lg-6 offset-lg-1 col-sm-12 d-flex flex-column justify-content-between `}
          >
            <div className="d-flex justify-content-between align-items-center">
              <h1 className={myStyle.title}>{productData.product_name}</h1>

              <div className={myStyle.shareStar}>
                <div className={myStyle.none390}>
                  {/* 分享icon */}
                  <ShareBtn />
                </div>

                {/* 還沒接評價資料 */}

                <ReviewStar />
              </div>
            </div>

            <CategoryGroup productData={productData} />

            <div className={myStyle.content}>{productData.summary}</div>

            <div className={myStyle.price}>
              <div className={myStyle.priceText}>${productData.price}</div>

              {/* RWD992以下顯示 */}
              <div className={myStyle['media-992']}>
                <div className={myStyle.content}>數量:</div>
                <NumInput />
              </div>
              {/* RWD992以下顯示end */}
            </div>

            <div className={myStyle.quantity}>
              <div className={myStyle.content}>數量:</div>
              <NumInput />
            </div>

            <div className={myStyle['media-390']}>
              {/* 分享icon */}
              <ShareBtn />
            </div>

            {/* 按鈕 */}
            <div className={myStyle['btn-area']}>
              <BtnGroup
                product_id={productData.product_id}
                product_name={productData.product_name}
              />
            </div>
          </div>
        </div>
      </div>

      {/* RWD1200以下顯示 */}
      <div className={myStyle['media-1200']}>
        <BtnGroup product_id={productData.product_id} />
      </div>
      {/* RWD1200以下顯示end */}
    </>
  )
}
