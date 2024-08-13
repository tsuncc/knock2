import styles from './card-header.module.css'
import FilterBtn from '@/components/UI/filter-btn'
import HDivider from '@/components/UI/divider/horizontal-divider'

export default function CardHeader({
  title = '標題',
  btn1Hidden = false,
  btn1Text = '按鈕1',
  btn1Href = null,
  btn1OnClick,
  btn2Hidden = false,
  btn2Text = '按鈕2',
  btn2Href = null,
  btn2OnClick,
  btn3Hidden = false,
  btn3Text = '按鈕3',
  btn3Href = null,
  btn3OnClick,
}) {
  return (
    <div>
      <div className={styles.orderDetailHeader}>
        <div className={styles.headerLeft}>
          <p className={styles.titleStyle}>{title}</p>
        </div>

        <div className={styles.btnStack}>
          {!btn3Hidden && (
            <FilterBtn
              btnText={btn3Text}
              href={btn3Href}
              onClick={btn3OnClick}
            />
          )}

          {!btn2Hidden && (
            <FilterBtn
              btnText={btn2Text}
              href={btn2Href}
              onClick={btn2OnClick}
            />
          )}
          {!btn1Hidden && (
            <FilterBtn
              btnText={btn1Text}
              href={btn1Href}
              onClick={btn1OnClick}
            />
          )}
        </div>
      </div>
      <HDivider margin="1.5rem 0" />
    </div>
  )
}
