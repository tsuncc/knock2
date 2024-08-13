import styles from './select-address-modal.module.css'
// contexts
import { useAuth } from '@/context/auth-context'
import { useAddress } from '@/context/address-context'
// components
import ModalLayout from '../modal-layout'
import RecipientButton from '../recipient-button'
import RecipientButtonEdit from '../recipient-button-edit'
import AddAddressModal from '../add-address-modal'
import NoData from '@/components/UI/no-data'
import EditAddressModal from '../edit-address-modal'

export default function SelectAddressModal() {
  const { auth } = useAuth()
  const {
    isAddressSelectModalOpen,
    closeAddressSelectModal,
    isAddressAddModalOpen,
    memberAddress,
    openAddressAddModal,
    isAddressEditModalOpen,
  } = useAddress()
  return (
    <ModalLayout
      title="請選擇收件人"
      modalHeight='720px'
      btnLeftHidden={true}
      btnTextRight="關閉"
      isOpen={isAddressSelectModalOpen}
      handleClose={closeAddressSelectModal}
    >
      <div className={styles.contentBox}>
        {memberAddress.length === 0 ? (
          <NoData
            text="無收件人資料"
            backgroundColor="#f2f2f2"
            borderRadius="var(--input-radius)"
          />
        ) : (
          memberAddress.map((v, i) => (
            <RecipientButtonEdit
              key={v.id}
              addressId={v.id}
              name={v.recipient_name}
              phone={v.mobile_phone}
              address={v.city_name + v.district_name + v.address}
              href={null}
              memberId={auth.id}
            />
          ))
        )}

        <RecipientButton
          memberId={auth.id}
          btnText="新增收件人資料"
          iconType="add"
          bgtype="outline"
          onClick={openAddressAddModal}
        />
      </div>

      {isAddressAddModalOpen && <AddAddressModal />}
      {isAddressEditModalOpen && <EditAddressModal />}
    </ModalLayout>
  )
}
