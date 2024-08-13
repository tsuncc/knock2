import styles from './input01.module.scss'
import { PiEye, PiEyeClosed } from 'react-icons/pi'
import { useEffect, useState } from 'react'

export default function Input01({
  name = '',
  type = '',
  value = '',
  placeholder = '',
  disabled = false,
  inputStyles = 'def',
  onChange = () => {},
  onBlur = () => {},
}) {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [inputType, setInputType] = useState('')

  value === null ? (value = '') : value

  let className

  if (inputStyles === 'def') {
    className = disabled === false ? styles.inputDefault : styles.inputDisabled
  }

  if (inputStyles === 'line') {
    className =
      disabled === false ? styles.inputDefaultLine : styles.inputDisabledLine
  }

  const handlePasswordVisible = () => {
    const newPasswordVisible = !passwordVisible
    setInputType(newPasswordVisible ? 'text' : 'password')
    setPasswordVisible(newPasswordVisible)
  }

  useEffect(() => {
    setInputType(type)
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <div className={styles.input}>
        <input
          name={name}
          type={inputType}
          value={value}
          placeholder={placeholder}
          disabled={disabled === true ? 'disabled' : ''}
          className={className}
          onChange={onChange}
          onBlur={onBlur}
        />
        <button
          type="button"
          className={styles.eyeIcon}
          onClick={handlePasswordVisible}
        >
          {inputStyles === 'def' &&
          type === 'password' &&
          disabled === false ? (
            passwordVisible ? (
              <PiEye />
            ) : (
              <PiEyeClosed />
            )
          ) : null}
        </button>
      </div>
    </>
  )
}
