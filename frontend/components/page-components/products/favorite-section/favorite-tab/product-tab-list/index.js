import myStyle from './list.module.css'
import FavCardLarge from './fav-card-large'
import useScreenSize from '@/hooks/useScreenSize'
import FavCard from '../product-tab-drag/fav-card'
import { useEffect, useState } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import EmptyFavorite from '../empty-favorite'

export default function ProductTabList({ favData }) {
  let favDataRows = favData['rows'] || []
  const userClientWidth = useScreenSize()
  const [size, setSize] = useState(userClientWidth)

  useEffect(() => {
    setSize(userClientWidth)
  }, [userClientWidth])

  useEffect(() => {
    AOS.init()
  }, [])

// 無收藏顯示頁面
  if (favDataRows.length === 0) {
    return <EmptyFavorite />
  }

  return (
    <div data-aos="fade-up" className={myStyle['grid']}>
      {size > 1000
        ? favDataRows.map((r) => {
            return <FavCardLarge key={r.favorite_id} dbData={r} />
          })
        : favDataRows.map((r) => {
            return <FavCard key={r.favorite_id} dbData={r} />
          })}
    </div>
  )
}
