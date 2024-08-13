import IndexLayout from '@/components/layout'
import ListSection from '@/components/page-components/products/list-section'
import Breadcrumb from '@/components/page-components/products/breadcrumb'
import PdFilter from '@/components/page-components/products/list-section/pd-filter'
import PdCard from '@/components/page-components/products/list-section/pd-card'
import { ProductProvider } from '@/context/product-context'

export default function ProductList() {
  return (
    <>
      <ProductProvider>
        <IndexLayout pageName="product" background="light">
          <ListSection
            top={<Breadcrumb />}
            filter={<PdFilter />}
            card={<PdCard />}
          />
        </IndexLayout>
      </ProductProvider>
    </>
  )
}
