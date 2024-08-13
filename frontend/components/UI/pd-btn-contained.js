import { Button } from '@mui/material'
// 改顏色
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/context/theme'
import useScreenSize from '@/hooks/useScreenSize'
import { useEffect, useState } from 'react'

export default function PdBtnContained({
  btnText = '沒設定',
  color = 'grey',
  onClick,
}) {
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
          variant="contained"
          color={color}
          onClick={onClick} // ****** Iris Added
          sx={{
            fontFamily: 'Noto Serif JP',
            borderRadius: '16px',
            marginLeft: '0.625rem',
            fontSize: btnFontSize,
            fontWeight: 700,
            letterSpacing: '2.16px',
            width: btnWidth,
            padding: btnPadding,
          }}
        >
          {btnText}
        </Button>
      </ThemeProvider>
    </>
  )
}
