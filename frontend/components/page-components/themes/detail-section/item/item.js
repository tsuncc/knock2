import React, { useState, useEffect } from 'react'
import { useTheme } from '@/context/theme-context'
import { useRouter } from 'next/router'
import myStyle from './item.module.css'
import { FaRegClock, FaKey, FaBabyCarriage } from 'react-icons/fa6'
import { BsFillPeopleFill } from 'react-icons/bs'

export default function Item() {
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
      <div className={myStyle.item}>
        <div className="container">
          <div className="row d-flex align-items-center justify-content-center">
            <div className="d-flex flex-wrap flex-column col-3 align-items-center">
              <BsFillPeopleFill className={myStyle.group} />
              <div className={myStyle.p}>
                {themeDetails.min_players} - {themeDetails.max_players} 人
              </div>
            </div>
            <div className="d-flex flex-wrap flex-column align-items-center col-3">
              <FaRegClock className={myStyle.clock} />
              <div className={myStyle.p}>{themeDetails.theme_time} 分鐘</div>
            </div>
            <div className="d-flex flex-wrap flex-column col-3 align-items-center">
              <FaKey className={myStyle.clock} />
              <div className={myStyle.p}>{themeDetails.difficulty}</div>
            </div>
            <div className="d-flex flex-wrap flex-column col-3 align-items-center">
              <FaBabyCarriage className={myStyle.clock} />
              <div className={myStyle.p}>12 +</div>
            </div>
          </div>
        </div>
      </div>
      <div className={myStyle.price}>
        <div className="container">
          <div className="row d-flex align-items-center justify-content-center flex-wrap">
            <div className="col-3 d-block align-items-center justify-content-center">
              <div className={myStyle.tag}>
                原價
                <div className={myStyle.org}>
                  {themeDetails.price} <span className={myStyle.tag2}>元</span>
                </div>
              </div>
            </div>

            <div className="col-3 d-block align-items-center justify-content-center">
              <div className={myStyle.tag}>{themeDetails.min_players} 人</div>
              <div className={myStyle.tag}>
                $
                <span className={myStyle.other}>
                  {themeDetails.price - 150}
                </span>
                /人
              </div>
            </div>
            <div className="col-3 d-block align-items-center justify-content-center">
              <div className={myStyle.tag}>
                {themeDetails.min_players + 1} 人
              </div>
              <div className={myStyle.tag}>
                $
                <span className={myStyle.other}>
                  {themeDetails.price - 100}
                </span>
                /人
              </div>
            </div>
            <div className="col-3 d-block align-items-center justify-content-center">
              <div className={myStyle.tag2}>
                {themeDetails.min_players + 2} - {themeDetails.max_players - 1}
                人
              </div>
              <div className={myStyle.tag2}>
                $
                <span className={myStyle.other}>{themeDetails.price - 50}</span>
                /人
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={myStyle.themeBanner}
        style={{
          backgroundImage: `url('/themes-banner/${themeDetails.theme_banner}')`,
        }}
      ></div>
    </>
  )
}
