import { useState, useEffect } from 'react'
import ProductTag from './product-tag'

export default function CategoryGroup({ productData }) {
  const [data, setData] = useState({})

  useEffect(() => {
    setData(productData)
  }, [productData])

  return (
    <>
      <div className="d-flex">
        <ProductTag tag={data.category_name} />
        <ProductTag tag={data.duration + '分鐘'} />
        <ProductTag tag={data.age} />
        <ProductTag tag={data.players} />
      </div>
    </>
  )
}
