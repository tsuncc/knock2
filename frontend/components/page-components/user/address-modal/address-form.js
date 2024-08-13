import { useEffect, useState } from 'react'
import styles from './address-form.module.css'

import { API_SERVER } from '@/configs/api-path'
import { useAuth } from '@/context/auth-context'

// components
import OrderInputBox from '@/components/page-components/checkout/order-input-box'
import OrderSelectBox from '@/components/page-components/checkout/order-select-box'
import ClearButton from '@/components/UI/clear-button'

export default function AddressForm({
  addressData,
  setAddressData,
  addressFormErrors,
}) {
  const { getAuthHeader } = useAuth()
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [cityOptions, setCityOptions] = useState([])
  const [districtOptions, setDistrictOptions] = useState([])

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name === 'city_id') {
      const city_name = cityOptions.find((v) => v.value === value)?.text
      setAddressData((v) => ({
        ...v,
        city_name: city_name,
      }))
      setSelectedDistrict('')
      setSelectedCity(value)
      fetchDistrictOptions(value)
    }

    if (name === 'district_id') {
      const district_name = districtOptions.find((v) => v.value === value)?.text
      setAddressData((v) => ({
        ...v,
        district_name: district_name,
      }))
      setSelectedDistrict(value)
    }

    setAddressData((v) => ({
      ...v,
      [name]: value,
    }))
  }

  const quickInput = async () => {
    setAddressData({
      recipient_name: '銀耳機',
      mobile_phone: '0912345678',
      city_id: 1,
      district_id: 5,
      address: '復興南路一段390號2樓',
    })
    setSelectedCity(1)
    await fetchDistrictOptions(1)
    setSelectedDistrict(5)
  }

  // fetch options
  const fetchCityOptions = async () => {
    const url = `${API_SERVER}/users/address_city_options`
    const option = {
      method: 'GET',
      headers: {
        ...getAuthHeader(),
        'Content-type': 'application/json',
      },
    }
    try {
      let response = await fetch(url, option)
      let data = await response?.json()
      if (data.success) {
        setCityOptions(data.city)
      }
    } catch (error) {
      //
      console.error('取得地址選項時出錯', error)
    }
  }
  const fetchDistrictOptions = async (city_id) => {
    const url = `${API_SERVER}/users/address_district_options/${city_id}`
    const option = {
      method: 'GET',
      headers: {
        ...getAuthHeader(),
        'Content-type': 'application/json',
      },
    }
    try {
      let response = await fetch(url, option)
      let data = await response?.json()
      if (data.success) {
        setDistrictOptions(data.district)
      }
    } catch (error) {
      //
      console.error('取得地址選項時出錯', error)
    }
  }

  useEffect(() => {
    // fetch options
    fetchCityOptions()
    if (addressData?.city_id) {
      fetchDistrictOptions(addressData?.city_id)
    }
    // set selected
    setSelectedCity(addressData?.city_id)
    setSelectedDistrict(addressData?.district_id)
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <form name="AddressForm" className={styles.formBox}>
        <OrderInputBox
          label="姓名"
          name="recipient_name"
          value={addressData.recipient_name || ''}
          errorText={addressFormErrors.recipient_name || ''}
          onChange={handleInputChange}
          // onBlur={handleBlur}
        />
        <OrderInputBox
          label="手機"
          name="mobile_phone"
          value={addressData.mobile_phone}
          errorText={addressFormErrors.mobile_phone || ''}
          onChange={handleInputChange}
          // onBlur={handleBlur}
        />
        <OrderSelectBox
          name="city_id"
          label="縣市"
          placeholder="請選擇"
          value={selectedCity}
          options={cityOptions}
          onChange={handleInputChange}
        />

        <OrderSelectBox
          name="district_id"
          label="地區"
          placeholder="請選擇"
          value={selectedDistrict}
          options={districtOptions}
          errorText={addressFormErrors.district_id || ''}
          onChange={handleInputChange}
        />

        <div className={styles.span2}>
          <OrderInputBox
            label="地址"
            name="address"
            value={addressData.address}
            errorText={addressFormErrors.address || ''}
            onChange={handleInputChange}
            // onBlur={handleBlur}
          />
          <ClearButton
            btnText={<span style={{ color: '#FFF' }}>快速輸入</span>}
            onClick={quickInput}
          />
        </div>
      </form>
    </>
  )
}
