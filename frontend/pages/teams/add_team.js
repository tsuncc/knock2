import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import IndexLayout from '@/components/layout'
import styles from '@/components/page-components/teams/teams.module.css'
import { formatDateToTaiwan, formatTime } from '@/hooks/useDateFormatter'
import { useSnackbar } from '@/context/snackbar-context'
import LINK from 'next/link'
import { useAuth } from '@/context/auth-context'
import { R_CREATE_TEAM, CREATE_TEAM } from '@/configs/api-path'

import TeamModal01 from '../../components/page-components/teams/team-modal-1'
import TeamsNotice from '@/components/page-components/teams/add_team/add_notice'
import SubmitBtn from '@/components/page-components/teams/add_team/submit-btn'

export default function TeamsAdd() {
  const { auth } = useAuth()
  const router = useRouter()
  const { reservation_id } = router.query
  const { openSnackbar } = useSnackbar()

  const [reservationData, setReservationData] = useState(null)
  const [createTeam, setCreateTeam] = useState({
    success: false,
    reservation_id: 0,
    team_title: '',
    team_limit: '1',
    team_note: '',
  })

  const [titleError, setTitleError] = useState('')
  const [limitError, setLimitError] = useState('')
  const [checkboxError, setCheckboxError] = useState('')
  const [checkboxChecked, setCheckboxChecked] = useState(false)
  const [disableSubmit, setDisableSubmit] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    if (reservation_id) {
      fetchData(reservation_id)
    }
  }, [reservation_id])

  const fetchData = async (reservationId) => {
    try {
      const response = await fetch(`${R_CREATE_TEAM}${reservationId}`)
      const result = await response.json()

      if (result.success) {
        setReservationData(result.rows[0])
        setCreateTeam((prev) => ({ ...prev, reservation_id: reservationId }))
      } else {
        console.error('Error fetching data:', result.message)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    }
  }

  const validateForm = () => {
    let valid = true
    if (createTeam.team_title.length < 3) {
      setTitleError('團隊名稱需大於3個字')
      valid = false
    } else {
      setTitleError('')
    }

    if (limitError) {
      valid = false
    }

    if (!document.getElementById('readCheck').checked) {
      setCheckboxError('請閱讀注意事項')
      valid = false
    } else {
      setCheckboxError('')
    }

    return valid
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCreateTeam({ ...createTeam, [name]: value })

    if (name === 'team_limit') {
      const maxLimit = reservationData.participants - 1
      if (parseInt(value, 10) > maxLimit) {
        setLimitError(`此行程團員上限為${maxLimit}人`)
      } else {
        setLimitError('')
      }
    }

    if (name === 'team_title') {
      if (value.length < 3) {
        setTitleError('團隊名稱需大於3個字')
      } else {
        setTitleError('')
      }
    }

    if (validateForm()) {
      setDisableSubmit(false)
    } else {
      setDisableSubmit(true)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }
    try {
      const res = await fetch(CREATE_TEAM, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createTeam),
      })

      const result = await res.json()

      if (result.success) {
        openSnackbar('成功創建團隊！', 'success')
        router.push('/teams')
      } else {
        openSnackbar('創建團隊失敗', 'error')
      }
    } catch (error) {
      openSnackbar('創建團隊時發生錯誤', 'error')
    }
  }

  const openModal = () => {
    if (window.innerWidth < 992) {
      setModalOpen(true)
    }
  }
  const closeModal = () => {
    setModalOpen(false)
    document.getElementById('readCheck').checked = true
    setCheckboxError('')
    if (validateForm()) {
      setDisableSubmit(false)
    }
  }
  return (
    <>
      <IndexLayout title="糾團" background="dark">
        <div className={styles.pageTitle}>
          <h2 style={{ color: '#B99755' }}>新增團隊</h2>
        </div>
        <div className={styles.teamsPage}>
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-6">
                <div className={styles.borderbox}>
                  <h3 className={styles.teamTitle}>創立團隊</h3>
                  <form
                    name="createTeam"
                    onSubmit={handleSubmit}
                    className={styles.teamForm}
                  >
                    <div className="mb-3">
                      <label htmlFor={'lead_name'} className="form-label">
                        團長： {auth.nickname}
                      </label>
                    </div>
                    {reservationData ? (
                      <div className="mb-3">
                        <div className="displayDetail">
                          <div>主題名稱: {reservationData.theme_name}</div>
                          <div>
                            行程日期:{' '}
                            {formatDateToTaiwan(
                              reservationData.reservation_date
                            )}
                          </div>
                          <div>
                            活動時間: {formatTime(reservationData.start_time)} ~{' '}
                            {formatTime(reservationData.end_time)}
                          </div>
                          <div>預約人數: {reservationData.participants} 人</div>
                        </div>
                      </div>
                    ) : (
                      <div>Loading...</div>
                    )}
                    <hr />

                    <div className={`mb-3 ${styles.sty}`}>
                      <label htmlFor={'team_title'} className="form-label">
                        團隊名稱
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="team_title"
                        name="team_title"
                        value={createTeam.team_title}
                        onChange={handleInputChange}
                        aria-describedby="enterteamname"
                      />
                      <div style={{ color: 'red' }}>
                        {titleError && titleError}
                      </div>
                    </div>

                    <div className={`mb-3 ${styles.sty}`}>
                      <label htmlFor={'team_limit'} className="form-label">
                        募集人數
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="team_limit"
                        name="team_limit"
                        value={createTeam.team_limit}
                        onChange={handleInputChange}
                        aria-label="enterteamlimit"
                      />
                      <div style={{ color: 'red' }}>
                        &nbsp;{limitError && limitError}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor={'team_note'} className="form-label">
                        開團備註（200字以內）
                      </label>
                      <textarea
                        className="form-control"
                        id="floatingTextarea"
                        name="team_note"
                        value={createTeam.team_note}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                    <div className="mb-3 form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="readCheck"
                        checked={checkboxChecked}
                        onChange={() => setCheckboxChecked(!checkboxChecked)}
                      />
                      <label className={styles.formCheck} htmlFor={'readCheck'}>
                        我已閱讀
                        <LINK href="#" onClick={openModal}>
                          <b>注意事項</b>
                        </LINK>
                      </label>
                      <div style={{ color: 'red' }}>{checkboxError}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <SubmitBtn
                        btnText="建立團隊"
                        color="#B99577"
                        disableSubmit={disableSubmit}
                      />
                    </div>
                  </form>
                </div>
              </div>
              <div className="col-lg-6 d-none d-lg-block">
                <div className={styles.borderbox}>
                  <TeamsNotice />
                </div>
              </div>
            </div>
          </div>
        </div>
      </IndexLayout>
      <TeamModal01
        open={modalOpen}
        onClose={closeModal}
        modalTitle="注意事項"
        modalBody={<TeamsNotice />}
      ></TeamModal01>
    </>
  )
}
