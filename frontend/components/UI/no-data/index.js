import styles from './no-data.module.css'

export default function NoData({
  text = 'no data',
  fontSize = 20 + 'px',
  backgroundColor = 'none',
  borderRadius = 1 + 'rem',
}) {
  return (
    <div
      className={styles.noDataBox}
      style={{
        backgroundColor: backgroundColor,
        borderRadius: borderRadius,
      }}
    >
      <div className={styles.imgTextBox}>
        <img src={`/ghost/ghost_01.png`} alt="" />
        <p style={{ fontSize: fontSize }}>{text}</p>
      </div>
    </div>
  )
}
