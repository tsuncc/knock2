import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from '@/components/page-components/teams/teams.module.css'

import { formatShortDate, formatSTime } from '@/hooks/useDateFormatter.js'

const TeamTable = ({ Data1, Data2, MemberCount }) => {
  return (
    <>
      {' '}
      {Data1.length < 1 && Data2 < 1 ? (
        <div style={{ textAlign: 'center' }}>
          <h5>沒有參與的隊伍記錄</h5>
          <br />
          <Image src="/ghost/ghost_01.png" alt="" width={100} height={100} />
        </div>
      ) : (
        <>
          <table className={styles.teamTable}>
            <thead>
              <tr>
                <th>團名</th>
                <th>行程</th>
                <th>時間</th>
                <th>人數</th>
              </tr>
            </thead>
            <tbody>
              {Data1.map((r) => (
                <tr key={r.team_id}>
                  <td>
                    <Link href={`/teams/${r.team_id}`}>{r.team_title}</Link>
                  </td>
                  <td>{r.theme_name}</td>
                  <td style={{ minWidth: '150px' }}>
                    {formatShortDate(r.reservation_date)}{' '}
                    {formatSTime(r.start_time)}
                  </td>
                  <td>
                    {MemberCount[r.team_id] || 0} / {r.team_limit}
                  </td>
                </tr>
              ))}
              {Data2.length > 0 ? (
                <>
                  <tr>
                    <td>
                      <br />
                    </td>
                  </tr>
                  <tr style={{ borderTop: '1px solid #B99755' }}>
                    <td style={{ paddingTop: '16px' }}>已成團</td>
                  </tr>
                  {Data2.map((r) => (
                    <tr key={r.team_id}>
                      <td>
                        <Link href={`/teams/${r.team_id}`}>
                          {r.team_title}
                        </Link>
                      </td>
                      <td>{r.theme_name}</td>
                      <td style={{ minWidth: '150px' }}>
                        {formatShortDate(r.reservation_date)}{' '}
                        {formatSTime(r.start_time)}
                      </td>
                      <td>
                        {MemberCount[r.team_id] || 0} / {r.team_limit}
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <></>
              )}
            </tbody>
          </table>
        </>
      )}
    </>
  )
}

export default TeamTable
