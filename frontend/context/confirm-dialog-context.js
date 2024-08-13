import React, { createContext, useContext, useState, useCallback } from 'react'

const ConfirmDialogContext = createContext()

export const useConfirmDialog = () => {
  return useContext(ConfirmDialogContext)
}

export const ConfirmDialogProvider = ({ children }) => {
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState(() => () => {})

  const openConfirmDialog = (action) => {
    setConfirmAction(() => action)
    setConfirmDialogOpen(true)
  }

  const closeConfirmDialog = () => {
    setConfirmDialogOpen(false)
    setConfirmAction(() => () => {})
  }

  const handleConfirm = useCallback(() => {
    confirmAction()
    closeConfirmDialog()
  }, [confirmAction])

  return (
    <ConfirmDialogContext.Provider
      value={{
        isConfirmDialogOpen,
        openConfirmDialog,
        closeConfirmDialog,
        handleConfirm,
      }}
    >
      {children}
    </ConfirmDialogContext.Provider>
  )
}
