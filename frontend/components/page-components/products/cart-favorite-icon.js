import myStyle from './list-section/pd-card/favorite-icon-btn/favorite-icon.module.css'
import 'hover.css/css/hover-min.css'
import IconButton from '@mui/material/IconButton'
import { IoHeartOutline } from 'react-icons/io5'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { useFavoriteProduct } from '@/hooks/useFavoriteProduct'

export default function CartFavoriteIcon({ product_id }) {
  const { toggleButton, animate, data } = useFavoriteProduct(product_id)
  return (
    <>
      <IconButton
        onClick={toggleButton}
        aria-label="favorite"
        size="large"
        // sx={btnStyle}
        className={animate ? myStyle.addToFavoriteIcon : ''}
        // className={animate ? myStyle.likeBefore : ''}
      >
        {data.includes(product_id) ? (
          <FavoriteIcon
            // className={myStyle.addToFavoriteIcon}
            style={{ fill: 'rgba(164, 49, 49, 1)' }}
          />
        ) : (
          <IoHeartOutline className={myStyle.addToFavoriteIcon} />
        )}
      </IconButton>
    </>
  )
}
