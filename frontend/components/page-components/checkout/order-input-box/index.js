import styles from './order-input-box.module.css'
import Input01 from '@/components/UI/form-item/input01'
import OrderInputError from '../order-input-error'

export default function OrderInputBox({
  label = 'label',
  name = '',
  type = '',
  value = '',
  placeholder = '',
  disabled = false,
  errorText = '',
  onChange = () => {},
  onBlur = () => {},
}) {
  return (
    <div>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <Input01
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
      />

      <OrderInputError errorText={errorText} />
    </div>
  )
}
