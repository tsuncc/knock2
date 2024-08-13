import { PRODUCT_FAVORITE } from '@/configs/api-path'

// export default function useDragFavorite() {
export const useDragFavorite = () => {
  const changeDragCard = async (section, favorite_id) => {
    const url = `${PRODUCT_FAVORITE}/edit/${favorite_id}/${section}`
    try {
      const res = await fetch(url, {
        method: 'PUT',
      })
      const resData = await res.json()
      if (resData.success) {
        console.log('changeDragCard', resData.success)
        return resData.success
        //   成功
      }
    } catch (e) {
      console.error(e)
    }
  }

  return { changeDragCard }
}
