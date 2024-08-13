import { useState } from 'react'
import Slider, { SliderThumb } from '@mui/material/Slider'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { useRouter } from 'next/router'
import { formatPrice } from '@/hooks/numberFormat'


const AirbnbSlider = styled(Slider)(({ theme }) => ({
  color: 'rgba(0, 0, 0, 1)',
  height: 3,
  padding: '13px 0',
  '& .MuiSlider-thumb': {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    '&:hover': {
      boxShadow: '0 0 15px 15px rgba(185, 151, 85, 0.3)',
    },

    '&:after': {
      backgroundImage: 'url("/products/thumb.svg")',
      borderRadius: 0,
      width: 13,
      height: 26,
    },
    '&:before': {
      boxShadow: '0 0 0 0',
    },
    '& .airbnb-bar': {
      height: 9,
      width: 1,
      //   backgroundColor: 'currentColor',
      marginLeft: 1,
      marginRight: 1,
    },
  },
  '& .Mui-focusVisible': {
    boxShadow: '0 0 20px 20px rgba(185, 151, 85, 0.3)',
  },
  '& .MuiSlider-track': {
    height: 2,
  },
  '& .MuiSlider-rail': {
    color: theme.palette.mode === 'rgba(0, 0, 0, 1)',
    opacity: theme.palette.mode === 'dark' ? undefined : 1,
    height: 1,
  },
  '& .MuiSlider-valueLabel': {
    fontSize: 18,
    fontWeight: '600',
    top: 50,
    backgroundColor: 'unset',
    color: theme.palette.text.primary,
    '&::before': {
      display: 'none',
    },
  },
}))

export default function PriceSlider({ price, setPrice }) {
  const router = useRouter()
  // const [price, setPrice] = useState([500, 1500])

  const handlePriceChange = (e) => {
    const newPrice = e.target.value
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          price_start: newPrice[0],
          price_end: newPrice[1],
        },
      },
      undefined,
      { scroll: false }
    )
    setPrice(newPrice)
  }
  const valueLabelFormat = (value) => {
    return `${formatPrice(value)}`
  }

  return (
    <Box sx={{ width: 270, alignItems: 'end', display: 'flex' }}>
      <AirbnbSlider
        max={2000}
        min={0}
        disableSwap={true}
        valueLabelDisplay="on"
        getAriaLabel={(index) =>
          index === 0 ? 'Minimum price' : 'Maximum price'
        }
        defaultValue={[500, 1500]}
        valueLabelFormat={valueLabelFormat}
        value={price}
        onChange={handlePriceChange}
      />
    </Box>
  )
}
