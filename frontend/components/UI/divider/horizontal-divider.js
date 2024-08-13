export default function HDivider({
  width = '100%',
  height = '2px',
  backgroundColor = 'var(--pri-3)',
  margin = '0',
}) {
  return (
    <div
      style={{
        width: width,
        height: height,
        backgroundColor: backgroundColor,
        margin: margin,
      }}
    ></div>
  )
}

