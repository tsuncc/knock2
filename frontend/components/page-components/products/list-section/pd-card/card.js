import Link from 'next/link'
import { useEffect, useState } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Image from 'next/image'
import { PRODUCT_IMG } from '@/configs/api-path'
import 'hover.css/css/hover-min.css'
import myStyle from './card.module.css'
import FavoriteIconBtn from './favorite-icon-btn'
import { useProductImg } from '@/hooks/useProductImg'
import { formatIntlNumber } from '@/hooks/numberFormat'
import BuyBtn2 from './buy-btn2' // ******* Iris added *******
import { useCart } from '@/context/cart-context' // ******* Iris added *******

export default function Card({ dbData }) {
  // ******* Iris Added Start *******
  // getDeviceId()
  // const { handleBuyClick } = useAddToCart(dbData, loginMemberId)
  const { handleAddToCart } = useCart()
  // const { handleLogin } = useLogin() // 暫時用不到
  // ******* Iris Added Start End *******

  const [isId, setIsId] = useState(0)
  // const [isData, setIsData] = useState([])

  const { data } = useProductImg(isId)
  useEffect(() => {
    setIsId(dbData.product_id)
  }, [dbData])

  useEffect(() => {
    AOS.init()
  }, [])

  return (
    <>
      <div
        data-aos="fade-up"
        className={`${myStyle.card} card`}
        // className={`${myStyle.card} card hvr-grow-shadow`}
      >
        <Link
          href={`product/product-details/${dbData.product_id}`}
          style={{ textDecoration: 'none' }}
        >
          {data && (
            <Image
              src={`${PRODUCT_IMG}/${data[0]}.jpg`}
              width={318}
              height={200}
              className="card-img-top"
              alt="..."
            />
          )}
        </Link>
        {/* 收藏按鈕 */}
        <FavoriteIconBtn product_id={dbData.product_id} />

        <div className={myStyle.tag}>{dbData.category_name}</div>

        <div className="card-body text-center d-flex flex-column">
          <h5 className="card-title">{dbData.product_name}</h5>

          <div
            className={`${myStyle['card-btn-outer']} d-flex justify-content-center my-3`}
          >
            <div className={`${myStyle['card-btn']} d-flex`}>
              <div className={`${myStyle['buy-btn-outer']} w-100 py-1`}>
                <div className={`${myStyle['buy-btn']}`}>
                  ${formatIntlNumber(dbData.price)}
                </div>
              </div>
              <div className={`${myStyle['buy-btn-outer']} w-100`}>
                {/* ******* Iris Added Start ******* */}
                <BuyBtn2
                  onClick={() =>
                    handleAddToCart(
                      dbData.product_id,
                      dbData.product_name,
                      1,
                      'add'
                    )
                  }
                />
                {/* ******* Iris Added End ******* */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
