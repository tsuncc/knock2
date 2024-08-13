import MyPagination from '../../pagination'
import Card from './card'
import { useProduct } from '@/context/product-context'
import myStyle from './card.module.css'

export default function PdCard() {
  const { data } = useProduct()

  return (
    <>
      <div className="container">
        <div className="row">
          <div className={`${myStyle.grid} col-12 d-grid`}>
            {/* 商品卡片 */}

            {data.rows.map((r) => {
              return <Card key={r.product_id} dbData={r} />
            })}

            {/* 商品區塊end */}
          </div>

          <MyPagination />
        </div>
      </div>
    </>
  )
}
