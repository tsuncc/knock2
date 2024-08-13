import Button from '@mui/material/Button'
import { useRouter } from 'next/router'

export default function OrderProductLink({ btnText = 'button', productId }) {
  const router = useRouter()

  const goToProductPage = () => {
    window.location.href = `/product/product-details/${productId}`
  }
  
  return (
    <Button
      variant="text"
      onClick={() => {
        goToProductPage()
      }}
      sx={{
        margin: '0',
        marginLeft: '-4px',
        padding: '0',
        color: 'var(--pri-1)',
        fontWeight: 'bold',
        fontFamily: 'Noto Serif JP',
        fontSize: '1.125rem',
        '&:hover': {
          backgroundColor: 'transparent',
          color: 'var(--sec-1)',
        },
      }}
    >
      {btnText}
    </Button>
  )
}
