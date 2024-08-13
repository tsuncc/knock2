import styles from './edit-address-modal.module.css'
import { useEffect, useState } from 'react'
// context
import { useAddress } from '@/context/address-context'
// hooks
import useFetchCityDistrict from '@/hooks/fetchCityDistrict'
import { useOrderValidation } from '@/hooks/orderValidation'
// components
import ModalLayout from '../modal-layout'
import OrderInputBox from '../../order-input-box'
import OrderSelectBox from '../../order-select-box'
import ErrorHint from '@/components/UI/error-hint'

export default function EditAddressModal() {
  const {
    isAddressEditModalOpen,
    closeAddressEditModal,
    handleEditAddressSubmit,
    memberAddress,
    editId,
  } = useAddress()

  const [initialData, setInitialData] = useState({})
  const [formData, setFormData] = useState({})
  const { timeout, errors, validateField } = useOrderValidation() // 欄位驗證
  const [isValid, setIsValid] = useState(true)

  // 縣市地區選項，以及地區根據選擇的縣市連動
  const { cityOptions, districtOptions, filteredDistrictOptions } =
    useFetchCityDistrict()
  const [selectedCity, setSelectedCity] = useState()
  const [selectedDistrict, setSelectedDistrict] = useState()

  // 監聽 input 輸入
  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'recipientCityId') {
      setSelectedCity(value)
    }

    if (name === 'recipientDistrictId') {
      setSelectedDistrict(value)
    }

    setFormData((v) => ({
      ...v,
      [name]: value,
    }))

    console.log(formData)

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
      validateField(field, formData[field])
      if (!formData[field] || errors[field]) {
        isValid = false
      }
    })

    setIsValid(isValid)

    if (isValid) {
      handleEditAddressSubmit(formData)
    }
  }

  useEffect(() => {
    if (editId > 0) {
      const address = memberAddress.find((v) => v.id === editId)
      setInitialData(address)
      console.log('editId', editId, address)
    }
  }, [editId])

  useEffect(() => {
    if (initialData && Object.keys(initialData).length !== 0) {
      setFormData({
        id: editId,
        memberId: initialData.user_id,
        recipientCityId: initialData.city_id,
        recipientDistrictId: initialData.district_id,
        recipientName: initialData.recipient_name,
        recipientMobile: initialData.mobile_phone,
        recipientAddress: initialData.address,
      })
      setSelectedCity(initialData.city_id)
      filteredDistrictOptions(initialData.city_id)
      setSelectedDistrict(initialData.district_id)
    }
  }, [initialData, filteredDistrictOptions])

  // 監聽縣市下拉選項異動
  useEffect(() => {
    
      setSelectedDistrict()
      filteredDistrictOptions(selectedCity)
    
  }, [selectedCity])

  return (
    <ModalLayout
      title="編輯收件人資料"
      modalHeight="720px"
      btnTextLeft="取消"
      btnTextRight="儲存"
      onClickLeft={closeAddressEditModal}
      onClickRight={handleSubmit}
      isOpen={isAddressEditModalOpen}
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
          value={formData.recipientName || ''}
          errorText={errors.recipientName || ''}
          onChange={handleInputChange}
          onBlur={handleBlur}
        />
        <OrderInputBox
          label="手機"
          name="recipientMobile"
          value={formData.recipientMobile || ''}
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
            value={formData.recipientAddress || ''}
            errorText={errors.recipientAddress || ''}
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
        </div>
      </form>
    </ModalLayout>
  )
}
