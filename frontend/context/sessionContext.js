// 在一個新文件中，例如 sessionContext.js
import React, { createContext, useState, useContext } from 'react'

const SessionContext = createContext()

export function SessionProvider({ children }) {
  const [dateSessionsStatus, setDateSessionsStatus] = useState([])

  return (
    <SessionContext.Provider
      value={{ dateSessionsStatus, setDateSessionsStatus }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  return useContext(SessionContext)
}
