import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'

const TextBtn = styled(Button)(({ type }) => ({
  color:
    type === 'pri'
      ? 'var(--sec-1)'
      : type === 'sec'
      ? 'var(--text-grey)'
      : 'var(--text-dark)',
  fontFamily: '"Noto Serif JP", serif',
  minWidth: '2rem',
  padding: '2px 8px',
  '&:hover': {
    color:
      type === 'pri' ? '#8C764C' : type === 'sec' ? '#868686' : 'var(--sec-1)',
    backgroundColor: 'transparent',
  },
}))

export default function TextButton({
  btnText,
  type = 'def',
  href = '/',
  onClick,
}) {
  return (
    <TextBtn size="medium" type={type} href={href} onClick={onClick}>
      {btnText}
    </TextBtn>
  )
}
