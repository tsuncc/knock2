// COMPONENT basic modal layout
import * as React from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import styles from './basic-modal.module.css'

export default function BasicModal({
  modalTitle = 'Modal Title',
  modalBody,
  open,
  handleClose,
  modalW = '640px',
  modalH = '640px',
}) {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: modalW,
    height: modalH,
    bgcolor: 'background.paper',
    borderRadius: '1rem',
    boxShadow: ' var(--card-shadow)',
    padding: '1.5rem',
  }

  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <h6 className={styles.modalHeader}>{modalTitle}</h6>
          {modalBody}
        </Box>
      </Modal>
    </div>
  )
}
