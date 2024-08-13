import { Button } from '@mui/material'

export default function RedBtn({
  btnText = 'button',
  type = 'button',
  href = '/',
  onClick = () => {},
  paddingType = '',
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
        borderRadius: '100px',
        borderColor: 'var(--danger)',
        background: 'var(--danger)',
        fontSize: '16px',
        padding:
          paddingType === 'medium' ? '8px 32px' : '8px 16px',
        ':hover': {
          color: 'var(--danger)',
          borderColor: 'var(--danger)',
        },
      }}
    >
      {btnText}
    </Button>
  )
}
