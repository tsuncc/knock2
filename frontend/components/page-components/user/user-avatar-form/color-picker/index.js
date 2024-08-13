import { SketchPicker } from 'react-color'
import Popover from '@mui/material/Popover'
import { useState } from 'react'
import FilterBtn from '@/components/UI/filter-btn'

export default function ColorPicker({ color, colorChange }) {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  return (
    <>
      <FilterBtn btnText="背景顏色" href={null} onClick={handleClick}>
        Open Popover
      </FilterBtn>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <SketchPicker color={color} onChange={colorChange} />
      </Popover>
    </>
  )
}
