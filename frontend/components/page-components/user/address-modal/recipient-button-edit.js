import { styled } from '@mui/material/styles'
import styles from './recipient-button-edit.module.css'
import TextButton from '@/components/UI/text-button'
import { useConfirmDialog } from '@/context/confirm-dialog-context'
import AddressInfoRow from '@/components/page-components/checkout/address/address-info-row'
import ConfirmDialog from '@/components/UI/confirm-dialog'
import { FaPhoneAlt } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'
import { API_SERVER } from '@/configs/api-path'

import { useSnackbar } from '@/context/snackbar-context'
import { useAuth } from '@/context/auth-context'

const RecipientBtnEdit = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'space-between',
  color: 'var(--text-dark)',
  fontSize: '1.125rem',
  fontFamily: '"Noto Serif JP", serif',
  backgroundColor: 'white',
  border: '2px solid #F2F2F2',
  padding: '0.875rem 1.25rem',
  borderRadius: 'var(--input-radius)',
  boxShadow: 'none',

  '&:hover': {
    backgroundColor: '#fafafa',
    boxShadow: 'none',
  },
}))

export default function RecipientButtonEdit({
  addressId = '',
  name = '無收件人',
  phone = '無收件手機',
  address = '無收件地址',
  addressEdit,
  updateData,
}) {
  const { getAuthHeader } = useAuth()
  const { openConfirmDialog } = useConfirmDialog()
  const { openSnackbar } = useSnackbar() // success toast

  const handleDeleteClick = () => {
    const addressDelete = async (addressId) => {
      const url = `${API_SERVER}/users/delete_address/${addressId}`
      try {
        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            ...getAuthHeader(),
            'Content-type': 'application/json',
          },
        })
        const data = await response.json()
        if (data.success) {
          openSnackbar('已成功刪除地址', 'success')
          updateData()
        } else {
          console.error('地址刪除失敗', data)
        }
      } catch (error) {
        console.error('刪除地址時出錯', error)
      }
    }
    openConfirmDialog(() => {
      addressDelete(addressId)
    })
  }

  return (
    <>
      <RecipientBtnEdit variant="contained">
        <div className={styles.header}>
          <p>{name}</p>
          <div className={styles.btnStack}>
            <TextButton
              btnText="刪除"
              type="sec"
              onClick={handleDeleteClick}
              href={null}
            />

            <div className={styles.btnDivider}> </div>

            <TextButton
              btnText="編輯"
              type="sec"
              href={null}
              onClick={() => addressEdit(addressId)}
            />
          </div>
        </div>

        <AddressInfoRow content={phone} icon={FaPhoneAlt} />
        <AddressInfoRow content={address} icon={FaLocationDot} />
      </RecipientBtnEdit>

      <ConfirmDialog
        dialogTitle="確定要刪除地址嗎？"
        btnTextRight="確定刪除"
        btnTextLeft="取消"
      />
    </>
  )
}
