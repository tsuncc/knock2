import { z } from 'zod'

export const schemaResetPasswordForm = z
  .object({
    old_password: z
      .string({
        required_error: '請填寫密碼',
      })
      .min(8, {
        message: '請填寫舊密碼，至少為 8 個字元',
      })
      .max(100, {
        message: '密碼長度最多為 100 個字元',
      }),

    new_password: z
      .string({
        required_error: '請填寫密碼',
      })
      .min(8, {
        message: '請填寫新密碼，至少為 8 個字元',
      })
      .max(100, {
        message: '密碼長度最多為 100 個字元',
      }),

    reenter_new_password: z
      .string({
        required_error: '請再次填寫新密碼',
      })
      .min(8, {
        message: '請再次填寫新密碼',
      }),
  })
  .refine((data) => data.old_password !== data.new_password, {
    message: '新密碼不能與舊密碼相同',
    path: ['new_password'],
  })
  .refine((data) => data.new_password === data.reenter_new_password, {
    message: '兩次輸入的密碼不一致',
    path: ['reenter_new_password'],
  })

export const schemaForgetPasswordForm = z
  .object({
    new_password: z
      .string({
        required_error: '請填寫密碼',
      })
      .min(8, {
        message: '請填寫舊密碼，至少為 8 個字元',
      })
      .max(100, {
        message: '密碼長度最多為 100 個字元',
      }),

    reenter_new_password: z
      .string({
        required_error: '請再次填寫密碼',
      })
      .min(8, {
        message: '請再次填寫密碼',
      }),
  })
  .refine((data) => data.new_password === data.reenter_new_password, {
    message: '兩次輸入的密碼不一致',
    path: ['reenter_new_password'],
  })
