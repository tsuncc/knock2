import Image from 'next/image'
import { useEffect, useState } from 'react'
import { FaXmark, FaCartShopping } from 'react-icons/fa6'
import { useProduct } from '@/context/product-context'
import myStyle from './drag.module.css'
import DeleteIconBtn from '../product-tab-list/delete-icon-btn'
import { useProductImg } from '@/hooks/useProductImg'
import { PRODUCT_IMG } from '@/configs/api-path'
import { formatIntlNumber } from '@/hooks/numberFormat'


export default function FavCard({ dbData, onDragEnd, onDragStart }) {
  const { cardChange, setCardChange } = useProduct()
  const [isId, setIsId] = useState(0)

  const { data } = useProductImg(isId)
  useEffect(() => {
    setIsId(dbData.product_id)
  }, [dbData])

  return (
    <>
      <div
        onDragEnd={onDragEnd}
        onDragStart={onDragStart}
        draggable="true"
        id={dbData.favorite_id}
        className="pd-card d-flex position-relative mb-2"
      >
        <div className="img-div position-relative">
          {data && (
            <Image
              src={`${PRODUCT_IMG}/${data[0]}.jpg`}
              width={81}
              height={112}
              draggable="false"
              className={myStyle.imgStyle}
              alt="..."
            />
          )}
          <div className={myStyle.xStyle}>
            <DeleteIconBtn
              cardChange={cardChange}
              setCardChange={setCardChange}
              product_id={dbData.product_id}
            />
          </div>
          {/* <FaXmark /> */}
        </div>
        <div className="p-2">
          <p>{dbData.product_name}</p>
          <p>${formatIntlNumber(dbData.price)}</p>
        </div>
        <FaCartShopping className={myStyle.cartStyle} />
      </div>
      <style jsx>
        {`
          .pd-card {
            width: 277px;
            height: 113px;
            background-color: white;
            border-radius: 12px;
          }
          .pd-card:hover {
            transform: rotate(8deg) scale(1.1);
            box-shadow: 5px 4px 3px rgba(0, 0, 0, 0.2);
            cursor: grab;
          }
          .img-div {
            width: 82px;
          }
        `}
      </style>
    </>
  )
}
