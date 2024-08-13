import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from './auth-context'
import { useSnackbar } from './snackbar-context'
import { useRouter } from 'next/router'
import {
  CHECKOUT_GET_CART,
  CHECKOUT_UPDATE_CART,
  CART_POST,
  CHECKOUT_GET_PROFILE,
  GET_MEMBER_COUPON,
  GET_MEMBER_COUPON_IN_CART,
  COUPON_GET_PRODUCT,
  COUPON_GET_USE,
  COUPON_REMOVE,
  COUPON_UPDATE_CART,
} from '@/configs/api-path'

const CartContext = createContext()

export const useCart = () => {
  return useContext(CartContext)
}

// 取得 local storage KKDevice id
const getDeviceId = () => {
  let deviceId = localStorage.getItem('kkDeviceId')
  if (!deviceId) {
    deviceId = Date.now() + parseInt(Math.random() * 9998 + 1)
    localStorage.setItem('kkDeviceId', deviceId)
  }
  return deviceId
}

export const CartProvider = ({ children }) => {
  const { auth, authIsReady } = useAuth() // 取得 auth.id, authIsReady
  const router = useRouter()
  const { openSnackbar } = useSnackbar() // success toast
  const [checkoutItems, setCheckoutItems] = useState([]) // 購物車內容
  const [checkoutTotal, setCheckoutTotal] = useState(0) // 購物車總金額(含運費)
  const [discountTotal, setDiscountTotal] = useState(0) // 購物車總金額
  const [subtotal, setSubtotal] = useState(0) // 購物車總金額
  const [deliverFee, setDeliverFee] = useState(120)
  const [cartBadgeQty, setCartBadgeQty] = useState(0) // 購物車商品項目數量
  const [memberProfile, setMemberProfile] = useState([]) // 取得會員基本資料
  // const [coupons, setCoupons] = useState([]) // 取得會員可使用優惠券
  const [usableCoupons, setUsableCoupons] = useState([]) // 取得會員可使用優惠券（所有商品）
  const [usableProductCoupons, setUsableProductCoupons] = useState([]) // 取得會員可使用優惠券(指定商品)
  const [selectedCoupons, setSelectedCoupons] = useState([])
  const [selectedProductCoupons, setSelectedProductCoupons] = useState([])
  const [excludeProductCouponTotal, setExcludeProductCouponTotal] = useState(0)

  // order submit form 內容
  const [formData, setFormData] = useState({
    memberId: 0,
    recipientName: '',
    recipientMobile: '',
    recipientDistrictId: 1,
    recipientAddress: '',
    memberInvoice: 0,
    mobileInvoice: '',
    recipientTaxId: '',
    orderItems: [],
  })

  // 取得會員基本資料
  const fetchMemberProfile = async () => {
    try {
      const response = await axios.get(
        `${CHECKOUT_GET_PROFILE}?member_id=${auth.id}`
      )
      if (response.data.status) {
        const results = response.data.rows[0]
        setMemberProfile(results)
        // 根據 profile 更新 formData
        setFormData((v) => ({
          ...v,
          mobileInvoice: results.invoice_carrier_id,
          recipientTaxId: results.tax_id,
        }))
      }
    } catch (error) {
      console.log('Error fetching member profile:', error)
    }
  }

  // 取得會員購物車 cart_member 資料
  const fetchMemberCart = async () => {
    const deviceId = +getDeviceId()
    const memberId = auth.id ? auth.id : deviceId

    try {
      const response = await fetch(`${CHECKOUT_GET_CART}?member_id=${memberId}`)

      if (!response.ok) {
        throw new Error('Failed to fetch member cart')
      }

      const data = await response.json()
      setCheckoutItems(data.rows)
      calculateTotal(data.rows)
    } catch (error) {
      console.log('Error fetching member cart:', error)
    }
  }

  // 取得會員可以使用的優惠券(所有商品)
  const fetchMemberCartCoupons = async () => {
    try {
      const response = await axios.get(
        `${GET_MEMBER_COUPON_IN_CART}?member_id=${auth.id}`
      )
      setUsableCoupons(response.data.rows)
      getSelectedCoupons()
    } catch (error) {
      console.error('Error fetching member coupons: ', error)
    }
  }

  // 取得會員可以使用的優惠券(指定商品)
  const fetchMemberCartProductCoupons = async () => {
    try {
      const response = await axios.get(
        `${COUPON_GET_PRODUCT}?member_id=${auth.id}`
      )
      setUsableProductCoupons(response.data.rows)
      getSelectedProductCoupons()
    } catch (error) {
      console.error('Error fetching member coupons: ', error)
    }
  }

  // 新增會員購物車優惠券
  const handleAddCouponToCart = async (coupon_id, product_id) => {
    try {
      await axios.post(COUPON_GET_USE, {
        member_id: auth.id,
        coupon_id: coupon_id,
        product_id: product_id,
      })
      await fetchMemberCart()
      fetchMemberCartCoupons()
      fetchMemberCartProductCoupons()
      calculateDiscountTotal()
      getSelectedCoupons()
      getSelectedProductCoupons()
    } catch (error) {
      console.error('Error adding coupon to cart:', error)
    }
  }

  // 刪除會員購物車優惠券
  const handleRemoveCouponFromCart = async (coupon_id, product_id) => {
    try {
      await axios.post(COUPON_REMOVE, {
        member_id: auth.id,
        coupon_id: coupon_id,
        product_id: product_id,
      })
      await fetchMemberCart()
      fetchMemberCartCoupons()
      fetchMemberCartProductCoupons()
      calculateDiscountTotal()
      getSelectedCoupons()
      getSelectedProductCoupons()
    } catch (error) {
      console.error('Error removing coupon from cart:', error)
    }
  }

  // 取得已選擇的全站優惠券
  const getSelectedCoupons = () => {
    const newSelectedCoupons = usableCoupons.filter((v) => v.in_cart === 1)
    setSelectedCoupons(newSelectedCoupons)
  }

  // 取得已選擇的商品優惠券
  // const getSelectedProductCoupons = () => {
  //   const newSelectedProductCoupons = usableProductCoupons
  //     .flatMap((coupon) => coupon.products)
  //     .filter((product) => product.in_cart > 0)
  //   setSelectedProductCoupons(newSelectedProductCoupons)
  // }

  const getSelectedProductCoupons = () => {
    const newSelectedProductCoupons = usableProductCoupons
      .flatMap((coupon) =>
        coupon.products.map((product) => ({
          coupon_id: coupon.coupon_id,
          used_at: coupon.used_at,
          coupon_name: coupon.coupon_name,
          coupon_type_id: coupon.coupon_type_id,
          minimum_order: coupon.minimum_order,
          discount_amount: coupon.discount_amount,
          discount_percentage: coupon.discount_percentage,
          discount_max: coupon.discount_max,
          valid_from: coupon.valid_from,
          valid_until: coupon.valid_until,
          max_usage_per_user: coupon.max_usage_per_user,
          total_limit: coupon.total_limit,
          coupon_type_name: coupon.coupon_type_name,
          product_id: product.product_id,
          product_name: product.product_name,
          price: product.price,
          in_cart: product.in_cart,
        }))
      )
      .filter((product) => product.in_cart > 0)
    setSelectedProductCoupons(newSelectedProductCoupons)
  }

  // 取得訂單總金額
  const calculateTotal = (items) => {
    let newCheckTotal = 0
    items.forEach((item) => {
      newCheckTotal += item.cart_product_quantity * item.price
    })

    newCheckTotal >= 1000 ? setDeliverFee(0) : setDeliverFee(120)
    setSubtotal(newCheckTotal)
    setCheckoutTotal(newCheckTotal + deliverFee - discountTotal)
  }

  // 取得折扣金額
  const calculateDiscountTotal = () => {
    // let productDiscountTotal = 0
    // let discountTotal = 0
    // let discountMaxTotal = 0
    // let discountMinTotal = 0
    // let discountPercentage = 0
    // let checkoutTotal = 0
    // let productDiscountOriginalPrice = 0

    let usingCouponItemsOriginalTotal = 0 // 所有使用優惠券的產品「原價」總額
    let usingCouponItemsDiscountTotal = 0 // 所有使用優惠券的產品「折價」總額

    // 篩選所有有使用優惠券產品
    const usingCouponItems = checkoutItems.filter(
      (item) =>
        item['cart_product_coupon_id'] !== null &&
        item['cart_product_coupon_id'] !== undefined
    )

    usingCouponItems.forEach((item) => {
      // 單一產品原價總額
      const itemOriginalPrice = item.cart_product_quantity * item.price
      // 所有使用優惠券的產品原價總額
      usingCouponItemsOriginalTotal += itemOriginalPrice
      // 單一產品折扣總額
      let itemDiscount = 0
      if (item.discount_amount) {
        if (
          itemOriginalPrice >= (item.minimum_order ?? 0) &&
          itemOriginalPrice >= (item.discount_amount ?? 0)
        ) {
          itemDiscount = item.discount_amount ?? 0
        }
      } else if (item.discount_percentage) {
        if (itemOriginalPrice >= (item.minimum_order ?? 0)) {
          const percentage = (1 - item.discount_percentage / 100).toFixed(2)
          const discount = Math.floor(itemOriginalPrice * percentage)
          console.log(percentage,itemOriginalPrice, discount  );

          itemDiscount =
            discount >= (item.discount_max ?? 0)
              ? item.discount_max ?? discount
              : discount
        }
      }
      usingCouponItemsDiscountTotal += itemDiscount
    })

    // 扣除已使用產品優惠券的總額
    const excludeCouponItemTotal = subtotal - usingCouponItemsOriginalTotal

    let generalDiscount = 0 // 全站優惠折扣
    let generalPercentage = 0 // 全站優惠百分比
    let generalDiscountMaX = 0 // 全站優惠最高折扣
    let generalDiscountMin = 0 // 全站優惠最低總額

    // 尋找本次訂單使用的優惠券
    selectedCoupons.forEach((item) => {
      if (item.discount_amount) {
        generalDiscount = item.discount_amount
        generalDiscountMaX = item.discount_max ?? 0

        generalDiscountMin = item.minimum_order ?? 0
      } else if (item.discount_percentage) {
        generalPercentage = (1 - item.discount_percentage / 100).toFixed(2)
        generalDiscountMaX = item.discount_max ?? 0
        generalDiscountMin = item.minimum_order ?? 0
      }
    })

    let generalDiscountTotal = 0

    if (excludeCouponItemTotal > generalDiscountMin) {
      if (generalDiscount > 0) {
        generalDiscountTotal = generalDiscount
      } else if (generalPercentage > 0) {
        generalDiscountTotal = Math.floor(
          excludeCouponItemTotal * generalPercentage
        )
      }
    }

    let finalDiscount = 0
    finalDiscount = generalDiscountTotal + usingCouponItemsDiscountTotal

    setDiscountTotal(finalDiscount)
    setExcludeProductCouponTotal(excludeCouponItemTotal)

    // console.log({
    //   finalDiscount,
    //   excludeCouponItemTotal,
    //   generalDiscountTotal,
    //   usingCouponItemsDiscountTotal,
    //   usingCouponItemsOriginalTotal,
    // })
  }

  // const calculateDiscountTotal = () => {
  //   let productDiscountTotal = 0
  //   let discountTotal = 0
  //   let discountMaxTotal = 0
  //   let discountMinTotal = 0
  //   let discountPercentage = 0
  //   let checkoutTotal = 0
  //   let productDiscountOriginalPrice = 0

  //   checkoutItems.forEach((item) => {
  //     let productDiscount = 0
  //     checkoutTotal += item.cart_product_quantity * item.price

  //     if (item.coupon_type_id === 2) {
  //       const originalPrice = item.price * item.cart_product_quantity

  //       if (item.discount_amount) {
  //         if (
  //           originalPrice >= item.minimum_order &&
  //           originalPrice >= item.discount_amount
  //         ) {
  //           productDiscount = item.discount_amount
  //           productDiscountOriginalPrice +=
  //             item.cart_product_quantity * item.price
  //         }
  //       } else if (item.discount_percentage) {
  //         if (originalPrice >= item.minimum_order) {
  //           productDiscount = Math.floor(
  //             originalPrice * (1 - item.discount_percentage / 100)
  //           )
  //           productDiscount =
  //             productDiscount >= item.discount_max
  //               ? item.discount_max
  //               : productDiscount
  //           productDiscountOriginalPrice +=
  //             item.cart_product_quantity * item.price
  //         }
  //       }
  //       productDiscountTotal += productDiscount
  //     }
  //   })

  //   usableCoupons.forEach((item) => {
  //     if (item.in_cart === 1) {
  //       discountMaxTotal += item.discount_max
  //       discountMinTotal += item.minimum_order
  //       if (item.discount_amount) {
  //         discountTotal += item.discount_amount
  //       } else if (item.discount_percentage) {
  //         discountPercentage = 1 - item.discount_percentage / 100
  //       }
  //     }
  //   })

  //   let finalDiscount = 0
  //   const excludeProductTotal = checkoutTotal - productDiscountOriginalPrice
  //   if (excludeProductTotal > discountMinTotal) {
  //     const excludeProductDiscount =
  //       discountTotal + Math.floor(discountPercentage * excludeProductTotal)
  //     finalDiscount = excludeProductDiscount > discountMaxTotal ? discountMaxTotal : excludeProductDiscount
  //   }
  //   finalDiscount += productDiscountTotal
  //   setDiscountTotal(finalDiscount)
  //   setExcludeProductCouponTotal(excludeProductTotal)
  // }

  // 記錄商品數量異動
  const handleQuantityChange = async (productId, newQuantity) => {
    const updatedItems = checkoutItems.map((v) =>
      v.product_id === productId
        ? { ...v, cart_product_quantity: newQuantity }
        : v
    )

    const itemToUpdate = updatedItems.find((v) => v.product_id === productId)

    const deviceId = getDeviceId()
    const memberId = auth.id ? auth.id : deviceId

    try {
      const response = await axios.put(
        `${CHECKOUT_UPDATE_CART}/${itemToUpdate.cart_id}`,
        {
          member_id: memberId,
          cart_product_quantity: newQuantity,
        }
      )

      if (!response.data.success) {
        throw new Error('Failed to update cart item quantity')
      }

      fetchMemberCart()
    } catch (error) {
      console.log('Error updating cart item quantity:', error)
    }
  }

  // 點擊「加入購物車」（actionType = buy 直接購買 or add 加入購物車）
  const handleAddToCart = async (
    selectedProductId,
    selectedProductName,
    cartProductQuantity,
    actionType
  ) => {
    if (!cartProductQuantity || cartProductQuantity < 0) {
      alert('請選擇商品數量')
      return
    }

    const deviceId = +getDeviceId()
    const memberId = auth.id ? auth.id : deviceId

    try {
      const response = await axios.post(CART_POST, {
        memberId: memberId,
        productId: selectedProductId,
        cartQty: cartProductQuantity,
      })

      if (response.data.success) {
        fetchMemberCart()
        openSnackbar(
          `商品「${selectedProductName}」（共${cartProductQuantity}個）已加入購物車！`,
          'success'
        )
      } else {
        console.error('Failed to add item to cart')
      }
    } catch (error) {
      console.error('Error adding item to cart:', error)
    }

    if (actionType === 'buy') {
      window.location.href = '/checkout'
    }
  }

  // 初始化購物車
  const clearCart = () => {
    setCheckoutItems([])
    setCheckoutTotal(0)
    setDeliverFee(120)
  }

  const calculateProductDiscount = (
    price,
    product_quantity,
    discount_amount,
    discount_percentage,
    minimum_order
    // discount_max
  ) => {
    let discountPrice = 0
    minimum_order = !minimum_order ? 0 : minimum_order
    const productOriginalTotal = price * product_quantity
    if (discount_amount) {
      if (
        productOriginalTotal >= minimum_order &&
        productOriginalTotal >= discount_amount
      ) {
        discountPrice = price - discount_amount
        // discountPrice = discountPrice >= discount_max ? discountPrice : price
      }
    } else if (discount_percentage) {
      if (productOriginalTotal >= minimum_order) {
        const percentage = (discount_percentage / 100).toFixed(2)
        discountPrice = Math.floor(price * percentage)
        // discountPrice = discountPrice >= discount_max ? discountPrice : price
      }
    }
    return discountPrice
  }

  // 登入後，更新 cart_member cart 將原本未登入的 device_id 改成 auth.id
  const handleLogin = async () => {
    const deviceId = +getDeviceId()
    const memberId = auth.id

    try {
      const updateResponse = await axios.post(COUPON_UPDATE_CART, {
        memberId,
        deviceId,
      })

      if (updateResponse.data.success) {
        fetchMemberCart()
      } else {
        console.error('Failed to update cart_member_id')
      }
    } catch (error) {
      console.error('Failed to update cart_member_id')
    }
  }

  // useEffect(() => {
  //   handleSelectedCoupons()
  //   handleSelectedProductCoupons()
  // }, [checkoutItems, usableCoupons])

  // 登入判斷
  useEffect(() => {
    if (router.isReady && authIsReady) {
      if (auth.id) {
        handleLogin()
        fetchMemberCart()
        calculateDiscountTotal()
        fetchMemberCartCoupons()
        fetchMemberCartProductCoupons()
        getSelectedCoupons()
        getSelectedProductCoupons()
      }
      if (!auth.id) {
        clearCart()
        fetchMemberCart()
      }
    }
  }, [auth.id, router.isReady, authIsReady])

  useEffect(() => {
    setCartBadgeQty(checkoutItems.length)
  }, [checkoutItems])


  // useEffect(() => {
  //   fetchMemberCart()
  // }, [discountTotal])


  useEffect(() => {
    calculateDiscountTotal()
    getSelectedCoupons()
    getSelectedProductCoupons()
  }, [checkoutItems, usableCoupons, usableProductCoupons])

  useEffect(() => {
    fetchMemberCart()
  }, [usableCoupons, usableProductCoupons])

  return (
    <CartContext.Provider
      value={{
        checkoutItems,
        setCheckoutItems,
        cartBadgeQty,
        subtotal,
        deliverFee,
        checkoutTotal,
        discountTotal,
        setDiscountTotal,
        usableCoupons,
        usableProductCoupons,
        handleAddToCart,
        handleQuantityChange,
        clearCart,
        memberProfile,
        fetchMemberProfile,
        formData,
        setFormData,
        handleAddCouponToCart,
        handleRemoveCouponFromCart,
        fetchMemberCart,
        fetchMemberCartCoupons,
        fetchMemberCartProductCoupons,
        selectedCoupons,
        selectedProductCoupons,
        excludeProductCouponTotal,
        calculateProductDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
