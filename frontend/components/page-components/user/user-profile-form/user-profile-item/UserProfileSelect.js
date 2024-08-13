import styles from './item.module.scss'
import Select02 from '@/components/UI/form-item/select02/index'
import FilterBtn from '@/components/UI/filter-btn'

export default function UserProfileSelect({
  name = '',
  value = '',
  placeholder = '',
  options = [],
  label = '',
  btn = false,
  btnText = '',
  errorText = '',
  onChange = () => {},
  btnOnClick = () => {},
}) {
  return (
    <>
      <div className={styles.formItem}>
        <label htmlFor={name} className={styles.myLabel}>
          {label}
        </label>
        <div className={styles.myDiv}>
          <div className={styles.selectBtn}>
            <Select02
              name={name}
              placeholder={placeholder}
              value={value}
              options={options}
              onChange={onChange}
            />
            {btn ? (
              <div className={styles.button}>
                <FilterBtn href={null} onClick={btnOnClick} btnText={btnText} />
              </div>
            ) : null}
          </div>
          <div className={styles.errorText}>
            {errorText !== '' ? <span>{errorText}</span> : ''}
          </div>
        </div>
      </div>
    </>
  )
}
