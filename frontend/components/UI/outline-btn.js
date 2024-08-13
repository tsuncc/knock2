import { Button } from '@mui/material'

export default function OutlineBtn({
  btnText = 'button',
  type = 'button',
  href = '',
  onClick = () => {},
  paddingType = '',
}) {
  return (
    <Button
      type={type}
      href={href}
      variant="outlined"
      onClick={onClick}
      sx={{
        color: 'black',
        fontFamily: 'Noto Serif JP',
        borderRadius: '100px',
        letterSpacing: '1.92px',
        fontSize: '16px',
        borderColor: '#222',
        padding: paddingType === 'medium' ? '8px 32px' : '8px 16px',
        ':hover': {
          color: 'white',
          borderColor: '#222',
          background: '#222',
        },
      }}
    >
      {btnText}
    </Button>
  )
}
