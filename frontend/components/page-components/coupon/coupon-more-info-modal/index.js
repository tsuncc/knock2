import styles from './coupon-more-info-modal.module.css'
// components
import ModalLayout from '../../checkout/address/modal-layout'
import CouponCard from '../coupon-card'
import CouponInfoRow from '../coupon-info-row'
import { formatIntlNumber } from '@/hooks/numberFormat'

export default function CouponMoreInfoModal({
  coupon,
  coupon_id,
  handleClose,
}) {
  const getCouponIntro = (discount_amount, discount_percentage) => {
    if (discount_amount) {
      return `結帳滿 ${formatIntlNumber(
        coupon.minimum_order
      )}元，即可折抵 ${formatIntlNumber(coupon.discount_amount)}元。`
    }
    if (discount_percentage) {
      return `結帳滿 ${formatIntlNumber(
        coupon.minimum_order
      )}元，即可享 ${formatIntlNumber(coupon.discount_percentage)} 折。`
    }
  }

  const getCouponDescription = (discount_amount, discount_percentage) => {
    if (discount_amount) {
      return `${coupon.coupon_type_name}滿 ${formatIntlNumber(
        coupon.minimum_order
      )}
        元（不含運費），即可折抵 ${formatIntlNumber(coupon.discount_amount)} 
        元。請在購物車/結帳頁內全站優惠券入口輸入或選用，同一帳號/同一人限使用 ${
          coupon.max_usage_per_user
        } 次。`
    }
    if (discount_percentage) {
      return `${coupon.coupon_type_name}滿 ${formatIntlNumber(
        coupon.minimum_order
      )}
        元（不含運費），即可享 ${formatIntlNumber(
          coupon.discount_percentage
        )} 折，最高折抵 ${
        coupon.discount_max
      } 元。請在購物車/結帳頁內全站優惠券入口輸入或選用，同一帳號/同一人限使用 ${
        coupon.max_usage_per_user
      } 次。`
    }
  }

  return (
    <ModalLayout
      title="優惠卷使用說明"
      modalHeight="720px"
      btnLeftHidden={true}
      btnTextRight="關閉"
      isOpen
      onClickRight={handleClose}
    >
      <div className={styles.couponModalBody}>
        <CouponCard
          coupon_name={coupon.coupon_name}
          minimum_order={coupon.minimum_order}
          valid_until={coupon.valid_until}
          btnHidden={true}
          selectable={false}
        />
        <div className={styles.couponTable}>
          <CouponInfoRow label="有效期限" content={coupon.valid_until} />
          <CouponInfoRow
            label="優惠內容"
            content={getCouponIntro(
              coupon.discount_amount,
              coupon.discount_percentage
            )}
          />
          <CouponInfoRow label="適用商品" content={coupon.coupon_type_name} />
          <CouponInfoRow
            label="優惠詳情"
            content={getCouponDescription(
              coupon.discount_amount,
              coupon.discount_percentage
            )}
          />
          {coupon.coupon_type_id === 2 && (
            <CouponInfoRow
              label="指定商品詳情"
              content={coupon.products.map((p) => p.product_name).join(', ')}
            />
          )}
        </div>
      </div>
    </ModalLayout>
  )
}
