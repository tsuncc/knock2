import styles from './input01.module.scss'
import { useEffect, useState } from 'react'

export default function Input02({
  name = '',
  type = 'text',
  value = '',
  placeholder = '',
  disabled = false,
  inputStyles = 'def',
  onChange = () => {},
  onBlur = () => {},
}) {
  const [inputType, setInputType] = useState(type)

  useEffect(() => {
    setInputType(type)
  }, [type])

  const goldTextStyle = { color: '#B99755' }

  let className

  if (inputStyles === 'def') {
    className = disabled === false ? styles.inputDefault : styles.inputDisabled
  }

  if (inputStyles === 'line') {
    className =
      disabled === false ? styles.inputDefaultLine : styles.inputDisabledLine
  }

  return (
    <div className={styles.input}>
      <input
        name={name}
        type={inputType}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        onChange={onChange}
        onBlur={onBlur}
        style={goldTextStyle}
      />
    </div>
  )
}
