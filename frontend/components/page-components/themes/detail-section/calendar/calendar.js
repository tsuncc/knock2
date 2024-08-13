import React, { useState, useEffect, useContext } from 'react'
import dayjs from 'dayjs'
import { IoIosArrowDropleft, IoIosArrowDropright } from 'react-icons/io'
import { FaCircle, FaFacebook, FaInstagram } from 'react-icons/fa'
import Reservation from '../reservation/reservation'
import myStyle from './calendar.module.css'
import { DateContext } from '@/context/date-context'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useSession } from '@/context/sessionContext'

const Calendar = ({ branch_themes_id }) => {
  const { setDateSessionsStatus } = useSession()
  const router = useRouter()
  const { id } = router.query

  //
  const [currentDate, setCurrentDate] = useState(dayjs())
  const [daysInMonth, setDaysInMonth] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [month, setMonth] = useState(currentDate.month())
  const [year, setYear] = useState(currentDate.year())
  const { updateSelectedDate } = useContext(DateContext)
  const [calendarData, setCalendarData] = useState({})

  const isDateInAllowedRange = (date) => {
    const today = dayjs()
    const threeMonthsLater = today.add(3, 'month')
    return date.isAfter(today, 'day') && date.isBefore(threeMonthsLater, 'day')
  }

  const fetchCalendarData = async (year, month) => {
    if (!branch_themes_id) return

    try {
      const response = await axios.get(
        `http://localhost:3001/themes/calendar`,
        {
          params: { year, month, branch_themes_id },
        }
      )
      setCalendarData(response.data)
    } catch (error) {
      console.error('Error fetching calendar data:', error)
    }
  }

  useEffect(() => {
    console.log('Calendar component:', { year, month, branch_themes_id })
    if (branch_themes_id) {
      fetchCalendarData(year, month + 1)
    }
  }, [year, month, branch_themes_id])

  useEffect(() => {
    if (branch_themes_id) {
      fetchCalendarData(currentDate.year(), currentDate.month() + 1)
    }
  }, [currentDate, branch_themes_id])

  useEffect(() => {
    const updateDaysInMonth = () => {
      const startOfMonth = currentDate.startOf('month')
      const endOfMonth = currentDate.endOf('month')
      const startDayOfWeek = startOfMonth.day()
      const endDayOfWeek = endOfMonth.day()
      const days = []
      const today = dayjs()

      // 加入上個月的天數
      for (let i = startDayOfWeek; i > 0; i--) {
        days.push({
          day: startOfMonth.subtract(i, 'day').date(),
          currentMonth: false,
          status: 'disabled',
        })
      }

      // 加入當月的天數
      for (let i = 1; i <= endOfMonth.date(); i++) {
        const date = dayjs(`${year}-${month + 1}-${i}`)
        const dateString = date.format('YYYY-MM-DD')
        const dayData = calendarData[dateString] || {}
        const isAllowed = isDateInAllowedRange(date)
        const isPastOrToday =
          date.isBefore(dayjs(), 'day') || date.isSame(dayjs(), 'day')
        days.push({
          day: i,
          currentMonth: true,
          status: isPastOrToday
            ? 'disabled'
            : isAllowed
            ? dayData.status || 'open'
            : 'disabled',
          clickable: isAllowed && !isPastOrToday && dayData.status !== 'full',
        })
      }

      // 加入下個月的天數
      const daysNeeded = (7 - ((startDayOfWeek + endOfMonth.date()) % 7)) % 7
      for (let i = 1; i <= daysNeeded; i++) {
        days.push({
          day: i,
          currentMonth: false,
          status: 'disabled',
        })
      }

      setDaysInMonth(days)
    }

    updateDaysInMonth()
  }, [currentDate, month, year, calendarData])

  const handlePrevMonth = () => {
    const newDate = currentDate.subtract(1, 'month')
    setCurrentDate(newDate)
    setMonth(newDate.month())
    setYear(newDate.year())
  }

  const handleNextMonth = () => {
    const newDate = currentDate.add(1, 'month')
    setCurrentDate(newDate)
    setMonth(newDate.month())
    setYear(newDate.year())
  }

  const handleKeyPress = (event, handler) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handler()
    }
  }

  const handleDateClick = (day) => {
    if (day.status === 'disabled') return

    setSelectedDate(day)
    updateSelectedDate({
      day: day.day,
      month: currentDate.month(),
      year: currentDate.year(),
    })

    const formattedDate = `${currentDate.year()}-${String(
      currentDate.month() + 1
    ).padStart(2, '0')}-${String(day.day).padStart(2, '0')}`
    fetchSessionsStatus(formattedDate, branch_themes_id)
  }

  const fetchSessionsStatus = async (date) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/themes/sessions-status`,
        {
          params: { date, branch_themes_id },
        }
      )
      setDateSessionsStatus(response.data)
    } catch (error) {
      console.error('Error fetching sessions status:', error)
    }
  }

  const renderDay = (day, index) => {
    const classes = [myStyle.date]
    if (day.status === 'prev-month' || day.status === 'next-month')
      classes.push(myStyle.otherMonth)
    if (day.status === 'open') classes.push(myStyle.open)
    if (day.status === 'partial') classes.push(myStyle.partial)
    if (day.status === 'full') classes.push(myStyle.full)
    if (day.status === 'disabled') classes.push(myStyle.disabled)
    if (!day.clickable) classes.push(myStyle.notClickable)
    if (
      day.currentMonth &&
      day.day === dayjs().date() &&
      currentDate.month() === dayjs().month() &&
      currentDate.year() === dayjs().year()
    ) {
      classes.push(myStyle.currentDay)
    }
    if (selectedDate && selectedDate.day === day.day && day.currentMonth) {
      classes.push(myStyle.selected)
    }

    return (
      <td key={index} className={classes.join(' ')}>
        <div
          onClick={() => day.clickable && handleDateClick(day)}
          onKeyPress={(e) =>
            day.clickable && handleKeyPress(e, () => handleDateClick(day))
          }
          role="button"
          tabIndex={day.clickable ? '0' : '-1'}
          className={myStyle.dateContent}
        >
          {day.day}
        </div>
      </td>
    )
  }

  const renderWeeks = () => {
    const weeks = []
    let days = []

    daysInMonth.forEach((day, index) => {
      days.push(renderDay(day, index))
      if (days.length === 7) {
        weeks.push(<tr key={index}>{days}</tr>)
        days = []
      }
    })

    if (days.length > 0) {
      weeks.push(<tr key={days.length}>{days}</tr>)
    }

    return weeks
  }

  return (
    <div className="container-fluid container-md">
      <div className="row d-flex justify-content-evenly">
        <div className={myStyle.calendarBg}>
          <div className={myStyle.calendar}>
            <div className="d-flex justify-content-evenly align-items-center mb-3">
              <div
                onClick={handlePrevMonth}
                onKeyPress={(e) => handleKeyPress(e, handlePrevMonth)}
                role="button"
                tabIndex="0"
              >
                <IoIosArrowDropleft className={myStyle.icon} />
              </div>
              <div>
                <h4>{dayjs(new Date(year, month)).format('MMMM YYYY')}</h4>
              </div>
              <div
                onClick={handleNextMonth}
                onKeyPress={(e) => handleKeyPress(e, handleNextMonth)}
                role="button"
                tabIndex="0"
              >
                <IoIosArrowDropright className={myStyle.icon} />
              </div>
            </div>

            <table className={myStyle.table}>
              <thead>
                <tr>
                  <td>Su</td>
                  <td>Mo</td>
                  <td>Tu</td>
                  <td>We</td>
                  <td>Th</td>
                  <td>Fr</td>
                  <td>Sa</td>
                </tr>
              </thead>
              <tbody>{renderWeeks()}</tbody>
            </table>

            <div className="mt-3 d-flex flex-row align-items-center justify-content-end mb-4">
              <div className="d-flex align-items-center justify-content-end mb-2 mb-md-0">
                <FaCircle className={myStyle.icon2} />
                <span>場次已額滿</span>
              </div>
              <div className="d-flex align-items-center justify-content-end mb-2 mb-md-0">
                <FaCircle className={myStyle.icon3} />
                <span>剩部分場次</span>
              </div>
              <div className="d-flex align-items-center justify-content-end mb-2 mb-md-0">
                <FaCircle className={myStyle.icon4} />
                <span>開放預約</span>
              </div>
            </div>

            <hr className={myStyle.hr} />

            <div className="d-flex flex-column flex-md-row justify-content-between">
              <div className={`${myStyle.info} mb-3 mb-md-0`}>
                <div className="mb-3">預約當日場次請來電 (･∀･)</div>
                <div>For international travelers, </div>
                <div>please send a direct message</div>
                <div>to our FB or Instagram.</div>
              </div>
              <div className="d-flex justify-content-end align-items-end">
                <FaFacebook className={myStyle.icon5} />
                <FaInstagram className={myStyle.icon5} />
              </div>
            </div>
          </div>
        </div>
        <Reservation id={id} />
      </div>
    </div>
  )
}

export default Calendar
