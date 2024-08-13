import styles from './item.module.scss'
import Select02 from '@/components/UI/form-item/select02/index'

export default function UserProfileBirthday({
  options = [],
  value = '',
  label = '',
  name = '',
  errorText = '',
  onChange = () => {},
}) {
  return (
    <>
      <div className={styles.formItem}>
        <label htmlFor={name} className={styles.myLabel}>
          {label}
        </label>
        <div className={styles.myDiv}>
          <div className={styles.birthday}>
            <Select02
              options={options.years}
              value={value.year}
              name="year"
              placeholder="年"
              onChange={onChange}
            />
            <Select02
              options={options.months}
              value={value.month}
              name="month"
              placeholder="月"
              onChange={onChange}
            />
            <Select02
              options={options.dates}
              value={value.date}
              name="date"
              placeholder="日"
              onChange={onChange}
            />
          </div>
          {errorText !== '' ? (
            <span className={styles.errorText}>{errorText}</span>
          ) : (
            ''
          )}
        </div>
      </div>
    </>
  )
}
