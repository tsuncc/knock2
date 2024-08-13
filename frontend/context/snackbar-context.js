// SnackbarContext.js
import { createContext, useContext, useState, useCallback } from 'react'
import AutoHideSnackbar from '@/components/UI/snackbar'

const SnackbarContext = createContext()

// component
export const SnackbarContextProvider = ({ children }) => {
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
    severity: 'success',
  })

  const openSnackbar = useCallback((message, severity = 'success') => {
    setSnackbarState({ open: true, message, severity })
  }, [])

  const closeSnackbar = useCallback(() => {
    setSnackbarState((prevState) => ({ ...prevState, open: false }))
  }, [])

  return (
    <SnackbarContext.Provider value={{ openSnackbar, closeSnackbar }}>
      {children}
      <AutoHideSnackbar
        open={snackbarState.open}
        text={snackbarState.message}
        severity={snackbarState.severity}
        onClose={closeSnackbar}
      />
    </SnackbarContext.Provider>
  )
}

export const useSnackbar = () => useContext(SnackbarContext)
export default SnackbarContext
