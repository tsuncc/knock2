import { z } from 'zod'

export const schemaLoginForm = z.object({
  account: z
    .string({
      required_error: '請填寫Email',
    })
    .email({
      message: '請填寫有效的Email地址',
    })
    .max(100, {
      message: '請填寫Email，最多為 100 個字元',
    }),
  password: z
    .string({
      required_error: '請填寫密碼',
    })
    .min(8, {
      message: '請填寫密碼，至少為 8 個字元',
    })
    .max(100, {
      message: '密碼長度最多為 100 個字元',
    }),
})

export const schemaRegisterForm = z
  .object({
    account: z
      .string({
        required_error: '請填寫Email',
      })
      .email({
        message: '請填寫有效的Email地址',
      })
      .max(100, {
        message: '請填寫Email，最多為 100 個字元',
      }),
    password: z
      .string({
        required_error: '請填寫密碼',
      })
      .min(8, {
        message: '請填寫密碼，至少為 8 個字元',
      })
      .max(100, {
        message: '密碼長度最多為 100 個字元',
      }),
    reenter_password: z
      .string({
        required_error: '請再次填寫密碼',
      })
      .min(8, {
        message: '請再次填寫密碼',
      }),
    name: z
      .string({
        required_error: '請填寫姓名',
      })
      .min(2, {
        message: '請填寫姓名',
      })
      .max(20, {
        message: '請重新填寫姓名，最多 20 個字元',
      }),
  })
  .refine((data) => data.password === data.reenter_password, {
    message: '兩次輸入的密碼不一致',
    path: ['reenter_password'],
  })

export const schemaForgetPasswordForm = z.object({
  account: z
    .string({
      required_error: '請填寫Email',
    })
    .email({
      message: '請填寫有效的Email地址',
    })
    .max(100, {
      message: '請填寫Email，最多為 100 個字元',
    }),
})
