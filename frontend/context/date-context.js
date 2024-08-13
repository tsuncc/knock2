import React, { createContext, useState } from 'react'

export const DateContext = createContext()

export const DateProvider = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(null)

  const updateSelectedDate = (day) => {
    setSelectedDate({
      day: day.day,
      month: day.month,
      year: day.year,
    })
  }

  return (
    <DateContext.Provider value={{ selectedDate, updateSelectedDate }}>
      {children}
    </DateContext.Provider>
  )
}
