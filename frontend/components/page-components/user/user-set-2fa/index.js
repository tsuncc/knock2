import { useState } from 'react'
import Image from 'next/image'
import axios from 'axios'

import {
  GOOGLE_AUTHENTICATOR_SETUP_POST,
  GOOGLE_AUTHENTICATOR_VERIFY_POST,
} from '@/configs/api-path'
import { IconButton, Tooltip } from '@mui/material'
import { LuCopy, LuCopyCheck } from 'react-icons/lu'
import { useAuth } from '@/context/auth-context'
import ClearButton from '@/components/UI/clear-button'
import BlackBtn from '@/components/UI/black-btn'
import OTPInput from '@/components/UI/form-item/otp-input'
import TwoFactorAuthStepper from '@/components/UI/stepper'

import styles from './user-set-2fa.module.scss'
import UserProfileFormTitle from '../user-profile-form/user-profile-title'
import { useRouter } from 'next/router'
import { useSnackbar } from '@/context/snackbar-context'

const steps = [
  {
    label: '下載驗證app',
    description: '下載 Google Authenticator 或其他相容的驗證應用程式。',
  },
  {
    label: '掃描QRcode',
    description: '掃描 QR 碼或手動輸入金鑰以設置驗證器。',
  },
  {
    label: '輸入驗證碼',
    description: '輸入應用程式中顯示的 6 位數驗證碼。',
  },
]

export default function UserSet2fa() {
  const [setup2faData, setSetup2faData] = useState({})
  const [setup2faStep, setSetup2faStep] = useState(0)
  const [verificationCode, setVerificationCode] = useState('')
  const [setup2faError, setSetup2faError] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const { auth } = useAuth()
  const router = useRouter()
  const { openSnackbar } = useSnackbar()

  const handleSetup = async () => {
    try {
      const response = await axios.post(GOOGLE_AUTHENTICATOR_SETUP_POST, {
        id: auth.id,
      })
      setSetup2faData(response.data)
    } catch (error) {
      console.error('設置 OTP 失敗:', error)
      setSetup2faError('設置失敗，請稍後再試。')
    }
  }

  const handleVerify = async () => {
    if (verificationCode.length !== 6) openSnackbar('請填寫驗證碼', 'error')
    try {
      const response = await axios.post(GOOGLE_AUTHENTICATOR_VERIFY_POST, {
        id: auth.id,
        token: verificationCode,
      })
      if (response.data.success) {
        openSnackbar('驗證成功！兩步驗證已設置。', 'success')
        router.push('/user/profile')
      } else {
        openSnackbar('驗證失敗，請確認代碼是否正確。', 'error')
      }
    } catch (error) {
      console.error('驗證 TOTP 失敗:', error)
      openSnackbar('驗證失敗，請確認代碼是否正確。', 'error')
    }
  }

  const handleLink = (link) => {
    window.open(link, '_blank')
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(setup2faData.secret)
      setCopySuccess(true)
      // 3秒後重置複製狀態
      setTimeout(() => setCopySuccess(false), 3000)
    } catch (err) {
      console.error('複製失敗: ', err)
    }
  }

  return (
    <>
      <section className={styles.set2fa}>
        <div className={styles.boxColumn}>
          <UserProfileFormTitle
            text={'兩步驗證 (2FA)'}
            href={auth.id ? '/user/profile' : null}
          />
          <TwoFactorAuthStepper steps={steps} activeStep={setup2faStep} />
        </div>

        {setup2faStep === 0 && (
          <>
            <div className={styles.boxColumn}>
              <p>您可以透過驗證器應用程式取得驗證碼</p>
              <p>
                前往
                <span className={styles.link}>
                  <ClearButton
                    btnText="Google Play"
                    onClick={() => {
                      handleLink(
                        'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&pli=1'
                      )
                    }}
                  />
                </span>
                或
                <span className={styles.link}>
                  <ClearButton
                    btnText="iOS App Store"
                    className={styles.btn}
                    onClick={() => {
                      handleLink(
                        'https://apps.apple.com/us/app/google-authenticator/id388497605'
                      )
                    }}
                  />
                </span>
              </p>
              <p>下載 Google Authenticator 驗證器</p>
            </div>
            <div className={styles.boxRow}>
              <BlackBtn
                btnText="開始設置"
                type="button"
                href={null}
                onClick={() => {
                  handleSetup()
                  setSetup2faStep(1)
                }}
              />
            </div>
          </>
        )}
        {setup2faStep === 1 && (
          <>
            <div className={styles.boxColumn}>
              <p>請以驗證器掃描以下 QRcode：</p>
              {setup2faData.qrCode && (
                <Image
                  src={setup2faData.qrCode}
                  width={250}
                  height={250}
                  alt="QR Code"
                />
              )}
              <p>或複製金鑰：</p>
              <div className={styles.boxRow}>
                <pre>{setup2faData.secret}</pre>
                <Tooltip
                  placement="top"
                  title={copySuccess ? '已複製!' : '複製金鑰'}
                  arrow
                >
                  <IconButton onClick={handleCopy}>
                    {copySuccess ? <LuCopyCheck /> : <LuCopy />}
                  </IconButton>
                </Tooltip>
              </div>
            </div>
            <div className={styles.boxRow}>
              <BlackBtn
                btnText="上一步"
                type="button"
                href={null}
                onClick={() => setSetup2faStep(0)}
              />
              <BlackBtn
                btnText="下一步"
                type="button"
                href={null}
                onClick={() => setSetup2faStep(2)}
              />
            </div>
          </>
          // 開啟 Google Authenticator 應用程式並依序輕觸 [+] 和 [輸入設定金鑰]
          // 輸入您的電子郵件地址和這組金鑰 (空格沒有影響)： 5c2l vvly fkah 7w3g
          // pgxf yc26 6wd3 3fiq 必須選取 [根據時間] 輕觸 [新增] 即可完成設定。
        )}
        {setup2faStep === 2 && (
          <>
            <div className={styles.boxColumn}>
              <p>請輸入驗證器上顯示的 6 位數字：</p>
              <OTPInput
                state={verificationCode}
                setState={setVerificationCode}
              />
              {setup2faError && <p>{setup2faError}</p>}
            </div>
            <div className={styles.boxRow}>
              <BlackBtn
                btnText="上一步"
                type="button"
                href={null}
                onClick={() => {
                  setVerificationCode('')
                  setSetup2faStep(1)
                }}
              />
              <BlackBtn
                btnText="驗證並完成設置"
                type="button"
                href={null}
                onClick={handleVerify}
              />
            </div>
          </>
        )}
      </section>
    </>
  )
}
