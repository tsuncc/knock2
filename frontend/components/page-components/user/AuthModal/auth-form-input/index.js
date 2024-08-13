import styles from './input.module.scss'
import { PiEye, PiEyeClosed } from 'react-icons/pi'
import { useEffect, useState } from 'react'

export default function AuthFormInput({
  name = '',
  type = '',
  value = '',
  placeholder = '',
  disabled = false,
  onChange = () => {},
}) {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [inputType, setInputType] = useState('')
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
          className={
            disabled === true ? styles.inputDisabled : styles.inputDefault
          }
          onChange={onChange}
        />
        <button
          type="button"
          className={styles.eyeIcon}
          onClick={handlePasswordVisible}
        >
          {type === 'password' && disabled === false ? (
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
