import styles from './order-select-box.module.css'
import Select02 from '@/components/UI/form-item/select02'
import OrderInputError from '../order-input-error'

export default function OrderSelectBox({
  label = 'label',
  name = '',
  value = '',
  placeholder = '',
  options = [],
  errorText = '',
  onChange = () => {},
}) {
  return (
    <div>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <Select02
        name={name}
        placeholder={placeholder}
        value={value}
        options={options}
        onChange={onChange}
      />

      <OrderInputError errorText={errorText} />
    </div>
  )
}
