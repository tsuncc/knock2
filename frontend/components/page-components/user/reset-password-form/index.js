import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/context/auth-context'
import { useLoginModal } from '@/context/login-context'
import { RESET_PASSWORD_POST } from '@/configs/api-path'
import { useSnackbar } from '@/context/snackbar-context'
import styles from './reset-password-form.module.scss'
import {
  schemaResetPasswordForm,
  schemaForgetPasswordForm,
} from './schema-reset-password-form'
import UserProfileFormTitle from '../user-profile-form/user-profile-title'
import UserProfileInput from '../user-profile-form/user-profile-item/UserProfileInput'
import BlackBtn from '@/components/UI/black-btn'

export default function ResetPasswordForm({ user_id }) {
  const router = useRouter()
  const { auth, getAuthHeader } = useAuth()
  const { openSnackbar } = useSnackbar()
  const { loginFormSwitch } = useLoginModal()

  const [resetPasswordData, setResetPasswordData] = useState({
    old_password: '',
    new_password: '',
    reenter_new_password: '',
  })
  const [resetPasswordErrors, setResetPasswordErrors] = useState({
    old_password: '',
    new_password: '',
    reenter_new_password: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setResetPasswordData({ ...resetPasswordData, [name]: value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    let data = { ...resetPasswordData }

    const newResetPasswordErrors = {
      old_password: '',
      new_password: '',
      reenter_new_password: '',
    }

    let result = {}
    if (auth.id === 0) {
      // 如果沒登入就是忘記密碼
      delete data.old_password
      delete newResetPasswordErrors.old_password
      data.user_id = user_id
      result = schemaForgetPasswordForm.safeParse(data)
    } else {
      // 如果有登入就是修改密碼
      data.user_id = auth.id
      result = schemaResetPasswordForm.safeParse(data)
    }

    if (!result.success) {
      if (result.error?.issues?.length) {
        for (let issue of result.error.issues) {
          newResetPasswordErrors[issue.path[0]] = issue.message
        }
        setResetPasswordErrors(newResetPasswordErrors)
      }
      return // 表單資料沒有驗證通過就直接返回
    }

    const isLogin = !!auth.id
    delete data.reenter_new_password

    const option = {
      method: 'PUT',
      body: JSON.stringify({ isLogin: isLogin, data: data }),
      headers: {
        ...getAuthHeader(),
        'Content-type': 'application/json',
      },
    }
    // 通過表單驗證
    try {
      let response = await fetch(RESET_PASSWORD_POST, option)
      let data = await response?.json()
      if (data.success) {
        openSnackbar('修改成功', 'success')
        if (auth.id === 0) {
          router.push('/')
          loginFormSwitch('Login')
        } else {
          router.push('/user/profile')
        }
      } else {
        console.error(data.error)
        openSnackbar(data.error, 'error')
      }
    } catch (ex) {
      console.error(ex)
      openSnackbar('修改失敗', 'error')
    }
  }

  return (
    <>
      <form className={styles['reset-password-form']} onSubmit={onSubmit}>
        <div className={styles['box2']}>
          <div>
            <UserProfileFormTitle
              text={'修改密碼'}
              href={auth.id ? '/user/profile' : null}
              quickInput={() =>
                setResetPasswordData({
                  new_password: 'asdasdasd',
                  reenter_new_password: 'asdasdasd',
                })
              }
            />
            {auth.id ? (
              <UserProfileInput
                label="舊密碼"
                name="old_password"
                type="password"
                value={resetPasswordData.old_password}
                placeholder="請輸入舊密碼"
                disabled={false}
                errorText={resetPasswordErrors.old_password}
                onChange={handleChange}
              />
            ) : (
              ''
            )}
            <UserProfileInput
              label="新密碼"
              name="new_password"
              type="password"
              value={resetPasswordData.new_password}
              placeholder="請輸入新密碼"
              disabled={false}
              errorText={resetPasswordErrors.new_password}
              onChange={handleChange}
            />
            <UserProfileInput
              label="確認密碼"
              name="reenter_new_password"
              type="password"
              value={resetPasswordData.reenter_new_password}
              placeholder="請再次輸入新密碼"
              errorText={resetPasswordErrors.reenter_new_password}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className={styles['box2']}>
          <BlackBtn
            btnText="送出"
            type="submit"
            href={null}
            onClick={null}
            paddingType="medium"
          />
        </div>
      </form>
    </>
  )
}
