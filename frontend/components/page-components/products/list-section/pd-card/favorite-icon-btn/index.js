import myStyle from './favorite-icon.module.css'
import 'hover.css/css/hover-min.css'
import IconButton from '@mui/material/IconButton'
import FavoriteIcon from '@mui/icons-material/Favorite'
import Image from 'next/image'
import { useFavoriteProduct } from '@/hooks/useFavoriteProduct'

export default function FavoriteIconBtn({ product_id }) {
  const { toggleButton, animate, data } = useFavoriteProduct(product_id)
  const btnStyle = {
    position: 'absolute',
    top: '6px',
    right: '6px',
  }
  return (
    <>
      <IconButton
        onClick={toggleButton}
        aria-label="favorite"
        size="large"
        sx={btnStyle}
        className={animate ? myStyle.likeBefore : ''}
      >
        {data.includes(product_id) ? (
          <Image
            className={`${myStyle.likeStyle} hvr-buzz-out`}
            src="/ghost/ghost_10.png"
            width={103}
            height={88}
            alt="Picture"
          />
        ) : (
          <FavoriteIcon style={{ fill: '#fff' }} />
        )}
      </IconButton>
    </>
  )
}
