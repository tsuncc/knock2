import { Button } from '@mui/material'


export default function CircleBtn({
  btnText = 'button',
  type = 'button',
  href = '/',
  onClick = () => {},

  className,
}) {
  return (
    <Button
      type={type}
      href={href}
      variant="outlined"
      onClick={onClick}
      className={className}
      sx={{
        color: 'white',
        fontFamily: 'Noto Serif JP',
        borderRadius: '300px',
        borderColor: '#222',
        background: '#222',
        fontSize: '24px',
        padding:'10px',
        ':hover': {
          color: 'black',
          borderColor: '#222',
        },
      }}
    >
      {btnText}
    </Button>
  )
}
