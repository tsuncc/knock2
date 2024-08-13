import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import styles from './input-stepper.module.css'
import { useEffect, useState } from 'react'
// contexts
import { useConfirmDialog } from '@/context/confirm-dialog-context'
import { useCart } from '@/context/cart-context'
// components
import ConfirmDialog from '../confirm-dialog'
// icons
import { IoIosAdd, IoIosRemove } from 'react-icons/io'

export default function InputStepper({
  minValue = 0,
  maxValue = 10,
  stepperValue = 1,
  onQuantityChange, //通知父層更新
  productName, // 接受父層的資料
  productId,
  couponId,
  minimumOrder,
  price,
}) {
  const [value, setValue] = useState(stepperValue)
  const { openConfirmDialog } = useConfirmDialog()
  const { handleRemoveCouponFromCart } = useCart()

  // 通知 cart-context.js 更新
  useEffect(() => {
    setValue(stepperValue)
  }, [stepperValue])

  const handleIncrease = () => {
    if (+value >= maxValue) {
      return // 如果數字已經大於等於 maxValue，則不可以往上加
    }
    const newStepperValue = +value + 1
    setValue(newStepperValue)
    onQuantityChange(newStepperValue)
  }

  const handleDecrease = () => {
    if (+value <= minValue) {
      return // 如果數字已經小於等於 minValue，則不可以往下減
    }
    if (+value === 1) {
      openConfirmDialog(() => {
        setValue(minValue) // 數量歸 0
        onQuantityChange(minValue) // 通知父層數量歸 0
      })
      return // 如果數字等於 1，要有確認是否要變成 0 (刪除商品)
    }
    const newStepperValue = +value - 1
    setValue(newStepperValue)
    onQuantityChange(newStepperValue)
    if (couponId && newStepperValue * price < minimumOrder) {
      handleRemoveCouponFromCart(couponId, productId)
    }
  }

  // 點擊「確定刪除」後
  // const handleConfirmDelete = () => {
  //   setValue(minValue) // 數量歸 0
  //   onQuantityChange(minValue) // 通知父層數量歸 0
  //   // handleConfirm() // close confirm dialog
  // }

  const StepperButton = styled(IconButton)(({ theme }) => ({
    backgroundColor: 'white',
    width: '1.4rem',
    height: '1.4rem',
    border: '1px solid var(--input-grey)',
    padding: '4px',
    '&:hover': {
      backgroundColor: 'var(--pri-3)',
    },
  }))

  return (
    <div className={styles.stepperInputContainer}>
      <StepperButton onClick={handleDecrease}>
        <IoIosRemove />
      </StepperButton>

      <div className={styles.stepperValue}>{value}</div>

      <StepperButton onClick={handleIncrease}>
        <IoIosAdd />
      </StepperButton>

      <ConfirmDialog
        dialogTitle={`確定要刪除商品「${productName}」嗎？`}
        btnTextRight="確定刪除"
        btnTextLeft="取消"
      />
    </div>
  )
}
