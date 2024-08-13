import React from 'react'
import Image from 'next/image'

export const StatusReport = ({ status = '' }) => {
  let statusReport = ''
  let imgSrc = ''

  switch (status) {
    case '1':
      statusReport = '隊伍成團囉，團長加油！'
      imgSrc = '/ghost/ghost_05.png'
      break
    case '2':
      statusReport = '此隊伍已成團，要看看其他團隊嗎？'
      imgSrc = '/ghost/ghost_06.png'
      break
    case '3':
      statusReport = '您已申請加入此團隊，請靜待團長許可'
      imgSrc = '/ghost/ghost_01.png'
      break
    default:
      break
  }

  return (
    <>
      <div style={{ textAlign: 'center', padding: '32px 0 16px 0' }}>
        <h4>{statusReport}</h4>
        <Image src={imgSrc} alt="" width={125} height={100} />
      </div>
    </>
  )
}

export default StatusReport
