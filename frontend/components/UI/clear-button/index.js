import styled from '@emotion/styled'
import { Button as BaseButton } from '@mui/base/Button'

const Button = styled(BaseButton)(
  () => `
  background: none;
  border: none;
  margin: 0;
  padding: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
  border-radius: 0;
  box-shadow: none;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  letter-spacing: 0.125rem;

  &:focus {
    outline: none;
  }
  &:hover,
  &:active {
    outline: none;
  }
`
)
export default function ClearButton({
  btnText = '',
  type = 'button',
  onClick = () => {},
}) {
  return (
    <>
      <Button type={type} onClick={onClick}>
        {btnText}
      </Button>
    </>
  )
}
