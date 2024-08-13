// styles
import styles from '../login-form.module.scss'
// components
import AuthFormInput from '../auth-form-input'

export default function LoginInput({
  loginData,
  handleLoginChange,
  loginErrors,
}) {
  return (
    <>
      <AuthFormInput
        name="account"
        type="text"
        value={loginData.account}
        placeholder="請輸入Email"
        onChange={handleLoginChange}
      />
      <span className={styles.errorText}>{loginErrors.account}</span>
      <AuthFormInput
        name="password"
        type="password"
        value={loginData.password}
        placeholder="請輸入密碼"
        onChange={handleLoginChange}
      />
      <span className={styles.errorText}>{loginErrors.password}</span>
    </>
  )
}
