import React, { createContext, useContext, useState, useCallback } from 'react'
import { THEMES_DETAILS } from '@/configs/api-path'

const ThemeContext = createContext()

export function useTheme() {
  return useContext(ThemeContext)
}

export const ThemeProvider = ({ children }) => {
  const [themeDetails, setThemeDetails] = useState(null)

  const getThemeDetails = useCallback(async (branch_themes_id, user_id) => {
    console.log(
      `Fetching theme details for branch_themes_id: ${branch_themes_id}, user_id: ${user_id}`
    )
    try {
      const response = await fetch(
        `${THEMES_DETAILS}/${branch_themes_id}?user_id=${user_id}`
      )
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('Fetched theme details:', data) // 調試信息

      if (data.success && data.theme) {
        setThemeDetails(data.theme)
        console.log('Theme details updated in context')
        return data.theme
      } else {
        console.error('Invalid data structure:', data)
        throw new Error('Invalid data structure')
      }
    } catch (error) {
      console.error('Error in getThemeDetails:', error)
      throw error
    }
  }, [])

  const updateAvailableCoupons = useCallback(
    async (branch_themes_id, user_id) => {
      console.log(
        `Updating available coupons for branch_themes_id: ${branch_themes_id}, user_id: ${user_id}`
      )
      try {
        const updatedTheme = await getThemeDetails(branch_themes_id, user_id)
        console.log(
          'Updated available coupons:',
          updatedTheme.available_coupons
        )
        return updatedTheme.available_coupons
      } catch (error) {
        console.error('Error updating available coupons:', error)
        throw error
      }
    },
    [getThemeDetails]
  )

  const clearThemeDetails = useCallback(() => {
    console.log('Clearing theme details from context')
    setThemeDetails(null)
  }, [])

  return (
    <ThemeContext.Provider
      value={{
        themeDetails,
        getThemeDetails,
        updateAvailableCoupons,
        clearThemeDetails,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
