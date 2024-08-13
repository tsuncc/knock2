import styles from './reservation-page.module.css'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
// contexts
import { useLoginModal } from '@/context/login-context'
import { useAuth } from '@/context/auth-context'
import { useConfirmDialog } from '@/context/confirm-dialog-context'
import { useSnackbar } from '@/context/snackbar-context'
// hooks
import usePayment from '@/hooks/usePayment'
import { formatPrice } from '@/hooks/numberFormat'
// components
import ReservationListCards from '../reservation-list-cards'
import RedirectionGuide from '@/components/UI/redirect-guide'
import UserPagination from '@/components/UI/user-pagination'
import ConfirmDialog from '@/components/UI/confirm-dialog'
// api path
import { GET_RESERVATION_LIST } from '@/configs/api-path'

export default function ReservationPage({ status }) {
  const { auth, authIsReady } = useAuth()
  const { loginFormSwitch } = useLoginModal()
  const router = useRouter()
  const [isLogin, setIsLogin] = useState()
  const [reservationData, setReservationData] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [cancelDialog, setCancelDialog] = useState('')
  const { handleReservationPayment, handleReservationCancel } = usePayment()
  const { openConfirmDialog } = useConfirmDialog()
  const { openSnackbar } = useSnackbar()

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // 取得行程預約記錄
  const fetchReservation = async (member_id, page, status) => {
    try {
      const response = await axios.get(
        `${GET_RESERVATION_LIST}?member_id=${member_id}&page=${page}&status=${status}`
      )
      setReservationData(response.data.rows)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Error fetching member coupons: ', error)
    }
  }

  // 重新付款
  const handlePayment = (
    reservation_status_id,
    reservation_date,
    reservation_id
  ) => {
    const currentDate = new Date().toJSON().slice(0, 10)

    // 未取消預約且還沒到預約日期前一天
    if (reservation_status_id !== 3 && reservation_date > currentDate) {
      return () => {
        handleReservationPayment(reservation_id)
      }
    }
  }

  // 取消訂單
  const handleCancel = (
    reservation_status_id,
    reservation_date,
    reservation_id,
    theme_name,
    branch_name
  ) => {
    const currentDate = new Date().toJSON().slice(0, 10)
    // 未取消預約且還沒到預約日期前一天
    if (reservation_status_id !== 3 && reservation_date > currentDate) {
      return async () => {
        setCancelDialog(
          `確定要取消 ${reservation_date} ${theme_name}（${branch_name}）的預約嗎？`
        )

        openConfirmDialog(async () => {
          const result = await handleReservationCancel(reservation_id)
          if (result.success) {
            openSnackbar('已取消行程預約', 'success')
          } else {
            openSnackbar('取消行程預約失敗', 'error')
          }
          fetchReservation(auth.id, currentPage, status)
        })
      }
    }
  }

  // 登入驗證
  useEffect(() => {
    if (router.isReady && authIsReady) {
      if (auth.id) {
        setIsLogin(true)
        fetchReservation(auth.id, currentPage, status)
      }
      if (!auth.id) {
        setIsLogin(false)
        loginFormSwitch('Login')
      }
    }
  }, [auth.id, router.isReady, authIsReady, currentPage, status])

  useEffect(() => {
    setCurrentPage(1)
  }, [status])


  return (
    <>
      {!isLogin && <RedirectionGuide />}
      {isLogin && (
        <div className={styles.listContainer}>
          {reservationData.map((v, i) => (
            <ReservationListCards
              key={v.reservation_id}
              index={i}
              reservation_date={v.reservation_date}
              theme_name={`${v.theme_name} / ${
                v.branch_name ? v.branch_name : ''
              }`}
              theme_img={`/themes-main/${v.theme_img}`}
              session={`${v.start_time} ~ ${v.end_time}`}
              participants={v.participants}
              deposit={formatPrice(v.deposit)}
              created_at={v.created_at}
              payment_date={v.payment_date}
              payment_type={v.payment_type}
              rtn_code={v.rtn_code}
              reservation_status_id={v.reservation_status_id}
              cancel={v.cancel}
              handleCancel={handleCancel(
                v.reservation_status_id,
                v.reservation_date,
                v.reservation_id,
                v.theme_name,
                v.branch_name
              )}
              handlePayment={handlePayment(
                v.reservation_status_id,
                v.reservation_date,
                v.reservation_id
              )}
            />
          ))}
        </div>
      )}

      {reservationData.length > 0 && (
        <UserPagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <ConfirmDialog
        dialogTitle={cancelDialog}
        btnTextRight="確定取消"
        btnTextLeft="取消"
      />
    </>
  )
}
