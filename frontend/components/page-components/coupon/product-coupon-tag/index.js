import styles from './product-coupon-tag.module.css'
import { FaCircleCheck } from "react-icons/fa6";

export default function ProductCouponTag({coupon_name}) {
  return (
    <div className={styles.tagBox}>
      <FaCircleCheck/>{coupon_name}
    </div>
  )
}


