import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { ThemeProvider } from '@mui/material/styles'
import customTheme from './theme'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'

export default function Select02({
  name = '',
  value = 'placeholder',
  placeholder = '',
  options = [],
  onChange = () => {},
}) {
  if (!Array.isArray(options)) {
    console.error('options不是陣列，請確認', options)
    return
  }
  if (options.length === 0 || value === null || value === '') {
    value = 'placeholder'
  }
  return (
    <>
      <ThemeProvider theme={customTheme}>
        <Select
          name={name}
          value={value}
          onChange={onChange}
          IconComponent={KeyboardArrowDownRoundedIcon}
        >
          {value === 'placeholder' && placeholder ? (
            <MenuItem value="placeholder" disabled>
              {placeholder}
            </MenuItem>
          ) : (
            ''
          )}
          {options.map((v, i) => (
            <MenuItem key={i} value={v.value} disabled={v.disabled}>
              {v.text}
            </MenuItem>
          ))}
        </Select>
      </ThemeProvider>
    </>
  )
}
