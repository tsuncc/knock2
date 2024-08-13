import Box from '@mui/material/Box'
import Rating from '@mui/material/Rating'
import StarIcon from '@mui/icons-material/Star'
import { useState } from 'react'
import 'animate.css/animate.css'

export default function ReviewRating({ productRating = 4 ,size ='large'}) {
  const value = productRating || 0

  return (
    <>
      <Rating
      className='animate__animated animate__bounce'
        // className="animate__animated animate__shakeY animate__repeat-3"
        name="size-large"
        size={size}
        value={value}
        readOnly
        precision={1}
        emptyIcon={<StarIcon style={{ opacity: 1 }} fontSize="inherit" />}
      />
    </>
  )
}
