import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './auth-context'
import axios from 'axios'
// contexts
import { useSnackbar } from './snackbar-context'
// api path
import {
  CHECKOUT_GET_ADDRESS,
  CHECKOUT_DELETE_ADDRESS,
  CHECKOUT_ADD_ADDRESS,
  CHECKOUT_EDIT_ADDRESS,
} from '@/configs/api-path'

const AddressContext = createContext()

export const useAddress = () => {
  return useContext(AddressContext)
}

export const AddressProvider = ({ children }) => {
  const { auth } = useAuth()
  const [isAddressSelectModalOpen, setIsSelectModalOpen] = useState(false) // 控制「請選擇收件人」開關
  const [isAddressAddModalOpen, setIsAddressAddModalOpen] = useState(false) // 控制「請選擇收件人」開關
  const [isAddressEditModalOpen, setIsAddressEditModalOpen] = useState(false) // 控制「請選擇收件人」開關
  const [memberAddress, setMemberAddress] = useState([]) // 取得會員 address table 所有地址
  const [orderAddress, setOrderAddress] = useState(null)
  const [newAddressId, setNewAddressId] = useState(0)
  const [editId, setEditId] = useState(0)
  const { openSnackbar } = useSnackbar() // success toast

  // 取得會員地址
  const fetchMemberAddress = async () => {
    try {
      const response = await axios.get(
        `${CHECKOUT_GET_ADDRESS}?member_id=${auth.id}`
      )

      if (!response.status) {
        throw new Error('Failed to fetch member address')
      }

      const data = response.data

      setMemberAddress(data.rows)

      if (!orderAddress) {
        const newOrderAddress =
          data.rows.find((v) => v.type === '1') || data.rows[0]

        setOrderAddress(newOrderAddress)
      }
    } catch (error) {
      console.log('Error fetching member address:', error)
    }
  }

  // 開啟「選擇收件人」視窗
  const openAddressSelectModal = () => {
    fetchMemberAddress()
    setIsSelectModalOpen(true)
  }

  // 關閉「選擇收件人」視窗
  const closeAddressSelectModal = () => {
    setIsSelectModalOpen(false)
  }

  // 開啟「新增收件人」視窗
  const openAddressAddModal = () => {
    setIsAddressAddModalOpen(true)
  }

  // 關閉「新增收件人」視窗
  const closeAddressAddModal = () => {
    setIsAddressAddModalOpen(false)
  }

  // 開啟「編輯收件人」視窗
  const openAddressEditModal = () => {
    setIsAddressEditModalOpen(true)
  }

  // 關閉「編輯收件人」視窗
  const closeAddressEditModal = () => {
    setIsAddressEditModalOpen(false)
  }

  // 刪除會員地址
  const handleAddressDelete = async (addressId) => {
    try {
      const response = await fetch(`${CHECKOUT_DELETE_ADDRESS}/${addressId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (data.success) {
        fetchMemberAddress() // 成功刪除後，更新前端會員地址資料
        openSnackbar('已成功刪除地址', 'success')
        if (addressId === orderAddress.id) {
          setOrderAddress(null)
        }
        console.log(`delete address is: ${addressId}`)
      } else {
        console.error('地址刪除失敗', data)
      }
    } catch (error) {
      console.error('刪除地址時出錯', error)
    }
  }

  // 使用會員地址
  const handleSelectAddress = (addressId) => {
    setNewAddressId(addressId)
    openSnackbar('收件人地址已變更！', 'success')
    closeAddressSelectModal()
  }

  // 提交新增地址表單
  const handleAddAddressSubmit = async (addAddressData) => {
    try {
      const response = await axios.post(CHECKOUT_ADD_ADDRESS, addAddressData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log(response.data)

      if (response.data.success && !!response.data.addressId) {
        fetchMemberAddress()
        setNewAddressId(response.data.addressId)
        closeAddressAddModal()
        closeAddressSelectModal()
        openSnackbar('新增地址成功！', 'success')
      } else {
        openSnackbar('新增地址失敗！', 'error')
      }

      console.log('new added id', response.data.addressId)
    } catch (error) {
      console.error('新增地址錯誤', error)
    }
  }

  // 提交編輯地址表單
  const handleEditAddressSubmit = async (formData) => {
    try {
      const response = await axios.post(CHECKOUT_EDIT_ADDRESS, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log(response.data)

      if (response.data.success) {
        fetchMemberAddress()
        setNewAddressId(formData.id)
        closeAddressEditModal()
        closeAddressSelectModal()
        openSnackbar('編輯地址成功！', 'success')
      } else {
        openSnackbar('編輯地址失敗！', 'error')
      }

      console.log('edit id', formData.id)
    } catch (error) {
      console.error('編輯地址錯誤', error)
    }
  }

  // 進入編輯表單，取得 id
  const goToEditModal = (addressId) => {
    setEditId(addressId)
    setIsAddressEditModalOpen(true)
  }

  useEffect(() => {
    if (!!memberAddress) {
      const newOrderAddress = memberAddress.find((v) => v.id === newAddressId)
      if (newOrderAddress) {
        setOrderAddress(newOrderAddress)
      }
    }
  }, [memberAddress, newAddressId])

  return (
    <AddressContext.Provider
      value={{
        // 視窗開關
        isAddressSelectModalOpen,
        openAddressSelectModal,
        closeAddressSelectModal,
        isAddressAddModalOpen,
        openAddressAddModal,
        closeAddressAddModal,
        newAddressId, // 要設為訂單使用地址的 id
        openAddressEditModal,
        closeAddressEditModal,
        goToEditModal,
        editId,
        isAddressEditModalOpen,
        setIsAddressEditModalOpen,
        setNewAddressId,
        setOrderAddress, // 設定訂單使用地址
        fetchMemberAddress, // 取得會員所有資料庫 address table 資料
        memberAddress, // 會員所有資料庫 address table 資料
        orderAddress, // 本次訂單使用的地址
        handleAddressDelete, // 刪除指定地址
        handleSelectAddress, // 使用指定地址
        handleAddAddressSubmit,
        handleEditAddressSubmit,
      }}
    >
      {children}
    </AddressContext.Provider>
  )
}
