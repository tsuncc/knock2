import React from 'react'

import {
  GET_ALL_MEMBER,
  USER_LEAD_TEAM,
  USER_JOIN_TEAM,
} from '@/configs/api-path'
import { useFetch } from '@/hooks/useTeamFetch'
import ReserDisplay from './reser_display'
import TeamTable from './team_table'

import styles from '@/components/page-components/teams/teams.module.css'

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from './mui_style'

export default function UserTeam({ auth }) {
  const { data: leadTeamData, isLoading: isLeadTeamDataLoading } = useFetch(
    `${USER_LEAD_TEAM}${auth.id}`
  )
  const { data: joinTeamData, isLoading: isJoinTeamDataLoading } = useFetch(
    `${USER_JOIN_TEAM}${auth.id}`
  )
  const { data: teamMemberData, isLoading: isTeamMemberDataLoading } =
    useFetch(GET_ALL_MEMBER)

  if (
    isLeadTeamDataLoading ||
    isJoinTeamDataLoading ||
    isTeamMemberDataLoading
  ) {
    return <div>Now Loading...</div>
  }
  // 計算隊員數量
  const teamMemberCount = {}
  teamMemberData?.data?.forEach((member) => {
    if (teamMemberCount[member.join_team_id]) {
      teamMemberCount[member.join_team_id]++
    } else {
      teamMemberCount[member.join_team_id] = 1
    }
  })

  return (
    <>
      <div className={styles.teamsPage}>
        <div className="container">
          <div className="row pb-3">
            <Accordion>
              <AccordionSummary
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography component="div">您的團隊</Typography>
              </AccordionSummary>
              <AccordionDetails component="div">
                <Typography component="div">
                  <div
                    className="row"
                    style={{
                      borderTop: '1px solid #B99755',
                      paddingTop: '10px',
                    }}
                  >
                    <div
                      className={`col-12 col-lg-6 ${styles.teamlistblock} ${styles.teamlistblock1}`}
                    >
                      <h4 className={styles.teamPaTitle}>您帶領的團隊</h4>
                      <div className={styles.titleBL}></div>
                      <TeamTable
                        Data1={leadTeamData.recruiting}
                        Data2={leadTeamData.formed}
                        MemberCount={teamMemberCount}
                      />
                      <div className={styles.bb2}></div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <h4 className={styles.teamPaTitle}>您參加的團隊</h4>
                      <div className={styles.titleBL}></div>
                      <>
                        <TeamTable
                          Data1={joinTeamData.recruiting}
                          Data2={joinTeamData.formed}
                          MemberCount={teamMemberCount}
                        />
                      </>
                    </div>
                    <div className={styles.bb}></div>
                  </div>
                  <ReserDisplay user_id={auth.id} />
                </Typography>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </div>
    </>
  )
}
