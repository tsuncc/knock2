export default function VDivider({
  width = '2px',
  backgroundColor = 'var(--pri-3)',
  margin = '0',
  alignSelf = 'stretch',
}) {
  return (
    <div
      style={{
        width: width,
        backgroundColor: backgroundColor,
        margin: margin,
        alignSelf: alignSelf,
      }}
    ></div>
  )
}
