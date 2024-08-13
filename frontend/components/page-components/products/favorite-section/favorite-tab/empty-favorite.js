import myStyle from './favorite-tab.module.css'
import BlackBtn from '@/components/UI/black-btn'

export default function EmptyFavorite({
  text = '目前無收藏',
  btnText = '前往商城',
  href = '/product',
  hideBtn = false,
}) {
  return (
    <div className={myStyle.ghostContainer}>
      <h6>{text}</h6>
      <img src="/ghost/ghost_06.png" alt="" className={myStyle.ghostImg} />
      {!hideBtn && (
        <BlackBtn btnText={btnText} href={href} paddingType="medium" />
      )}
    </div>
  )
}
