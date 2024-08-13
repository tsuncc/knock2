import { z } from 'zod'

// Helper to remove '-' from mobile
const sanitizeMobile = (mobile_phone) => mobile_phone.replace(/-/g, '')

// Form validation schema
const schemaForm = z.object({
  name: z
    .string()
    .min(2, {
      message: '請填寫姓名，長度為 2 ~ 20 個字元',
    })
    .max(20, {
      message: '請填寫姓名，長度為 2 ~ 20 個字元',
    }),
  nick_name: z
    .string()
    .min(1, {
      message: '請填寫暱稱，長度勿超過 50 字元',
    })
    .max(50, {
      message: '請填寫暱稱，長度勿超過 50 字元',
    }),
  birthday: z
    .string()
    .transform((val) => val || '')
    .nullable(),
  mobile_phone: z
    .string({
      message: '請填寫正確電話號碼',
    })
    .nullable()
    .transform((val) => sanitizeMobile(val || ''))
    .refine(
      (val) => {
        if (val === '') return true
        const mobilePattern = /^09\d{2}\d{3}\d{3}$/
        return mobilePattern.test(val)
      },
      {
        message: '請填寫正確電話號碼',
      }
    ),

  invoice_carrier_id: z
    .string({
      required_error: '請填寫正確載具號碼',
    })
    .nullable()
    .transform((val) => val || '')
    .refine((val) => val === '' || /^\/[A-Z0-9]{7}$/.test(val), {
      message: '請填寫正確載具號碼',
    }),
  tax_id: z
    .string()
    .nullable()
    .transform((val) => val || '')
    .refine((val) => val === '' || /^\d{8}$/.test(val), {
      message: '請填寫正確統編號碼',
    }),
})

export default schemaForm
