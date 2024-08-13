import * as React from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import styles from './basic-modal.module.css'

export default function BasicModal({
  modalTitle = 'Modal Title',
  modalBody,
  open,
  handleClose,
  modalW = '500px',
  modalH = '250px',
}) {
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          className={styles.modalContainer}
          sx={{
            width: modalW,
            height: modalH,
          }}
        >
          <h6 id="modal-title" className={styles.modalHeader}>
            {modalTitle}
          </h6>
          <div id="modal-description" className={styles.modalBody}>
            {modalBody}
          </div>
        </Box>
      </Modal>
    </div>
  )
}
