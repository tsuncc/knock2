import { useState, useCallback } from 'react'

export const useOrderValidation = () => {
  const [errors, setErrors] = useState({})
  const timeout = 1000

  const validateField = useCallback((name, value) => {
    let errorText = ''
    const nameRegex = /^[a-zA-Z\u4e00-\u9fa5 -]*$/ // 姓名欄位驗證
    const taxRegex = /^\d{8}$/ // 統一編號驗證
    const mobileRegex = /^09\d{8}$/ // 手機號碼驗證
    const addressRegex = /^[a-zA-Z\u4e00-\u9fa5\d]*$/ // 地址欄位驗證
    const mobileInvoiceRegex = /^\/[0-9A-Z.+-]{7}$/ // 手機載具驗證

    if (value === '') {
      errorText = '必填'
    }

    if (name === 'recipientCityId' && value === 0) {
      errorText = '必填'
    }

    if (name === 'recipientDistrictId' && value === 0) {
      errorText = '必填'
    }

    if (!!value) {
      if (name === 'recipientName' && !nameRegex.test(value))
        errorText = '只能包含中文、英文'
      if (name === 'recipientMobile' && !mobileRegex.test(value)) {
        errorText = '格式不符'
      }
      if (name === 'recipientAddress' && !addressRegex.test(value)) {
        errorText = '只能包含中文、英文和數字'
      }
      if (name === 'mobileInvoice' && !mobileInvoiceRegex.test(value)) {
        errorText = '格式不符'
      }
      if (name === 'recipientTaxId' && !taxRegex.test(value)) {
        errorText = '格式不符'
      }
    }

    setErrors((v) => ({
      ...v,
      [name]: errorText,
    }))
  }, [])

  const clearError = useCallback((name) => {
    setErrors((v) => ({
      ...v,
      [name]: '',
    }))
  }, [])

  return {
    errors,
    clearError,
    validateField,
    timeout,
  }
}
