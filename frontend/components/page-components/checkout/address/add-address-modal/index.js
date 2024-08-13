import styles from './add-address-modal.module.css'
import { useEffect, useState } from 'react'
// context
import { useAuth } from '@/context/auth-context'
import { useAddress } from '@/context/address-context'
import { useCart } from '@/context/cart-context'
// hooks
import useFetchCityDistrict from '@/hooks/fetchCityDistrict'
import { useOrderValidation } from '@/hooks/orderValidation'
// components
import ModalLayout from '../modal-layout'
import OrderInputBox from '../../order-input-box'
import OrderSelectBox from '../../order-select-box'
import ErrorHint from '@/components/UI/error-hint'

export default function AddAddressModal() {
  const { auth } = useAuth()
  const {
    isAddressAddModalOpen,
    closeAddressAddModal,
    handleAddAddressSubmit,
  } = useAddress()

  const { memberProfile } = useCart() // 取得會員姓名、手機資料
  const { timeout, errors, validateField } = useOrderValidation() // 欄位驗證
  const [isValid, setIsValid] = useState(true)

  // 縣市地區選項，以及地區根據選擇的縣市連動
  const { cityOptions, districtOptions, filteredDistrictOptions } =
    useFetchCityDistrict()
  const [selectedCity, setSelectedCity] = useState()
  const [selectedDistrict, setSelectedDistrict] = useState()

  // form data
  const [addAddressData, setAddressData] = useState({
    memberId: auth.id,
    recipientCityId: 0,
    recipientDistrictId: 0,
    recipientName: '',
    recipientMobile: '',
    recipientAddress: '',
  })

  // 監聽 input 輸入
  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'recipientCityId') {
      setSelectedCity(value)
      console.log(name, value)
    }

    if (name === 'recipientDistrictId') {
      setSelectedDistrict(value)
      console.log(name, value)
    }

    setAddressData((v) => ({
      ...v,
      [name]: value,
    }))

    console.log(addAddressData)

    // 表單驗證
    setTimeout(() => {
      validateField(name, value)
      console.log('表單驗證', errors)
    }, timeout)
  }

  // 表單驗證
  const handleBlur = (e) => {
    const { name, value } = e.target
    validateField(name, value)
    console.log('表單驗證', errors)
  }

  const handleSubmit = () => {
    // 驗證所有欄位
    const requiredFields = [
      'recipientCityId',
      'recipientDistrictId',
      'recipientName',
      'recipientMobile',
      'recipientAddress',
    ]

    let isValid = true
    requiredFields.forEach((field) => {
      validateField(field, addAddressData[field])
      if (!addAddressData[field] || errors[field]) {
        isValid = false
      }
    })

    setIsValid(isValid)

    if (isValid) {
      handleAddAddressSubmit(addAddressData)
    }
  }

  // 監聽縣市下拉選項異動
  useEffect(() => {
    setSelectedDistrict()
    filteredDistrictOptions(selectedCity)
    console.log(
      'after selectedCity, city: ',
      selectedCity,
      'district',
      districtOptions
    )
  }, [selectedCity])

  // 預設帶入會員資料的姓名與手機
  useEffect(() => {
    setAddressData((v) => ({
      ...v,
      recipientName: memberProfile.name,
      recipientMobile: memberProfile.mobile_phone,
    }))
  }, [])

  return (
    <ModalLayout
      title="新增收件人資料"
      modalHeight="720px"
      btnTextLeft="取消"
      btnTextRight="確定新增"
      onClickLeft={closeAddressAddModal}
      onClickRight={handleSubmit}
      isOpen={isAddressAddModalOpen}
    >
      <form name="addAddressForm" className={styles.formBox}>
        {!isValid && (
          <div className={styles.span2}>
            <ErrorHint hintText="請確認表單欄位" />
          </div>
        )}

        <OrderInputBox
          label="姓名"
          name="recipientName"
          value={addAddressData.recipientName || ''}
          errorText={errors.recipientName || ''}
          onChange={handleInputChange}
          onBlur={handleBlur}
        />
        <OrderInputBox
          label="手機"
          name="recipientMobile"
          value={addAddressData.recipientMobile}
          errorText={errors.recipientMobile || ''}
          onChange={handleInputChange}
          onBlur={handleBlur}
        />
        <OrderSelectBox
          name="recipientCityId"
          label="縣市"
          placeholder="請選擇"
          value={selectedCity}
          options={cityOptions}
          errorText={errors.recipientCityId || ''}
          onChange={handleInputChange}
        />

        <OrderSelectBox
          name="recipientDistrictId"
          label="地區"
          placeholder="請選擇"
          value={selectedDistrict}
          options={districtOptions}
          errorText={errors.recipientDistrictId || ''}
          onChange={handleInputChange}
        />

        <div className={styles.span2}>
          <OrderInputBox
            label="地址"
            name="recipientAddress"
            value={addAddressData.recipientAddress}
            errorText={errors.recipientAddress || ''}
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
        </div>
      </form>
    </ModalLayout>
  )
}
