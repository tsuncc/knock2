// components
import RecipientButtonEdit from './recipient-button-edit'
import RecipientButton from '@/components/page-components/checkout/address/recipient-button'
import NoData from '@/components/UI/no-data'
import { useAuth } from '@/context/auth-context'

export default function AddressList({
  addressFormData,
  addressEdit,
  updateData,
  onClick,
}) {
  const { auth } = useAuth()
  return (
    <>
      {addressFormData.length === 0 ? (
        <NoData
          text="無收件人資料"
          backgroundColor="#f2f2f2"
          borderRadius="var(--input-radius)"
        />
      ) : (
        addressFormData.map((v) => (
          <RecipientButtonEdit
            key={v.id}
            addressId={v.id}
            name={v.recipient_name}
            phone={v.mobile_phone}
            address={v.postal_codes + v.city_name + v.district_name + v.address}
            user_id={auth.id}
            addressEdit={addressEdit}
            updateData={updateData}
          />
        ))
      )}
      <RecipientButton
        memberId={auth.id}
        btnText="新增收件人資料"
        iconType="add"
        bgtype="outline"
        onClick={onClick}
      />
    </>
  )
}
