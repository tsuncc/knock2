import myStyle from './favorite.module.css'
import FavoriteTab from './favorite-tab'
// import { ProductProvider } from '@/context/product-context'

export default function FavoriteSection() {
  return (
    // <ProductProvider>
    <div className={`${myStyle.container} container p-4`}>
      <h5 className={myStyle.title}>我的收藏</h5>

      <FavoriteTab />
    </div>
    // </ProductProvider>
  )
}
