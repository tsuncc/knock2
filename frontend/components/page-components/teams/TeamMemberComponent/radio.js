import React from 'react'
import { Radio, RadioGroup, FormControlLabel } from '@mui/material'
import { styled } from '@mui/material/styles'

// 自定义 Radio 样式
const CustomRadio = styled(Radio)(({ theme }) => ({
  '&.Mui-checked': {
    // color: theme.palette.common.black,
    backgroundColor: theme.palette.common.black,
    padding: '5px',
    color: '#FFF',
  },
  '&': {
    // color: theme.palette.common.white,
    // backgroundColor: '#B99755',
    borderRadius: '50%',
    padding: '5px',
  },
  '& .MuiSvgIcon-root': {
    fontSize: 40, // 调整圆圈的大小
    color: '#0000',
  },
}))

const CustomFormControlLabel = styled(FormControlLabel)(
  ({ theme, selected }) => ({
    '&.MuiRadioGroup-root': {
      justifyContent: 'center',
    },
    '& .MuiTypography-root': {
      position: 'relative',
      padding: '10px 20px',
      border: '#B99755 1px solid',
      borderRadius: selected === '1' ? '50% 0 0 50%' : '0 50% 50% 0',
    },
    '& .MuiRadio-root.Mui-checked': {
      color: theme.palette.common.white,
      backgroundColor: '#b9975582',
    },
    '& .MuiRadio-root': {
      right: '-55px',
      width: '55px',
      borderRadius: selected === '1' ? '50% 0 0 50%' : '0 50% 50% 0',
      color: theme.palette.common.white,
    },
  })
)

function CustomRadioGroup({ member, handleRadioChange }) {
  return (
    <RadioGroup
      row
      aria-labelledby="radio-buttons-group-label"
      name={`radio-${member.no}`}
      value={member.m_status === 1 ? '1' : '0'}
      onChange={(e) => handleRadioChange(member.no, e.target.value)}
    >
      <CustomFormControlLabel
        value="1"
        control={<CustomRadio />}
        label="Y"
        selected="1"
      />
      <CustomFormControlLabel
        value="0"
        control={<CustomRadio />}
        label="N"
        selected="0"
      />
    </RadioGroup>
  )
}

export default CustomRadioGroup
