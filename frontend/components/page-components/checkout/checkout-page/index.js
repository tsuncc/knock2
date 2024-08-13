// checkout page body
import React, { useState, useEffect } from 'react'
import styles from './checkout-page.module.css'
import axios from 'axios'
import { useRouter } from 'next/router'
// context
import { useCart } from '@/context/cart-context'
import { useAuth } from '@/context/auth-context'
import { useLoginModal } from '@/context/login-context'
import { useAddress } from '@/context/address-context'
import useScreenSize from '@/hooks/useScreenSize'
import { useSnackbar } from '@/context/snackbar-context'
// hooks
import { useOrderValidation } from '@/hooks/orderValidation'
import usePayment from '@/hooks/usePayment'
// components
import OrderItemCheckout from '../../orders/order-item-checkout'
import BlackBtn from '@/components/UI/black-btn'
import RecipientButton from '../address/recipient-button'
import RecipientButtonSelected from '../address/recipient-button-selected'
import SelectAddressModal from '../address/select-address-modal'
import OrderInputBox from '../order-input-box'
import OrderSelectBox from '../order-select-box'
import CheckoutTotalTable from '../checkout-total-table'
import EmptyCart from '@/components/page-components/checkout/empty-cart'
import RedirectionGuide from '@/components/UI/redirect-guide'
import CouponSelectModal from '../../coupon/coupon-select-modal'
// api path
import { CHECKOUT_POST } from '@/configs/api-path'

export default function CheckoutPage() {
  const router = useRouter()
  const { auth, authIsReady } = useAuth() // 取得 auth.id, authIsReady
  const { loginFormSwitch } = useLoginModal() // 取得登入視窗開關
  const { timeout, errors, validateField } = useOrderValidation() // 訂單驗證
  const [invoiceTypeValue, setInvoiceTypeValue] = useState('member')
  const { handleOrderPayment } = usePayment()
  const userClientWidth = useScreenSize()
  const { openSnackbar } = useSnackbar()
  const [screenWidth, setScreenWidth] = useState(userClientWidth)
  const {
    isAddressSelectModalOpen,
    openAddressSelectModal,
    closeAddressSelectModal,
    fetchMemberAddress,
    memberAddress,
    orderAddress,
  } = useAddress()

  // 取得會員購物車資料、更新訂單總金額、接收商品數量變化
  const {
    checkoutItems,
    checkoutTotal,
    subtotal,
    cartBadgeQty,
    clearCart,
    deliverFee,
    fetchMemberProfile,
    formData,
    setFormData,
    selectedCoupons,
    calculateDiscountTotal,
    usableCoupons,
    useableProductCoupons,
    // selectedCoupons,
    discountTotal,
  } = useCart()

  // 發票形式
  const invoiceTypeOption = [
    { value: 'member', text: '會員載具' },
    { value: 'mobile', text: '手機載具' },
    { value: 'tax', text: '統一編號' },
  ]

  // 控制表單輸入欄位，更新 formData
  const handleInputChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })

    // 表單驗證
    setTimeout(() => {
      validateField(name, value)
    }, timeout)
  }

  // 表單驗證
  const handleBlur = (e) => {
    const { name, value } = e.target
    validateField(name, value)
  }

  // 辨識發票類別
  const handleInvoiceTypeChange = (e) => {
    const value = e.target.value
    setInvoiceTypeValue(value)
  }

  // 送出表單
  const handleSubmit = async (e) => {
    e.preventDefault()

    // 取得收件人資料
    const recipientData = memberAddress.filter((v) => v.selected === true)

    // 將 checkoutItems 轉換為 orderItems 格式
    const orderItems = checkoutItems.map((item) => ({
      productId: item.product_id,
      productOriginalPrice: item.price,
      orderQty: item.cart_product_quantity,
      cartProductCouponId: item.cart_product_coupon_id,
      
    }))

    // 根據發票形式設置 formData
    let updatedFormData = { ...formData }

    if (invoiceTypeValue === 'member') {
      updatedFormData = {
        ...updatedFormData,
        memberInvoice: 1,
        mobileInvoice: '',
        recipientTaxId: '',
      }
    } else if (invoiceTypeValue === 'mobile') {
      updatedFormData = {
        ...updatedFormData,
        memberInvoice: 0,
        mobileInvoice: formData.mobileInvoice,
        recipientTaxId: '',
      }
      errors.recipientTaxId = ''
    } else if (invoiceTypeValue === 'tax') {
      updatedFormData = {
        ...updatedFormData,
        memberInvoice: 0,
        mobileInvoice: '',
        recipientTaxId: formData.recipientTaxId,
      }
      errors.mobileInvoice = ''
    }

    // 驗證手機載具、統一編號
    validateField('mobileInvoice', formData.mobileInvoice)
    validateField('recipientTaxId', formData.recipientTaxId)

    if (errors.mobileInvoice || errors.recipientTaxId) {
      alert('請確認欄位')
      return
    }

    let orderCouponId = null

    if (selectedCoupons.length > 0) {
      orderCouponId = selectedCoupons[0].coupon_id
    }

    const dataToSubmit = {
      ...updatedFormData,
      memberId: auth.id,
      recipientName: orderAddress.recipient_name, // 收件人姓名
      recipientMobile: orderAddress.mobile_phone, // 收件人手機號碼
      recipientDistrictId: orderAddress.district_id, // 收件人區域 ID
      recipientAddress: orderAddress.address, // 收件人地址
      deliverFee,
      orderCouponId: orderCouponId,
      orderItems, // 將 orderItems 加入到要提交的數據中
    }

    try {
      const response = await axios.post(CHECKOUT_POST, dataToSubmit)
      if (response.data.success) {
        const orderId = response.data.orderId // 取得後端返回的 order_id
        clearCart()
        openSnackbar('訂單已成立', 'success')
        await handleOrderPayment(orderId, checkoutTotal)
      }
    } catch (error) {
      console.error('提交表單時出錯', error)
    }
  }

  // 監聽視窗寬度
  useEffect(() => {
    setScreenWidth(userClientWidth)
  }, [userClientWidth])

  // 登入驗證
  useEffect(() => {
    if (router.isReady && authIsReady) {
      if (auth.id) {
        fetchMemberAddress()
        fetchMemberProfile()
      }
      if (!auth.id) {
        loginFormSwitch('Login')
      }
    }
  }, [auth.id, router.isReady, authIsReady])

  // 未登入顯示的內容
  if (!auth.id && authIsReady) {
    return <RedirectionGuide />
  }

  return (
    <section className={styles.sectionContainer}>
      <h2 className={styles.h2Style}>結帳</h2>
      {cartBadgeQty <= 0 && (
        <div className={styles.contentContainer}>
          <EmptyCart />
        </div>
      )}

      {cartBadgeQty > 0 && (
        <form
          id="_form_aiochk"
          method="post"
          name="checkoutForm"
          onSubmit={handleSubmit}
          className={styles.contentContainer}
        >
          {/* LEFT ORDER INFO START */}
          <div className={styles.checkoutLeft}>
            <h5>訂購資訊</h5>
            {/* OrderItemCheckout */}
            <div className={styles.itemList}>
              <OrderItemCheckout type={screenWidth < 640 ? 'small' : 'def'} />
            </div>

            <CouponSelectModal />

            {/* 訂單金額 */}
            <CheckoutTotalTable
              subtotal={subtotal}
              deliverFee={deliverFee}
              totalDiscount={discountTotal}
              checkoutTotal={checkoutTotal}

            />
          </div>

          {/* RIGHT RECIPIENT INFO START */}
          <div className={styles.checkoutRight}>
            <h5>收件資料</h5>
            {/* RecipientButton */}
            <div className={styles.checkoutRightMain}>
              {isAddressSelectModalOpen && (
                <SelectAddressModal onClose={closeAddressSelectModal} />
              )}
              {orderAddress ? (
                <RecipientButtonSelected
                  key={orderAddress.id}
                  recipientName={orderAddress.recipient_name}
                  recipientMobile={orderAddress.mobile_phone}
                  address={
                    orderAddress.city_name +
                    orderAddress.district_name +
                    orderAddress.address
                  }
                />
              ) : (
                <RecipientButton onClick={openAddressSelectModal} />
              )}
              <OrderSelectBox
                name="invoice_type"
                label="發票形式"
                placeholder="請選擇"
                value={invoiceTypeValue}
                options={invoiceTypeOption}
                onChange={handleInvoiceTypeChange}
              />
              {invoiceTypeValue === 'mobile' && (
                <OrderInputBox
                  name="mobileInvoice"
                  label="手機載具"
                  value={formData.mobileInvoice}
                  errorText={errors.mobileInvoice || ''}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
              )}
              {invoiceTypeValue === 'tax' && (
                <OrderInputBox
                  name="recipientTaxId"
                  label="統一編號"
                  value={formData.recipientTaxId}
                  errorText={errors.recipientTaxId || ''}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
              )}
            </div>

            <BlackBtn
              btnText="前往付款"
              type="submit"
              href={null}
              paddingType="medium"
              className={styles.btnStyle}
            />
          </div>
        </form>
      )}
    </section>
  )
}
