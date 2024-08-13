import React, { useState, useEffect } from 'react'
import styles from './invoice-paper.module.css'
import { useAuth } from '@/context/auth-context'
import useFetchOrderData from '@/hooks/fetchOrderDetails'
import Barcode from 'react-barcode'
import QRCode from 'react-qr-code'
import { useRouter } from 'next/router'
import NoData from '@/components/UI/no-data'
import BlackBtn from '@/components/UI/black-btn'
import OutlineBtn from '@/components/UI/outline-btn'

export default function InvoicePaper({ order_id }) {
  const router = useRouter()
  const { auth, authIsReady } = useAuth()
  const { order, detail, fetchOrderData } = useFetchOrderData()
  const [fetchReady, setFetchReady] = useState(false)
  const [wrongPath, setWrongPath] = useState(false)

  const formatDateRange = (value) => {
    const date = new Date(value)
    // 計算民國年份（西元年 - 1911）
    const taiwanYear = date.getFullYear() - 1911
    // 獲取月份（JavaScript 中月份是 0-11）
    const month = date.getMonth() + 1
    // 計算下一個月
    const nextMonth = month === 12 ? 1 : month + 1
    return `${taiwanYear}年 ${month}月-${nextMonth}月`
  }

  const formatInvoiceNo = (value) => {
    if (value) {
      return `${value.slice(0, 2)}-${value.slice(2)}`
    } else {
      return value
    }
  }

  const getBarcodeDate = (value) => {
    const date = new Date(value)
    const taiwanYear = date.getFullYear() - 1911
    const month = date.getMonth() + 1
    return `${taiwanYear}${month}`
  }

  const invoiceChecked = () => {
    if (
      !order ||
      order.invoice_rtn_code !== 1 ||
      !order.invoice_no ||
      !order.invoice_date ||
      !order.invoice_random_number
    ) {
      setWrongPath(true)
    } else {
      setWrongPath(false)
    }
  }
  useEffect(() => {
    if (router.isReady && authIsReady && auth.id) {
      if (order_id > 0) {
        fetchOrderData(order_id)
        setFetchReady(true)
      }
    }
  }, [auth.id, router.isReady, authIsReady])

  useEffect(() => {
    invoiceChecked(order)
  }, [order])

  return (
    <div className={styles.sectionContainer}>
      {wrongPath && <NoData text="錯誤路徑" />}
      {!wrongPath && (
        <div className={styles.taiwanInvoice}>
          <div className={styles.invoiceHeader}>
            <img src="/home/invoice-logo.svg" />
            <div className={styles.invoiceTitle}>電子發票證明聯</div>
            <div className={styles.invoiceSubTitle}>
              {formatDateRange(order.invoice_date)}
            </div>
            <div className={styles.invoiceSubTitle}>
              {formatInvoiceNo(order.invoice_no)}
            </div>
          </div>
          <div className={styles.invoiceInfo}>
            <div className={styles.row}>
              <div>{order.invoice_date}</div>
              <div>格式：25</div>
            </div>
            <div className={styles.row}>
              <div>隨機碼：{order.invoice_random_number}</div>
              <div>總計：{order.subtotal_price+order.deliver_fee-order.discountTotal}</div>
            </div>
            <div>賣方：66666666</div>
          </div>
          <div className={styles.barcodeBox}>
            <Barcode
              format="CODE39"
              width={2.25}
              height={30}
              displayValue={false}
              value={getBarcodeDate(order.invoice_date)}
            />
          </div>

          <div className={styles.qrcodeBox}>
            <QRCode
              value={`${order.invoice_date},${order.invoice_random_number}`}
              size={90}
            />
            <QRCode
              value={`${order.invoice_date},${order.invoice_random_number}`}
              size={90}
            />
          </div>
        </div>
      )}
      <div className={styles.btnStack}>
        <OutlineBtn
          btnText="返回"
          href={null}
          onClick={() => {
            router.back()
          }}
        />
        <BlackBtn
          btnText="列印"
          href={null}
          onClick={() => {
            window.print()
          }}
        />
      </div>
    </div>
  )
}
