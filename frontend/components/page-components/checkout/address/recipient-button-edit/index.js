// COMPONENT Recipient button edit
import styles from './recipient-button-edit.module.css'
import { styled } from '@mui/material/styles'
// contexts
import { useAddress } from '@/context/address-context'
import { useConfirmDialog } from '@/context/confirm-dialog-context'
// components
import TextButton from '@/components/UI/text-button'
import ConfirmDialog from '@/components/UI/confirm-dialog'
import AddressInfoRow from '../address-info-row'
// icons
import { FaPhoneAlt } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'

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
  name = '無收件人',
  phone = '無收件手機',
  address = '無收件地址',
  href = null,
  addressId, // 接收父層 SelectAddressModal 資料
}) {
  const {
    handleAddressDelete,
    handleSelectAddress,
    openAddressEditModal,
    goToEditModal,
  } = useAddress()
  const { openConfirmDialog } = useConfirmDialog()

  const handleDeleteClick = () => {
    openConfirmDialog(() => {
      handleAddressDelete(addressId)
    })
  }

  return (
    <div>
      <RecipientBtnEdit variant="contained" href={href}>
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
              onClick={() => {
                goToEditModal(addressId)
              }}
            />

            <div className={styles.btnDivider}> </div>

            <TextButton
              btnText="使用"
              type="pri"
              onClick={() => {
                handleSelectAddress(addressId)
              }}
              href={null}
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
    </div>
  )
}
