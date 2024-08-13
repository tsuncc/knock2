import React, { useState, useEffect } from 'react'
import { useTheme } from '@/context/theme-context'
import { useRouter } from 'next/router'
import myStyle from './step.module.css'
import { CgNotes } from 'react-icons/cg'
import { RiMoneyDollarCircleLine } from 'react-icons/ri'
import { FaCheckCircle } from 'react-icons/fa'
import { IoIosArrowForward } from 'react-icons/io'

export default function Step() {
  const { themeDetails, getThemeDetails } = useTheme()
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const { branch_themes_id } = router.query
    if (branch_themes_id) {
      setLoading(true)
      getThemeDetails(branch_themes_id).finally(() => setLoading(false))
    }
  }, [router.query, getThemeDetails])
  return (
    <>
      <h2 className={myStyle.h1}>
        {themeDetails.theme_name} - {themeDetails.branch_name}{' '}
      </h2>
      <div className="container">
        <hr className={myStyle.line} />
        <div className="row mt-5 d-flex justify-content-center">
          <div className="col-6 col-md-2 d-flex flex-column align-items-center mb-4">
            <div className={myStyle.step1}>
              Step. 1<div className={myStyle.step1}>填寫預約</div>
            </div>
            <CgNotes className={myStyle.icon} />
            <span className={myStyle.p}>選擇場次和遊玩人數</span>
          </div>
          <IoIosArrowForward
            className={`col-1 d-none d-md-block ${myStyle.icon2}`}
          />
          <div className="col-6 col-md-2 d-flex flex-column align-items-center mb-4">
            <div className={myStyle.step1}>
              Step. 2<div className={myStyle.step1}>預付訂金</div>
            </div>
            <RiMoneyDollarCircleLine className={myStyle.icon} />
            <span className={myStyle.p}>填寫付款資料</span>
          </div>
          <IoIosArrowForward
            className={`col-1 d-none d-md-block ${myStyle.icon2}`}
          />
          <div className="col-6 col-md-2 d-flex flex-column align-items-center mb-4">
            <div className={myStyle.step1}>
              Step. 3<div className={myStyle.step1}>確認資料</div>
            </div>
            <FaCheckCircle className={myStyle.icon} />
            <span className={myStyle.p}>確認預約資訊無誤</span>
          </div>
          <IoIosArrowForward
            className={`col-1 d-none d-md-block ${myStyle.icon2}`}
          />
          <div className="col-6 col-md-2 d-flex flex-column align-items-center mb-4">
            <div className={myStyle.step1}>
              Final<div className={myStyle.step1}>預約完成</div>
            </div>
            <div className={myStyle.check}></div>
            <span className={myStyle.p2}>歡迎遊玩密室逃脫</span>
          </div>
        </div>
      </div>
    </>
  )
}
