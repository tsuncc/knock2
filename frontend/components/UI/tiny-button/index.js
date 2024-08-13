import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'

const TextBtn = styled(Button)(({ type }) => ({
  color: 'var(--sec-1)',
  fontFamily: '"Noto Serif JP", serif',
  fontSize: '13px',
  minWidth: '2rem',
  padding: '1px 6px',
  border: '1px solid var(--sec-1)',
  '&:hover': {
    color: '#8C764C',
    border: '1px solid #8C764C',
    backgroundColor: '#F8F5F2',
  },
}))

export default function TinyButton({
  btnText,
  type = 'def',
  href = null,
  onClick,
}) {
  return (
    <TextBtn size="medium" type={type} href={href} onClick={onClick}>
      {btnText}
    </TextBtn>
  )
}
