// components
import LoginForm from './login-form'
import RegisterForm from './register-form'
import ForgotPasswordForm from './forgot-password-form'

export default function AuthModal() {
  return (
    <>
      <LoginForm />

      <RegisterForm />

      <ForgotPasswordForm />
    </>
  )
}
