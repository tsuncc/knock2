import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { Input as BaseInput } from '@mui/base/Input'
import { Box, styled } from '@mui/system'

function OTP({ separator, length, value, onChange, color }) {
  const inputRefs = useRef(new Array(length).fill(null))

  const focusInput = (targetIndex) => {
    const targetInput = inputRefs.current[targetIndex]
    targetInput.focus()
  }

  const selectInput = (targetIndex) => {
    const targetInput = inputRefs.current[targetIndex]
    targetInput.select()
  }

  const handleKeyDown = (event, currentIndex) => {
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case ' ':
        event.preventDefault()
        break
      case 'ArrowLeft':
        event.preventDefault()
        if (currentIndex > 0) {
          focusInput(currentIndex - 1)
          selectInput(currentIndex - 1)
        }
        break
      case 'ArrowRight':
        event.preventDefault()
        if (currentIndex < length - 1) {
          focusInput(currentIndex + 1)
          selectInput(currentIndex + 1)
        }
        break
      case 'Delete':
        event.preventDefault()
        onChange((prevOtp) => {
          const otp =
            prevOtp.slice(0, currentIndex) + prevOtp.slice(currentIndex + 1)
          return otp
        })

        break
      case 'Backspace':
        event.preventDefault()
        if (currentIndex > 0) {
          focusInput(currentIndex - 1)
          selectInput(currentIndex - 1)
        }

        onChange((prevOtp) => {
          const otp =
            prevOtp.slice(0, currentIndex) + prevOtp.slice(currentIndex + 1)
          return otp
        })
        break

      default:
        break
    }
  }

  const handleChange = (event, currentIndex) => {
    const currentValue = event.target.value
    let indexToEnter = 0

    while (indexToEnter <= currentIndex) {
      if (
        inputRefs.current[indexToEnter].value &&
        indexToEnter < currentIndex
      ) {
        indexToEnter += 1
      } else {
        break
      }
    }
    onChange((prev) => {
      const otpArray = prev.split('')
      const lastValue = currentValue[currentValue.length - 1]
      otpArray[indexToEnter] = lastValue
      return otpArray.join('')
    })
    if (currentValue !== '') {
      if (currentIndex < length - 1) {
        focusInput(currentIndex + 1)
      }
    }
  }

  const handleClick = (event, currentIndex) => {
    selectInput(currentIndex)
  }

  const handlePaste = (event, currentIndex) => {
    event.preventDefault()
    const clipboardData = event.clipboardData

    // Check if there is text data in the clipboard
    if (clipboardData.types.includes('text/plain')) {
      let pastedText = clipboardData.getData('text/plain')
      pastedText = pastedText.substring(0, length).trim()
      let indexToEnter = 0

      while (indexToEnter <= currentIndex) {
        if (
          inputRefs.current[indexToEnter].value &&
          indexToEnter < currentIndex
        ) {
          indexToEnter += 1
        } else {
          break
        }
      }

      const otpArray = value.split('')

      for (let i = indexToEnter; i < length; i += 1) {
        const lastValue = pastedText[i - indexToEnter] ?? ' '
        otpArray[i] = lastValue
      }

      onChange(otpArray.join(''))
    }
  }

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      {new Array(length).fill().map((_, index) => (
        <React.Fragment key={index}>
          <BaseInput
            type="number"
            slots={{
              input: InputElement,
            }}
            aria-label={`Digit ${index + 1} of OTP`}
            slotProps={{
              input: {
                ref: (ele) => {
                  inputRefs.current[index] = ele
                },
                onKeyDown: (event) => handleKeyDown(event, index),
                onChange: (event) => handleChange(event, index),
                onClick: (event) => handleClick(event, index),
                onPaste: (event) => handlePaste(event, index),
                value: value[index] ?? '',
                sx: {
                  color: color,
                },
              },
            }}
          />
          {index === length - 1 ? null : separator}
        </React.Fragment>
      ))}
    </Box>
  )
}

OTP.propTypes = {
  length: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  separator: PropTypes.node,
  value: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
}

export default function OTPInput({ state, setState, color = '#222222' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <OTP
        // separator={<span>-</span>}
        value={state}
        onChange={setState}
        length={6}
        color={color}
      />
      {/* <span>Entered value: {value}</span> */}
    </Box>
  )
}

// const blue = {
//   100: '#DAECFF',
//   200: '#80BFFF',
//   400: '#3399FF',
//   500: '#007FFF',
//   600: '#0072E5',
//   700: '#0059B2',
// }

// const grey = {
//   50: '#F3F6F9',
//   100: '#E5EAF2',
//   200: '#DAE2ED',
//   300: '#C7D0DD',
//   400: '#B0B8C4',
//   500: '#9DA8B7',
//   600: '#6B7A90',
//   700: '#434D5B',
//   800: '#303740',
//   900: '#1C2025',
// }

const InputElement = styled('input')(
  () => `
  width: 50px;
  height: 50px;
  font-family: 'Noto Serif JP', 'serif';
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 10px 10px;
  text-align: center;
  background: '#fff';
  border: 2px solid #d9d9d9;
  -webkit-appearance: none;
  -moz-appearance:textfield;


  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:hover {
    border-color: #bbb29f;
  }

  &:focus {
    border-color: #bbb29f;
    box-shadow: 0 0 0 3px #efede8;
  }

  // firefox
  -moz-appearance: textfield;
  &:focus-visible {
    outline: 0;
  }
`
)
