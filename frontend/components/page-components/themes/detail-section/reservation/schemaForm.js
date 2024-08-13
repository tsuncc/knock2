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
  mobile_phone: z
    .string({
      required_error: '請填寫手機號碼',
    })
    .min(1, { message: '請填寫手機號碼' })
    .refine(
      (val) => {
        const mobilePattern = /^09\d{8}$/
        return mobilePattern.test(val)
      },
      {
        message: '請填寫正確的手機號碼格式',
      }
    ),
  date: z.string().refine(
    (val) => {
      return /^\d{4}-\d{2}-\d{2}$/.test(val) && !isNaN(Date.parse(val))
    },
    {
      message: '無效的日期格式，請重新選擇',
    }
  ),
  timeSlot: z.string().nonempty({ message: '請選擇場次' }), // 驗證選擇的場次
  people: z.string().nonempty({ message: '請選擇人數' }), // 驗證選擇的人數
  discount: z.string().nonempty({ message: '請選擇優惠項目' }), // 驗證選擇的優惠項目
})

export default schemaForm
