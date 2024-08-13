import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from '@/components/page-components/teams/teams.module.css'
import { useFetch } from '@/hooks/useTeamFetch'
import { RES_TEAM } from '@/configs/api-path'
import { formatShortDate, formatSTime } from '@/hooks/useDateFormatter.js'

export default function ReserDisplay({ user_id = '' }) {
  const { data: resTeamData, isLoading: isNoTeamDataLoading } = useFetch(
    `${RES_TEAM}${user_id}`
  )
  if (isNoTeamDataLoading) {
    return <div>Now Loading...</div>
  }

  return (
    <>
      <div className="row">
        <h4 className={styles.teamPaTitle}>已預約的行程</h4>
        <div className={styles.titleBL}></div>
      </div>

      <div className="row" style={{ justifyContent: 'center' }}>
        {resTeamData.success ? (
          <>
            {resTeamData.rows.map((r) => (
              <div
                className={`col-lg-6 col-12 ${styles.preteamcard}`}
                key={r.reservation_id}
              >
                <div className="row">
                  <div className="col-4">
                    行程
                    <br />
                    {r.theme_name}
                  </div>
                  <div className="col-5">
                    日期時間
                    <br />
                    {formatShortDate(r.reservation_date)}{' '}
                    {formatSTime(r.start_time)}
                  </div>
                  <div className="col-3">
                    地區
                    <br />
                    {r.branch_name}
                  </div>
                </div>
                <div
                  style={{ textAlign: 'center', marginTop: '12px' }}
                  className="row"
                >
                  <Link
                    href={`/teams/add_team?reservation_id=${r.reservation_id}`}
                  >
                    <button className={styles.teamButton}>我要開團</button>
                  </Link>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className={styles.noDataInfo}>
              <h6>
                您還沒有預訂行程，要不要<Link href="/themes">趕快預訂</Link>呢？
              </h6>
              <Link href="/themes">
                <Image
                  src="/ghost/ghost_21.png"
                  alt=""
                  width={100}
                  height={100}
                />
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  )
}
