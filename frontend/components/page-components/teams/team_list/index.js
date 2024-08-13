import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { GET_DATA } from '@/configs/api-path'

import styles from '@/components/page-components/teams/teams.module.css'
import SelectT from './selectT'
import Card from '@/components/UI/teams-card'
import MyPagination from './pagination'

export default function TeamList() {
  const router = useRouter()
  const { query } = router
  const initialPage = query.page ? parseInt(query.page) : 1

  const [data, setData] = useState({
    success: false,
    rows: [],
  })

  const [page, setPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(1)
  const [branchID, setBranchID] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [order, setOrder] = useState('')
  const [teamStatus, setTeamStatus] = useState('')

  const fetchData = async () => {
    const params = new URLSearchParams({ page })

    if (branchID) {
      params.append('branch_id', branchID)
    }
    if (order) {
      params.append('order', order)
    }
    if (difficulty) {
      params.append('difficulty', difficulty)
    }
    if (teamStatus) {
      params.append('team_status', teamStatus)
    }
    try {
      const response = await fetch(`${GET_DATA}?${params.toString()}`)
      const result = await response.json()
      console.log('API result:', result)

      if (result.success) {
        setData({ success: true, rows: result.rows })
        setTotalPages(result.totalPages)
      } else if (result.redirect) {
        const newPage = new URLSearchParams(result.redirect).get('page')
        if (newPage) {
          setPage(parseInt(newPage))
          router.push({ pathname: '/teams', query: { page: newPage } })
        }
        setData({ success: false, rows: [] })
      } else {
        setData({ success: false, rows: [] })
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setData({ success: false, rows: [] })
    }
  }

  useEffect(() => {
    fetchData()
  }, [branchID, order, difficulty, teamStatus, page])

  useEffect(() => {
    setPage(initialPage)
  }, [query.page])

  return (
    <>
      <div className={styles.teamsPage}>
        <div className="container">
          <div className="row">
            <h3 className={styles.secTitle}>團隊一覽</h3>
            <hr />
          </div>

          {/* 篩選排序 */}
          <div className="row pb-5">
            <h4 className={styles.secTitle}>篩選排序</h4>
            <div className="col-12 col-md-6 col-lg-3">
              <SelectT
                name="branch"
                label="館別篩選"
                value={branchID}
                placeholder="館別篩選"
                onChange={(e) => setBranchID(e.target.value)}
                options={[
                  { value: '', text: '館別篩選' },
                  { value: '3', text: '台北館' },
                  { value: '2', text: '台中館' },
                  { value: '1', text: '高雄館' },
                ]}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <SelectT
                name="difficulty"
                label="難度篩選"
                value={difficulty}
                placeholder="難度篩選"
                onChange={(e) => setDifficulty(e.target.value)}
                options={[
                  { value: '', text: '難度篩選' },
                  { value: 'EASY', text: 'EASY' },
                  { value: 'MEDIUM', text: 'MEDIUM' },
                  { value: 'HARD', text: 'HARD' },
                ]}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <SelectT
                name="order"
                label="時間排序"
                value={order}
                placeholder="時間排序"
                onChange={(e) => setOrder(e.target.value)}
                options={[
                  { value: '', text: '時間排序' },
                  { value: 'DESC', text: '從新到舊' },
                  { value: 'ASC', text: '從舊到新' },
                ]}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <SelectT
                name="teamStatus"
                label="隊伍狀態"
                value={teamStatus}
                placeholder="隊伍狀態"
                onChange={(e) => setTeamStatus(e.target.value)}
                options={[
                  { value: '', text: '隊伍狀態' },
                  { value: '募集中', text: '募集中' },
                  { value: '已成團', text: '已成團' },
                ]}
              />
            </div>
          </div>
          <div className="row">
            {data.rows.length > 0 ? (
              data.rows.map((r) => {
                return (
                  <div className="col-12 col-md-6 col-lg-4" key={r.team_id}>
                    <Card
                      team_id={r.team_id}
                      key={r.team_id}
                      branchName={r.branch_name}
                      themeImg={r.theme_img}
                      themeName={r.theme_name}
                      difficulty={r.difficulty}
                      suitablePlayers={r.suitable_players}
                      themeTime={r.theme_Time}
                      rick_name={r.nick_name}
                      reservation_date={r.reservation_date}
                      start_time={r.start_time}
                      team_title={r.team_title}
                      team_status={r.team_status}
                      max_players={r.team_limit}
                    />
                  </div>
                )
              })
            ) : (
              <div className="col-12">
                <p style={{ textAlign: 'center' }}>沒有符合條件的團隊</p>
              </div>
            )}
          </div>
          <div>
            <MyPagination
              totalPages={totalPages}
              fetchData={fetchData}
              setPage={setPage}
            />
          </div>
        </div>
      </div>
    </>
  )
}
