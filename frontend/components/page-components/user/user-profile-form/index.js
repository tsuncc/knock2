import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// context
import { useAuth } from '@/context/auth-context'
import { API_SERVER, GOOGLE_AUTHENTICATOR_UNSET_POST } from '@/configs/api-path'
import { useSnackbar } from '@/context/snackbar-context'
import { useConfirmDialog } from '@/context/confirm-dialog-context'

// styles
import styles from './user-profile-form.module.scss'

// components
import UserProfileFormTitle from './user-profile-title'
import UserProfileInput from './user-profile-item/UserProfileInput'
import UserProfileRadio from './user-profile-item/UserProfileRadio'
import UserProfileSelect from './user-profile-item/UserProfileSelect'
import UserProfileBirthday from './user-profile-item/birthday'
import AvatarFormItem from './avatar'
import AvatarFormDialogs from '../user-avatar-form'
import AddressModal from '../address-modal'
import schemaForm from './schema-form'
import BlackBtn from '@/components/UI/black-btn'
import ConfirmDialog from '@/components/UI/confirm-dialog'

export default function UserProfileForm() {
  const router = useRouter()
  // useContext
  const { auth, getAuthHeader } = useAuth()
  const { openSnackbar } = useSnackbar()
  const { openConfirmDialog } = useConfirmDialog()

  // state
  const [profileForm, setProfileForm] = useState({})
  const [addressValue, setAddressValue] = useState({})
  const [addressOptions, setAddressOptions] = useState([])
  const [addressFormData, setAddressFormData] = useState([])
  const [birthdayValue, setBirthdayValue] = useState({
    year: '',
    month: '',
    date: '',
  })
  const [birthdayOptions, setBirthdayOptions] = useState({
    years: [],
    months: [],
    dates: [],
  })
  const [profileFormErrors, setProfileFormErrors] = useState({
    name: '',
    nick_name: '',
    gender: '',
    birthday: '',
    mobile_phone: '',
    address: '',
    invoice_carrier_id: '',
    tax_id: '',
  })
  const [openAvatarModal, setOpenAvatarModal] = useState(false)
  const [openAddressModal, setOpenAddressModal] = useState(false)

  // function
  const unset2fa = async () => {
    try {
      const result = await fetch(GOOGLE_AUTHENTICATOR_UNSET_POST, {
        method: 'POST',
        body: JSON.stringify({ id: auth.id }),
        headers: {
          ...getAuthHeader(),
          'Content-type': 'application/json',
        },
      })
      const data = await result.json()
      if (data.success) {
        setProfileForm({ ...profileForm, totp_enabled: 0 })
        openSnackbar('兩步驗證已解除', 'success')
      } else {
        openSnackbar('解除兩步驗證失敗，請重試', 'error')
      }
    } catch (error) {
      openSnackbar('解除兩步驗證失敗，請重試', 'error')
    }
  }
  const handleChange = (e) => {
    const { name, value } = e.target
    // 修改 address
    if (name === 'address_id') {
      setAddressValue({ [name]: value })
      return
    }
    // 修改 birthday
    if (name === 'year' || name === 'month' || name === 'date') {
      const newBirthdayValue = { ...birthdayValue, [name]: value }
      // 寫入 birthday value
      setBirthdayValue(newBirthdayValue)
      const { year, month } = newBirthdayValue
      if (name === 'year' || name === 'month') {
        // 如果選擇的月份最大日期小於目前的日期，將日期欄位清空
        const dates = new Date(year, month, 0).getDate() // 選擇的年月最大的日期
        const date = birthdayValue.date > dates ? '' : birthdayValue.date // 判斷
        const newBirthdayValue = {
          ...birthdayValue,
          [name]: value,
          date: date,
        }
        setBirthdayValue(newBirthdayValue)
        getBirthdayOptions(year, month)
      }
      return
    }
    // 修改常用載具(轉換為大寫英文字母)
    if (name === 'invoice_carrier_id') {
      const newValue = value.toUpperCase()
      const newForm = { ...profileForm, [name]: newValue }
      setProfileForm(newForm)
      return
    }

    const newForm = { ...profileForm, [name]: value }
    setProfileForm(newForm)
  }

  const getBirthdayOptions = (defYear, defMonth) => {
    if (
      birthdayOptions.years.length === 0 ||
      birthdayOptions.months.length === 0
    ) {
      const today = new Date()
      const year = today.getFullYear()

      const years = Array(100)
        .fill()
        .map((v, i) => {
          return { value: year - i, text: `${year - i} 年` }
        })

      const months = Array(12)
        .fill()
        .map((v, i) => {
          return { value: i + 1, text: `${i + 1} 月` }
        })
      if (defYear && defMonth) {
        const date = new Date(defYear, defMonth, 0).getDate()
        const dates = Array(date)
          .fill()
          .map((v, i) => {
            return { value: i + 1, text: `${i + 1} 日` }
          })
        setBirthdayOptions({ ...birthdayOptions, years, months, dates })
      } else {
        setBirthdayOptions({ ...birthdayOptions, years, months })
      }
    } else {
      if (defYear && defMonth) {
        const date = new Date(defYear, defMonth, 0).getDate()
        const dates = Array(date)
          .fill()
          .map((v, i) => {
            return { value: i + 1, text: `${i + 1} 日` }
          })
        setBirthdayOptions({ ...birthdayOptions, dates })
      }
    }
  }

  const UserProfileFormSubmit = async (e) => {
    e.preventDefault()

    let data = { ...profileForm }

    // 處理 birthdayValue
    const { year, month, date } = birthdayValue
    if (year || month || date) {
      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${date
        .toString()
        .padStart(2, '0')}`
      data = { ...profileForm, birthday: formattedDate }
    }

    //  處理 addressValue
    if (addressValue.address_id) {
      data = { users: data, address: addressValue }
    } else {
      data = { users: data }
    }

    // 表單驗證
    const result = schemaForm.safeParse(data.users)
    const newProfileFormErrors = {
      name: '',
      nick_name: '',
      birthday: '',
      mobile: '',
      invoice_carrier_id: '',
      tax_id: '',
    }

    if (!result.success) {
      if (result.error?.issues?.length) {
        for (let issue of result.error.issues) {
          newProfileFormErrors[issue.path[0]] = issue.message
        }
        setProfileFormErrors(newProfileFormErrors)
      }
      return // 表單資料沒有驗證通過就直接返回
    }

    // 通過表單驗證 接著 fetch
    const url = `${API_SERVER}/users/api`
    const option = {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        ...getAuthHeader(),
        'Content-type': 'application/json',
      },
    }
    try {
      let response = await fetch(url, option)
      let data = await response?.json()
      if (data.success) {
        // 清除 Error 文字
        setProfileFormErrors(newProfileFormErrors)
        // TODO
        openSnackbar('編輯成功！', 'success')
      } else {
        console.error(data.error)
      }
    } catch (error) {
      console.error(`fetch-Error: ${error}`)
    }
  }

  const fetchData = async () => {
    const url = `${API_SERVER}/users/api`
    const option = {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
      },
    }
    try {
      let response = await fetch(url, option)
      let data = await response?.json()
      if (data.success) {
        if (data.users) {
          // 寫入 user 表單
          setProfileForm(data.users)
          getBirthdayOptions()
          if (data.users.birthday) {
            // 寫入 birthday value
            const birthday = new Date(data.users.birthday)
            const newBirthday = {
              year: birthday.getFullYear(),
              month: birthday.getMonth() + 1,
              date: birthday.getDate(),
            }
            setBirthdayValue(newBirthday)
            getBirthdayOptions(newBirthday.year, newBirthday.month)
          }
        }
        // 寫入 address options
        if (data.address) {
          const options = data.address.map((v) => {
            return {
              value: v.id,
              type: v.type,
              text: `${v.postal_codes} ${v.city_name}${v.district_name}${v.address} - ${v.recipient_name} / ${v.mobile_phone}`,
            }
          })
          setAddressOptions(options)
          setAddressFormData(data.address)
          // 寫入 address value
          const values = data.address.find((v) => v.type === '1')
          if (values) {
            const id = values.id
            setAddressValue({ address_id: id })
          }
        }
      }
    } catch (error) {
      console.error(`fetch-Error: ${error}`)
    }
  }

  useEffect(() => {
    if (auth.id) fetchData()
    // 下面這行 讓eslint略過一行檢查
    // eslint-disable-next-line
  }, [auth])

  // render form
  return (
    <>
      {JSON.stringify(profileForm) !== '{}' ? (
        <>
          <form
            className={styles['user-profile-form']}
            onSubmit={UserProfileFormSubmit}
          >
            <div className={styles['box1']}>
              <AvatarFormDialogs
                openDialog={openAvatarModal}
                closeDialog={() => setOpenAvatarModal(false)}
              />
              <AvatarFormItem
                avatar={profileForm.avatar}
                open={() => setOpenAvatarModal(true)}
              />
              <div className={styles['account']}>
                <UserProfileFormTitle text={'帳號資訊'} />
                <UserProfileInput
                  label="帳號"
                  name="account"
                  type="email"
                  value={profileForm.account}
                  placeholder="請輸入帳號"
                  disabled={true}
                />
                <UserProfileInput
                  label="密碼"
                  name="password"
                  type="password"
                  value="PasswordPasswordPassword"
                  btn={true}
                  btnOnClick={() => router.push('/user/reset-password')}
                  btnText="修改密碼"
                  disabled={true}
                />
                <UserProfileInput
                  label="兩步驗證"
                  name="totp_enabled"
                  type="text"
                  value={
                    profileForm.totp_enabled === 1 ? '已使用驗證' : '未使用驗證'
                  }
                  btn={true}
                  btnOnClick={
                    profileForm.totp_enabled === 1
                      ? () => openConfirmDialog(() => unset2fa())
                      : () => router.push('/user/profile/set-2fa')
                  }
                  btnText={
                    profileForm.totp_enabled === 1 ? '停用驗證' : '新增驗證'
                  }
                  disabled={true}
                />
              </div>
            </div>
            <div className={styles['box2']}>
              <div>
                <UserProfileFormTitle text={'個人資料'} />
                <UserProfileInput
                  label="姓名"
                  required={true}
                  name="name"
                  type="text"
                  value={profileForm.name}
                  placeholder="請輸入姓名"
                  disabled={false}
                  errorText={profileFormErrors.name}
                  onChange={handleChange}
                />
                <UserProfileInput
                  label="暱稱"
                  required={true}
                  name="nick_name"
                  type="text"
                  value={profileForm.nick_name}
                  placeholder="請輸入暱稱"
                  errorText={profileFormErrors.nick_name}
                  onChange={handleChange}
                />
                <UserProfileRadio
                  label="性別"
                  radios={[
                    {
                      value: '0',
                      label: '男',
                    },
                    {
                      value: '1',
                      label: '女',
                    },
                  ]}
                  name="gender"
                  disabled={false}
                  checked={profileForm.gender}
                  errorText={profileFormErrors.gender}
                  onChange={handleChange}
                />
                <UserProfileBirthday
                  options={birthdayOptions}
                  label="生日"
                  name="birthday"
                  value={birthdayValue}
                  errorText={profileFormErrors.birthday}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className={styles['box2']}>
              <div>
                <UserProfileFormTitle text={'聯絡資訊'} />
                <UserProfileInput
                  label="電話"
                  name="mobile_phone"
                  type="text"
                  value={profileForm.mobile_phone}
                  placeholder="請輸入電話"
                  errorText={profileFormErrors.mobile_phone}
                  onChange={handleChange}
                />
                <UserProfileSelect
                  label="常用地址"
                  options={addressOptions}
                  name="address_id"
                  value={addressValue.address_id}
                  placeholder="請選擇常用收件地址"
                  btn={true}
                  btnText="編輯地址"
                  btnOnClick={() => {
                    setOpenAddressModal(true)
                  }}
                  errorText={profileFormErrors.address_id}
                  onChange={handleChange}
                />
                <AddressModal
                  addressFormData={addressFormData}
                  open={openAddressModal}
                  updateData={fetchData}
                  onClose={() => {
                    setOpenAddressModal(false)
                  }}
                />
              </div>
            </div>
            <div className={styles['box2']}>
              <div>
                <UserProfileFormTitle text={'其他資訊'} />
                <UserProfileInput
                  label="常用載具"
                  name="invoice_carrier_id"
                  type="text"
                  value={profileForm.invoice_carrier_id}
                  placeholder="請輸入常用載具"
                  errorText={profileFormErrors.invoice_carrier_id}
                  onChange={handleChange}
                />
                <UserProfileInput
                  label="常用統編"
                  name="tax_id"
                  type="text"
                  value={profileForm.tax_id}
                  placeholder="請輸入常用統編"
                  errorText={profileFormErrors.tax_id}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className={styles['box2']}>
              <BlackBtn
                btnText="儲存"
                type="submit"
                href={null}
                onClick={null}
                paddingType="medium"
              />
            </div>
          </form>
          <ConfirmDialog dialogTitle="確定要解除兩步驗證嗎" />
        </>
      ) : (
        ''
      )}
    </>
  )
}
