import styles from './modal-layout.module.css'

import { useState } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { API_SERVER } from '@/configs/api-path'
import Dialog from '@mui/material/Dialog'

// context
import { useAuth } from '@/context/auth-context'
import { useSnackbar } from '@/context/snackbar-context'

// components
import BlackBtn from '@/components/UI/black-btn'
import AddressList from './address-list'
import AddressForm from './address-form'
import schemaForm from './schema-form'

const theme = createTheme({
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          width: '720px',
          height: 'auto',
          maxHeight: '640px',
          borderRadius: 'var(--popup-radius)',
        },
      },
    },
  },
})

export default function AddressModal({
  addressFormData,
  open,
  onClose,
  updateData,
}) {
  const { auth, getAuthHeader } = useAuth()
  const { openSnackbar } = useSnackbar()
  const [addressModalState, setAddressModalState] = useState(1)
  const [addressEditData, setAddressEditData] = useState({})
  const [addressFormErrors, setAddressFormErrors] = useState({
    user_id: '',
    district_id: '',
    address: '',
    recipient_name: '',
    mobile_phone: '',
  })

  const addressEdit = (addressId) => {
    const address = addressFormData.find((v) => v.id === addressId)
    setAddressEditData(address)
    setAddressModalState(2)
  }

  const reset = () => {
    setAddressFormErrors({
      user_id: '',
      district_id: '',
      address: '',
      recipient_name: '',
      mobile_phone: '',
    })
    setAddressModalState(1)
  }

  const addressFormSubmit = async () => {
    const data = {
      user_id: auth.id,
      district_id: addressEditData.district_id,
      address: addressEditData.address,
      recipient_name: addressEditData.recipient_name,
      mobile_phone: addressEditData.mobile_phone,
      type: '0',
    }

    // 表單驗證
    const validResult = schemaForm.safeParse(data)
    const newAddressFormErrors = {
      district_id: '',
      address: '',
      recipient_name: '',
      mobile_phone: '',
    }

    if (!validResult.success) {
      if (validResult.error?.issues?.length) {
        for (let issue of validResult.error.issues) {
          newAddressFormErrors[issue.path[0]] = issue.message
        }
        setAddressFormErrors(newAddressFormErrors)
      }
      return // 表單資料沒有驗證通過就直接返回
    }

    if (addressEditData.id) {
      data.id = addressEditData.id
    }

    const url = `${API_SERVER}/users/update_address`

    const option = {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
    }

    const response = await fetch(url, option)
    const result = await response.json()
    if (result.success) {
      openSnackbar('更新成功', 'success')
      reset()
      updateData()
      return
    } else {
      console.error('更新失敗', result)
    }
  }
  return (
    <>
      <ThemeProvider theme={theme}>
        <Dialog
          open={open}
          onClose={() => {
            setAddressModalState(1)
            onClose()
          }}
        >
          <div className={styles.modalBody}>
            <div className={styles.title}>收件人資料</div>
            <div className={styles.modalContent}>
              {addressModalState === 1 && (
                <AddressList
                  addressFormData={addressFormData}
                  addressEdit={addressEdit}
                  updateData={updateData}
                  onClick={() => {
                    setAddressEditData({}), setAddressModalState(2)
                  }}
                />
              )}
              {addressModalState === 2 && (
                <AddressForm
                  addressData={addressEditData}
                  setAddressData={setAddressEditData}
                  addressFormErrors={addressFormErrors}
                />
              )}
            </div>
            {addressModalState === 2 && (
              <div className={styles.btnBar}>
                <BlackBtn
                  btnText="返回"
                  onClick={reset}
                  href={null}
                  paddingType="medium"
                />
                <BlackBtn
                  btnText="確定"
                  onClick={addressFormSubmit}
                  href={null}
                  paddingType="medium"
                />
              </div>
            )}
          </div>
        </Dialog>
      </ThemeProvider>
    </>
  )
}
