import React, { useState, useEffect } from 'react'
import { GET_MEMBER } from '@/configs/api-path'
import UserAvatar from '@/components/page-components/teams/user_avatar'
import CustomRadioGroup from './radio'

const TeamMemberComponent = ({
  team_id,
  team_limit = 0,
  onMemberCountChange,
  onStatusChange,
  onMemberDataChange,
}) => {
  const [memberData, setMemberData] = useState([])
  const [selectedCount, setSelectedCount] = useState(0)

  const fetchMemberData = async (team_id) => {
    const url = GET_MEMBER + team_id
    try {
      const res = await fetch(url)
      const data = await res.json()

      if (data.success) {
        setMemberData(data.data)
        onMemberCountChange(data.data.length)
        const initialCount = data.data.filter(
          (member) => member.m_status === 1
        ).length
        setSelectedCount(initialCount)
        // console.log('成功取得團員資料', data.data)
      } else {
        // console.error('團員資料取得失敗:', data.error)
      }
    } catch (error) {
      // console.error('取得團員資料時發生錯誤:', error)
    }
  }
  useEffect(() => {
    if (team_id) {
      fetchMemberData(team_id)
    }
  }, [team_id])

  useEffect(() => {
    let status
    onMemberCountChange(selectedCount, team_limit)

    if (selectedCount < team_limit) {
      status = 'going'
      onStatusChange('going')
    } else if (selectedCount === team_limit) {
      status = 'ready'
      onStatusChange('ready')
    } else {
      status = 'over'
      onStatusChange('over')
    }
    onMemberCountChange(status)
    onMemberDataChange(memberData)
  }, [selectedCount, team_limit, onMemberCountChange, onMemberDataChange])

  const handleRadioChange = (no, value) => {
    const memberAccept = parseInt(value)
    setMemberData((prevMembers) => {
      return prevMembers.map((member) => {
        if (member.no === no) {
          if (member.m_status !== memberAccept) {
            if (memberAccept === 1) {
              setSelectedCount((prevCount) => prevCount + 1)
            } else if (member.m_status === 1) {
              setSelectedCount((prevCount) => prevCount - 1)
            }
          }
          return { ...member, m_status: memberAccept }
        }
        return member
      })
    })
  }

  return (
    <div>
      <h6 style={{ padding: '12px 0', textAlign: 'center' }}>
        目前申請加入的使用者
      </h6>
      {memberData.map((member) => (
        <div key={member.join_user_id}>
          <div style={{ padding: '12px 0 6px 12px', fontSize: '18px' }}>
            <UserAvatar avatar={member.avatar} nickName={member.nick_name} />
            <span style={{ marginLeft: '10px' }}>{member.nick_name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CustomRadioGroup
              key={member.no}
              member={member}
              handleRadioChange={handleRadioChange}
            />
          </div>
        </div>
      ))}
      <div style={{ textAlign: 'center', paddingTop: '12px' }}>
        團員/上限: {selectedCount} / {team_limit}
      </div>
    </div>
  )
}

export default TeamMemberComponent
