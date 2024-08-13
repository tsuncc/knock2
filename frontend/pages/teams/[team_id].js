import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '@/context/auth-context'
import { ONE_TEAM, GET_MEMBER, JOIN_TEAM } from '@/configs/api-path'
import { useSnackbar } from '@/context/snackbar-context'

import IndexLayout from '@/components/layout'

import TeamDetails from '@/components/page-components/teams/team_page/teamdetails'
import JoinTeamModal from '@/components/page-components/teams/join-team-modal'
import ManagerTeamModal from '@/components/page-components/teams/manager-team-modal'
import TeamMemberComponent from '@/components/page-components/teams/TeamMemberComponent'
import ChatArea from '@/components/page-components/teams/chat_area'
import StatusReport from '@/components/page-components/teams/team_page/statusReport'

import styles from '@/components/page-components/teams/teams.module.css'

export default function TeamInfo() {
  const router = useRouter()
  const { auth } = useAuth()
  const [teamData, setTeamData] = useState([])
  const [isMember, setIsMember] = useState(false)
  const [memberData, setMemberData] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [modalOpenJoin, setModalOpenJoin] = useState(false)
  const [memberCount, setMemberCount] = useState(0)
  const [teamReady, setTeamReady] = useState('going')
  const { openSnackbar } = useSnackbar()

  const fetchTeamData = async (team_id) => {
    const url = ONE_TEAM + team_id
    try {
      const res = await fetch(url)
      const data = await res.json()

      if (data.success) {
        setTeamData(data.data)
        // console.log('成功取得團隊資料', data.data)
      } else {
        // console.error('取得團隊資料失敗:', data.error)
      }
    } catch (error) {
      // console.error('取得團隊資料時發生錯誤:', error)
    }
  }

  const fetchMemberData = async (team_id) => {
    const url = GET_MEMBER + team_id
    try {
      const res = await fetch(url)
      const data = await res.json()

      if (data.success) {
        setMemberCount(data.data.length)
        // console.log('成功取得團員資料', data.data)

        const isUserMember = data.data.some(
          (member) => member.join_user_id === auth.id
        )
        setIsMember(isUserMember)
      } else {
        // console.error('團員資料取得失敗:', data.error)
      }
    } catch (error) {
      // console.error('取得團員資料時發生錯誤:', error)
    }
  }

  const handleJoinTeam = async () => {
    const { team_id } = router.query
    const joinData = {
      join_team_id: team_id,
      join_user_id: auth.id,
    }

    try {
      const res = await fetch(JOIN_TEAM, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(joinData),
      })

      const result = await res.json()

      if (result.success) {
        fetchMemberData(team_id)
      } else {
        // console.error('加入團隊失敗:', result.error)
        openSnackbar('加入團隊失敗', 'error')
      }
    } catch (error) {
      // console.error('Error joining team:', error)
      openSnackbar('加入團隊時發生錯誤', 'error')
    }
  }

  useEffect(() => {
    if (router.isReady) {
      const { team_id } = router.query
      if (team_id) {
        fetchTeamData(team_id)
        fetchMemberData(team_id)
      }
    }
  }, [router.isReady])

  const openModal = () => setModalOpen(true)
  const closeModal = () => setModalOpen(false)
  const openModalJoin = () => setModalOpenJoin(true)
  const closeModalJoin = () => setModalOpenJoin(false)

  if (!teamData) {
    return <div>Loading...</div>
  }

  return (
    <>
      <IndexLayout title="糾團" background="dark">
        <div className={styles.teamsPage}>
          <div className="container">
            <div className={styles.pageTitle}>
              <h2>團隊頁面</h2>
            </div>
            <div className={`${styles.teamsSection} row`}>
              <div className={styles.borderbox} key={teamData.team_id}>
                <div className="row">
                  <TeamDetails teamData={teamData} memberCount={memberCount} />
                </div>
                <div className="row">
                  {teamData.team_status === '已成團' ? (
                    <>
                      {auth.id === teamData.user_id ? (
                        <StatusReport status="1" />
                      ) : (
                        <>
                          <Link href="./" style={{ color: '#FFF' }}>
                            <StatusReport status="2" />
                          </Link>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {!auth.id ? (
                        <></>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '16px' }}>
                          {auth.id === teamData.user_id ? (
                            <>
                              <button
                                onClick={openModal}
                                className={styles.buttonBrown}
                              >
                                管理團員
                              </button>
                            </>
                          ) : isMember ? (
                            <>
                              <StatusReport status="3" />
                            </>
                          ) : (
                            <>
                              <button
                                onClick={openModalJoin}
                                className={styles.buttonBrown}
                              >
                                申請加入
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <>
          <div className="container">
            <ChatArea chat_at={teamData.team_id} chat_by={auth.id} />
          </div>
        </>
      </IndexLayout>
      <ManagerTeamModal
        open={modalOpen}
        onClose={closeModal}
        modalTitle="管理團員"
        modalBody={
          <TeamMemberComponent
            team_id={router.query.team_id}
            team_limit={teamData.team_limit}
            onMemberCountChange={setTeamReady}
            onStatusChange={setTeamReady}
            memberData={memberData}
            onMemberDataChange={setMemberData}
            // onMemberCountChange={setMemberCount}
          />
        }
        team_id={router.query.team_id}
        TeamReady={teamReady}
        memberData={memberData}
        refreshTeamData={() => fetchTeamData(router.query.team_id)}
      />
      <JoinTeamModal
        open={modalOpenJoin}
        onClose={closeModalJoin}
        modalTitle="申請加入"
        modalBody={
          <div>
            加入後，需等待團長審核
            <br />
            待人數到達預定上限後即可成團。
          </div>
        }
        modalBody2={<div>已成功加入隊伍！ </div>}
        buttonLabel="確定加入！"
        onButtonClick={handleJoinTeam}
        buttonLabel2="確定"
      />
    </>
  )
}
