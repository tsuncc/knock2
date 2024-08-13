import React from 'react'
import Image from 'next/image'
import { AspectRatio } from '@mui/joy'
import Link from 'next/link'
import { formatDateToTaiwan, formatTime } from '@/hooks/useDateFormatter'
import UserAvatar from '@/components/page-components/teams/user_avatar'
import styles from '@/components/page-components/teams/teams.module.css'
import Tooltip from '@mui/material/Tooltip'

const TeamDetails = ({ teamData, memberCount }) => {
  return (
    <div className="row">
      <div className={`col-12 col-md-4 px-3 pb-5 ${styles.teamlistblock1}`}>
        <div className={styles.teamTitle}>
          <h3>
            <Link href={`/themes/themes-details/${teamData.theme_id}`}>
              {teamData.theme_name}
            </Link>
          </h3>
        </div>
        <Tooltip title={teamData.theme_desc}>
          <div className="teamPhoto">
            <AspectRatio ratio="375/240">
              <Image
                src={`/themes-main/${teamData.theme_img}`}
                alt=""
                width={'579'}
                height={'415'}
              />
            </AspectRatio>
          </div>
        </Tooltip>
      </div>
      <div className="col-12 col-md-8 px-5">
        <h5 className="pt-3">團隊名：{teamData.team_title}</h5>
        <div className="py-3">
          行程時間：
          {formatDateToTaiwan(teamData.reservation_date)}{' '}
          {formatTime(teamData.start_time)}
          <br />
          冒險長度：{teamData.theme_Time} 分鐘
          <br />
          地區：{teamData.branch_name}
          <br />
          申請人數/人數上限：{memberCount} / {teamData.team_limit}
        </div>
        <hr />
        <div
          style={{ fontSize: '24px', paddingTop: '2px', paddingBottom: '5px' }}
        >
          <UserAvatar avatar={teamData.avatar} nickName={teamData.nick_name} />
          <span style={{ marginLeft: '15px' }}>{teamData.nick_name}</span>
        </div>
        <div style={{ fontSize: '16px' }}>
          {' '}
          團長的話：
          <br />
          {teamData.team_note}
        </div>
      </div>
    </div>
  )
}

export default TeamDetails
