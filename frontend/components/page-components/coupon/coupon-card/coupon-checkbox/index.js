import { styled } from '@mui/system'
import Checkbox from '@mui/material/Checkbox'
import { RiCheckboxBlankCircleLine, RiCheckboxCircleFill } from 'react-icons/ri'

const CustomCheckbox = styled(Checkbox)(({ theme, disabled=false }) => ({
  color: 'white',
  cursor: disabled ? 'default' : 'pointer', // 根據 disabled 狀態設置 cursor
  pointerEvents: disabled ? 'none' : 'auto', // 控制是否可點擊
  opacity: disabled ? 0.5 : 1, // 控制透明度
  '&:hover svg': {
    color: disabled ? '#757575' : 'var(--sec-1)', // 如果 disabled，hover 不改變顏色
  },
  svg: {
    color: disabled ? '#757575' : '#c7b081', // 根據 disabled 狀態設置顏色
    width: 24,
    height: 24,
  },
}))

export default function CouponCheckbox({ checked, onChange, disabled }) {
  return (
    <CustomCheckbox
      icon={<RiCheckboxBlankCircleLine />}
      checkedIcon={<RiCheckboxCircleFill />}
      checked={checked}
      onChange={onChange}
      disabled={disabled} // 傳遞 disabled 屬性
    />
  )
}
