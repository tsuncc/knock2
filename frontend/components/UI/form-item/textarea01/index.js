import React from 'react'
import Textarea from '@mui/joy/Textarea'

export default function Textarea01({ value, onChange }) {
  return (
    <Textarea
      placeholder="備註(如有12以下孩童、孕婦、行動不便者請在此告知)"
      minRows={5}
      value={value} // 绑定 value
      onChange={onChange} // 绑定 onChange
      sx={{
        color: '#B99755', // 設置文字顏色為金色
        border: '2px solid #B99755',
        background: '#222222',
        fontFamily: 'Noto Serif JP',
        borderRadius: '10px',
        '&:focus-within': {
          borderColor: '#B99755',
          backgroundColor: 'white',
          color: '#222222',
        },
        '&:focus-within::before': {
          boxShadow: '0 0 0 0.25rem #B99755',
        },
      }}
    />
  )
}
