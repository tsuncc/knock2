import styles from './coupon-select-modal.module.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
// context
import { useCart } from '@/context/cart-context'
import { useAuth } from '@/context/auth-context'
import { useLoginModal } from '@/context/login-context'
import { useSnackbar } from '@/context/snackbar-context'
// components
import ModalLayout from '../../checkout/address/modal-layout'
import CouponCard from '@/components/page-components/coupon/coupon-card'
import NoData from '@/components/UI/no-data'
import TinyButton from '@/components/UI/tiny-button'
import CheckoutCouponBtn from '../../checkout/checkout-coupon-btn'
import ProductCouponTag from '../product-coupon-tag'
import FilterBtn from '@/components/UI/filter-btn'

export default function CouponSelectModal({ type = 'all', product_id = 0 }) {
  const {
    checkoutItems,
    usableCoupons,
    usableProductCoupons,
    handleAddCouponToCart,
    handleRemoveCouponFromCart,
    selectedCoupons,
    selectedProductCoupons,
    excludeProductCouponTotal,
  } = useCart()
  const { auth, authIsReady } = useAuth()
  const router = useRouter()
  const { loginFormSwitch } = useLoginModal() // 取得登入視窗開關
  const [isLogin, setIsLogin] = useState(false)
  const { openSnackbar } = useSnackbar()
  const [itemCouponName, setItemCouponName] = useState(null)
  const [open, setOpen] = useState(false)
  const handleOpen = () => {
    if (isLogin) {
      setOpen(true)
    } else {
      loginFormSwitch('Login')
    }
  }
  const handleClose = () => setOpen(false)
  const [wholeSiteCouponContent, setWholeSiteCouponContent] =
    useState('選擇全站優惠券')

  // 傳遞指定 coupon 內容給優惠券詳情 modal
  const getCoupon = (coupon_id) => {
    if (type === 'product') {
      return usableProductCoupons.find((v) => v.coupon_id === coupon_id) || {}
    }
    return usableCoupons.find((v) => v.coupon_id === coupon_id) || {}
  }

  const getProductCoupon = () => {
    return usableProductCoupons.filter((coupon) =>
      coupon.products.some((product) => product.product_id === product_id)
    )
  }

  const modalCoupons =
    type === 'product' ? getProductCoupon(product_id) : usableCoupons

  // const getInCartValue = (products) => {
  //   const product = products.find((v) => v.product_id === product_id)
  //   return product ? product.in_cart : 0
  // }

  // const isChecked = (products, in_cart, disabled) => {
  //   if (disabled) {
  //     return false
  //   } else {
  //     if (!products) {
  //       return in_cart === 1 ? true : false
  //     } else {
  //       return getInCartValue(products) === 1 ? true : false
  //     }
  //   }
  // }

  const isChecked = (coupon_id) => {
    if (type === 'product') {
      return selectedProductCoupons.some(
        (v) => v.coupon_id === coupon_id && v.product_id === product_id
      )
    } else {
      return selectedCoupons.some((v) => v.coupon_id === coupon_id)
    }
  }

  const handleToggleCoupon = async (coupon_id, isChecked) => {
    if (isChecked) {
      await handleRemoveCouponFromCart(coupon_id, product_id)
      openSnackbar('不套用優惠券', 'success')
    }
    if (!isChecked) {
      if (type === 'product') {
        for (const coupon of selectedProductCoupons) {
          if (coupon.coupon_id === coupon_id) {
            await handleRemoveCouponFromCart(coupon_id, coupon.product_id)
          }
        }
      }
      if (type === 'all') {
        for (const coupon of selectedCoupons) {
          handleRemoveCouponFromCart(coupon.coupon_id, product_id)
        }
      }
      handleAddCouponToCart(coupon_id, product_id)
      openSnackbar('已套用優惠券', 'success')
    }
  }

  // const handleToggleCoupon = (coupon_id, isChecked) => {
  //   if (isChecked) {
  //     handleRemoveCouponFromCart(coupon_id, product_id)
  //     openSnackbar('不套用優惠券', 'success')
  //   } else {
  //     if (type === 'product') {
  //       handleAddCouponToCart(coupon_id, product_id)

  //       const removeOtherProductCoupons = selectedProductCoupons.filter(
  //         (v) => v.coupon_id === coupon_id && v.product_id !== product_id
  //       )
  //       removeOtherProductCoupons.forEach((coupon) => {
  //         handleRemoveCouponFromCart(coupon.coupon_id, coupon.product_id)
  //       })
  //     } else {
  //       handleAddCouponToCart(coupon_id, product_id)
  //     }
  //     openSnackbar('已套用優惠券', 'success')
  //   }
  // }

  // const getItemCouponBtn = () => {
  //   let btnText
  //   if (product_id) {
  //     const findProductCoupon = selectedProductCoupons.find(
  //       (v) => v.product_id === product_id
  //     )
  //     btnText = findProductCoupon
  //       ? findProductCoupon.coupon_name
  //       : '請選擇優惠券'
  //   } else {
  //     btnText = '請選擇優惠券'
  //   }
  //   setItemCouponBtn(btnText)
  // }

  const getItemCouponName = () => {
    let couponName
    if (product_id) {
      const findProductCoupon = selectedProductCoupons.find(
        (v) => v.product_id === product_id
      )
      if (findProductCoupon) {
        couponName = findProductCoupon.coupon_name
      }
    }
    setItemCouponName(couponName)
  }

  const getWholeSiteCoupons = () => {
    if (selectedCoupons.length > 0) {
      const couponNames = selectedCoupons.map((v) => v.coupon_name).join(', ')
      setWholeSiteCouponContent(couponNames)
    } else {
      setWholeSiteCouponContent('請選擇優惠券')
    }
  }

  const disabledChecked = (coupon_id) => {
    let disabled
    if (type === 'product') {
      const product = checkoutItems.find((v) => v.product_id === product_id)
      const { price, cart_product_quantity } = product
      const productOriginTotal = price * cart_product_quantity
      const coupon = usableProductCoupons.find((v) => v.coupon_id === coupon_id)
      disabled = productOriginTotal >= coupon.minimum_order ? false : true
    } else {
      const coupon = usableCoupons.find((v) => coupon_id === coupon_id)
      disabled = excludeProductCouponTotal > coupon.minimum_order ? false : true
    }

    return disabled
  }

  const goToGetCoupon = () => {
    router.push('/coupon')
  }

  // useEffect(() => {
  //   if (product_id !== null) {
  //     getItemCouponBtn()
  //   }
  // }, [selectedProductCoupons, product_id])

  useEffect(() => {
    if (product_id !== null) {
      getItemCouponName()
    }
  }, [selectedProductCoupons, product_id])

  useEffect(() => {
    if (selectedCoupons) {
      getWholeSiteCoupons()
    }
  }, [selectedCoupons])

  useEffect(() => {
    if (router.isReady && authIsReady) {
      auth.id ? setIsLogin(true) : setIsLogin(false)
    }
  }, [auth.id, router.isReady, authIsReady])

  return (
    <>
      {type === 'product' ? (
        <div className={styles.productCouponBtnStack}>
          <TinyButton
            type="button"
            btnText="優惠券"
            href={null}
            onClick={handleOpen}
          />
          {itemCouponName && <ProductCouponTag coupon_name={itemCouponName} />}
        </div>
      ) : (
        <CheckoutCouponBtn
          onClick={handleOpen}
          content={wholeSiteCouponContent}
        />
      )}

      {modalCoupons.length >= 0 && (
        <>
          <ModalLayout
            title="選擇優惠券"
            modalHeight="720px"
            btnTextRight="關閉"
            btnLeftHidden={true}
            onClickRight={handleClose}
            isOpen={open}
          >
            <div className={styles.modalContentBox}>
              {modalCoupons.length === 0 ? (
                <NoData text="無優惠券" />
              ) : (
                modalCoupons.map((v) => (
                  <CouponCard
                    key={v.coupon_id}
                    status="ongoing"
                    coupon_id={v.coupon_id}
                    coupon_name={v.coupon_name}
                    minimum_order={v.minimum_order}
                    valid_until={v.valid_until}
                    // isChecked={isChecked(
                    //   v.products,
                    //   v.in_cart,
                    //   disabledChecked(v.coupon_id)
                    // )}
                    isChecked={isChecked(v.coupon_id)}
                    handelSelectedToggle={() =>
                      handleToggleCoupon(v.coupon_id, isChecked(v.coupon_id))
                    }
                    coupon={getCoupon(v.coupon_id)} // 傳遞這張 coupon card 的單一優惠券資訊到子層（coupon more info modal）
                    disabled={disabledChecked(v.coupon_id)}
                  />
                ))
              )}

              <FilterBtn btnText="優惠券抽獎活動" onClick={goToGetCoupon} />
            </div>
          </ModalLayout>
        </>
      )}
    </>
  )
}
