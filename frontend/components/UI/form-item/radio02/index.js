import { Box, Radio, RadioGroup, FormControlLabel } from '@mui/material'
import { useEffect, useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import customTheme from './theme'

export default function Radio02({
  radios = [],
  name = '',
  value = '',
  disabled = false,
  onChange = () => {},
}) {
  const [radiosArray, setRadiosArray] = useState(false)

  useEffect(() => {
    if (!Array.isArray(radios)) {
      console.error('提供的radios不是陣列，請確認 >>', radios)
      return
    }
    setRadiosArray(true)
  }, [radios])

  return (
    <>
      {radiosArray ? (
        <ThemeProvider theme={customTheme}>
          <Box height={40} display="flex" alignItems="center">
            <RadioGroup row name={name} value={value} onChange={onChange}>
              {radios.map((v, i) => (
                <FormControlLabel
                  key={i}
                  value={v.value}
                  control={<Radio />}
                  label={v.label}
                  disabled={disabled}
                />
              ))}
            </RadioGroup>
          </Box>
        </ThemeProvider>
      ) : null}
    </>
  )
}
