import { Button } from '@mui/material'
// 改顏色
import { ThemeProvider } from '@mui/material/styles'
import { useEffect, useState } from 'react'

import theme from '@/context/theme'
import useScreenSize from '@/hooks/useScreenSize'

export default function PdBtnOutlined({ btnText = '沒設定', onClick }) {
  const userClientWidth = useScreenSize()
  const [size, setSize] = useState(userClientWidth)

  useEffect(() => {
    setSize(userClientWidth)
  }, [userClientWidth])

  const btnPadding = size > 576 ? '10px 19px' : '6px 16px'
  const btnWidth = size > 576 ? '11.25rem' : 'auto'
  const btnFontSize = size > 576 ? '18px' : '14px'


  return (
    <>
      <ThemeProvider theme={theme}>
        <Button
          onClick={onClick}
          variant="outlined"
          color="favRed"
          sx={{
            // color: '#BA0606',
            fontFamily: 'Noto Serif JP',
            borderRadius: '16px',
            // borderColor: '#BA0606',
            marginLeft: '0.625rem',
            fontSize: btnFontSize,
            fontWeight: 700,
            letterSpacing: '2.16px',
            width: btnWidth,
            padding: btnPadding,
            ':hover': {
              // borderColor: 'rgba(186, 6, 6, 0.70)',
            },
          }}
        >
          {btnText}
        </Button>
      </ThemeProvider>
    </>
  )
}
