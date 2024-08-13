import { Button } from '@mui/material'

export default function FilterBtn({
  btnText = '沒設名字',
  href = '',
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
        borderRadius: '100px',
        margin: margin,
        marginLeft: marginLeft,
        borderColor: '#222',
        lineHeight: 'normal',
        ':hover': {
          borderColor: '#222',
        },
      }}
    >
      {btnText}
    </Button>
  )
}
