// import { useCallback } from 'react'
import moment from 'moment-timezone'

// export const useDateFormatter = () => {
//   const formatDateToTaiwan = useCallback((dateString) => {
//     return moment(dateString).tz('Asia/Taipei').format('YYYY年MM月DD日')
//   }, [])

//   const formatShortDate = useCallback((dateString) => {
//     return moment(dateString).tz('Asia/Taipei').format('YYYY/MM/DD')
//   }, [])

//   const formatDateTime = useCallback((dateString) => {
//     return moment(dateString).tz('Asia/Taipei').format('YYYY年MM月DD日 HH:mm')
//   }, [])

//   const formatTime = useCallback((timeString) => {
//     return moment(timeString, 'HH:mm:ss').format('A hh:mm')
//   }, [])
//   const formatSTime = useCallback((timeString) => {
//     return moment(timeString, 'HH:mm:ss').format('HH:mm')
//   }, [])

//   return { formatDateToTaiwan, formatShortDate, formatTime, formatDateTime }
// }

export const formatDateToTaiwan = (dateString) => {
  return moment(dateString).tz('Asia/Taipei').format('YYYY年MM月DD日')
}

export const formatShortDate = (dateString) => {
  return moment(dateString).tz('Asia/Taipei').format('YYYY/MM/DD')
}

export const formatDateTime = (dateString) => {
  return moment(dateString).tz('Asia/Taipei').format('YYYY年MM月DD日 HH:mm')
}

export const formatTime = (timeString) => {
  return moment(timeString, 'HH:mm:ss').format('A hh:mm')
}
export const formatSTime = (timeString) => {
  return moment(timeString, 'HH:mm:ss').format('HH:mm')
}
