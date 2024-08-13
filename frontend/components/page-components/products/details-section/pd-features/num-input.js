import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import { useProduct } from '@/context/product-context'
import myStyle from './features.module.css'

export default function NumInput() {
  // buyQuantity的state我放在context，再傳進來
  const { buyQuantity, setBuyQuantity } = useProduct()

  const handleQuantity = (e) => {
    setBuyQuantity(e.target.value)
  }
  const handleAdd = () => {
    setBuyQuantity(buyQuantity + 1)
  }
  const handleMinus = () => {
    setBuyQuantity(buyQuantity - 1)
  }
  return (
    <>
      <div className={myStyle['input-border']}>
        <button className={myStyle['iconBtn']} onClick={handleMinus}>
          <RemoveIcon />
        </button>

        <div className={myStyle['iconBtn']}>
          <input
            className={myStyle['input']}
            type="number"
            value={buyQuantity}
            onChange={handleQuantity}
          />
        </div>

        <button className={myStyle['iconBtn']} onClick={handleAdd}>
          <AddIcon />
        </button>
      </div>
    </>
  )
}
