import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { ThemeProvider } from '@mui/material/styles'
import customTheme from './theme'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'

export default function Select03({
  name = '',
  value = '',
  placeholder = '',
  options = [],
  onChange = () => {},
}) {
  if (!Array.isArray(options)) {
    console.error('options不是陣列，請確認', options)
    return null
  }

  return (
    <ThemeProvider theme={customTheme}>
      <Select
        name={name}
        value={value}
        onChange={onChange}
        IconComponent={KeyboardArrowDownRoundedIcon}
        displayEmpty
      >
        <MenuItem value="" disabled>
          {placeholder}
        </MenuItem>
        {options.map((v, i) => (
          <MenuItem key={i} value={v.value}>
            {v.text}
          </MenuItem>
        ))}
      </Select>
    </ThemeProvider>
  )
}
