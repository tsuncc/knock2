import React from 'react'
import { useState, useEffect } from 'react'
import PdTabs from '@/components/page-components/products/details-section/pd-tabs/index'
import PdFeatures from '@/components/page-components/products/details-section/pd-features/index'
import IndexLayout from '@/components/layout'
import { useRouter } from 'next/router'
import DetailsSection from '@/components/page-components/products/details-section'
import Breadcrumb from '@/components/page-components/products/breadcrumb'
import { PRODUCT_DETAILS } from '@/configs/api-path'
import { ProductProvider } from '@/context/product-context'

export default function ProductDetails() {
  const router = useRouter()
  const [productName, setProductName] = useState('')
  const [productData, setProductData] = useState({
    product_name: '',
    price: 0,
    summary: '',
    players: '',
    age: '',
    category_id: 0,
  })

  useEffect(() => {
    fetch(`${PRODUCT_DETAILS}/${router.query.product_id}`)
      .then((r) => r.json())
      .then((dbData) => {
        setProductData(dbData.rows)
      })
  }, [router.isReady])

  useEffect(() => {
    if (productData && productData.length > 0) {
      const newData = { ...productData }
      setProductName(newData[0])
    }
  }, [productData])

  return (
    <>
      <ProductProvider>
        <IndexLayout pageName="productDetails" background="light">
          <DetailsSection
            breadcrumb={<Breadcrumb productName={productName.product_name} />}
            features={<PdFeatures dbData={productData} />}
            tab={<PdTabs data={productData} />}
          />
        </IndexLayout>
      </ProductProvider>
    </>
  )
}
