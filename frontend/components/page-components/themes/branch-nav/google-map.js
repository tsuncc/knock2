import React, { useEffect, useState } from 'react'
import myStyles from './map.module.css'
// import 'bootstrap/dist/css/bootstrap.css'

export default function GoogleMap({
  branchName = '',
  openTime = '',
  closeTime = '',
  branchPhone = '',
  branchAddress = '',
  mapSrc = '',
}) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <div className={myStyles.map}>
      <div className="col-12 col-md-6">
        <ul>
          <div className={myStyles.title}>{branchName}</div>
          <li className={myStyles.info}>
            營業時間&nbsp; {openTime}-{closeTime}（預約洽詢時間）
          </li>
          <li className={myStyles.info}>
            電話 &nbsp;&ensp;&ensp;&ensp; {branchPhone}
          </li>
          <li className={myStyles.info2}>
            地址 &nbsp;&ensp;&ensp;&ensp; {branchAddress}
          </li>
        </ul>
      </div>
      <iframe
        className={myStyles.iframe}
        title="Google Map"
        src={mapSrc}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  )
}
