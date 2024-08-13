import React from 'react'
import { Button } from '@mui/material'

export default function BuyBtn({ btnText = '直接購買', product_id }) {
  return (
    <>
      <Button
        href={`product-details/${product_id}`}
        sx={{
          fontFamily: 'Noto Serif JP',
          color: 'black',
          width: '100%',
          '&:hover': {
            color: 'gray',
          },
        }}
      >
        {btnText}
      </Button>
    </>
  )
}
