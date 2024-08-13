import 'animate.css'
import IndexLayout from '@/components/layout'
import UserLayout from '@/components/layout/user-layout'
import UserTab from '@/components/UI/user-tab'
import FavoriteSection from '@/components/page-components/products/favorite-section/index'
import { ProductProvider } from '@/context/product-context'

export default function Favorite() {
  return (
    <>
      <ProductProvider>
        <IndexLayout title="我的收藏" pageName="user" background="light">
          <UserLayout
            userTab={<UserTab />}
            sectionRight={<FavoriteSection />}
          />
        </IndexLayout>
      </ProductProvider>
    </>
  )
}
