import { Button } from '@mui/material'

export default function CouponBtn({
  btnText = '按鈕',
  href = null,
  margin = '0',
  marginLeft = '0',
  onClick = () => {},
}) {
  return (
    <Button
      onClick={onClick}
      href={href}
      variant="outlined"
      sx={{
        color: 'black',
        fontFamily: 'Noto Serif JP',
        fontSize: '16px',
        fontWeight: 'normal',
        borderRadius: '0 6px 6px 0',
        margin: margin,
        marginLeft: marginLeft,
        border: '2px solid #d9d9d9',
        lineHeight: 'normal',
        height: '40px',
        ':hover': {
          color: 'white',
          backgroundColor: 'var(--pri-1)',
        },
      }}
    >
      {btnText}
    </Button>
  )
}
