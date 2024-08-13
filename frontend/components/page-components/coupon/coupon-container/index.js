import { useState, useEffect } from 'react'
import styles from './coupon-container.module.css'
import axios from 'axios'
import { useRouter } from 'next/router'
import AOS from 'aos'
// contexts
import { useAuth } from '@/context/auth-context'
// components
import CouponCard from '../coupon-card'
import UserHeader from '@/components/UI/user-header'
import UserPagination from '@/components/UI/user-pagination'
import NoData from '@/components/UI/no-data'
import CouponPromote from '../coupon-promote'
// api path
import { GET_MEMBER_COUPON } from '@/configs/api-path'

export default function CouponContainer({ status }) {
  const router = useRouter()
  const [pageCoupons, setPageCoupons] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [title, setTitle] = useState([])
  const { auth } = useAuth()

  // 取得會員優惠券
  const fetchMemberCoupons = async (memberId, page, status) => {
    try {
      const response = await axios.get(
        `${GET_MEMBER_COUPON}?member_id=${memberId}&page=${page}&status=${status}`
      )
      setPageCoupons(response.data.rows)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Error fetching member coupons: ', error)
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // 檢查 coupon_id 是否已存在 selectedCoupon 裡面（回傳 true or false）
  const getCoupon = (coupon_id) => {
    return pageCoupons.find((v) => v.coupon_id === coupon_id) || {}
  }

  useEffect(() => {
    switch (status) {
      case 'ongoing':
        setTitle('未使用')
        break
      case 'used':
        setTitle('已使用')
        break
      case 'expired':
        setTitle('已過期')
        break
    }
  }, [status])

  useEffect(() => {
    if (auth.id && !!status) {
      fetchMemberCoupons(auth.id, currentPage, status)
    }
  }, [auth.id, currentPage, status])

  useEffect(() => {
    AOS.init()
  }, [])

  useEffect(() => {
    AOS.refresh()
  }, [status, currentPage])

  return (
    <>
      <section
        key={status}
        className={styles.couponSection}
        data-aos="fade-right"
      >
        <div>
          <UserHeader title={`${title}的優惠券`} btnHidden={true} />
        </div>

        {status === 'ongoing' && <CouponPromote />}

        <div className={styles.couponBox}>
          {pageCoupons.length > 0 ? (
            pageCoupons.map((v) => (
              <CouponCard
                key={v.coupon_id}
                status={status}
                coupon_id={v.coupon_id}
                coupon_name={v.coupon_name}
                minimum_order={v.minimum_order}
                valid_until={v.valid_until}
                selectable={false} // 關閉 checkbox
                coupon={getCoupon(v.coupon_id)} // 傳遞這張 coupon card 的單一優惠券資訊到子層（coupon more info modal）
              />
            ))
          ) : (
            <div className={styles.span2}>
              <NoData text="無優惠券資料" backgroundColor="white" />
            </div>
          )}
        </div>
      </section>

      {/* {pageCoupons.length > 0 && (
        <UserPagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )} */}
    </>
  )
}
