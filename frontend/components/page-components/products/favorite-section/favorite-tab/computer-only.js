import myStyle from './favorite-tab.module.css'
import BlackBtn from '@/components/UI/black-btn'

export default function ComponentOnly({
  text = '此功能僅限電腦版使用喔!',
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
