import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Button from '@mui/material/Button'
import styles from './basic-modal.module.css'

export default function TeamModal01({
  modalTitle = 'Modal Title',
  modalBody,
  open,
  onClose,
  modalW = '90%',
  // modalW = '840px',
  // modalH = '750px',
}) {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: modalW,
    // height: modalH,
    bgcolor: '#222222',
    // bgcolor: 'background.paper',
    borderRadius: '1rem',
    boxShadow: 'var(--card-shadow)',
    padding: '2.5rem',
    color: '#B99755',
    lineHeight: '1.5',
  }
  const [modalWidth, setModalWidth] = useState(modalW)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 992) {
        setModalWidth('450px')
      } else {
        setModalWidth(modalW)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize() // Call initially to set the correct width

    return () => window.removeEventListener('resize', handleResize)
  }, [modalW])

  const button = {
    border: '1px solid black',
    fontFamily: 'Noto Serif JP',
    fontSize: '16px',
    borderRadius: '30px',
    backgroundColor: '#B99755',
    color: 'black',
    padding: '10px 30px',
    '&:hover': {
      backgroundColor: 'white',
      color: '#B99755',
      boxShadow: 'none',
    },
    boxShadow: 'none',
  }

  return (
    <Modal open={open} onClose={() => {}}>
      <Box sx={style}>
        <h4 className={styles.modalHeader}>{modalTitle}</h4>
        <hr></hr>
        <div
          className={styles.modalContent}
          style={{ maxHeight: '500px', overflowY: 'auto', lineHeight: '1.5' }}
        >
          {modalBody}
        </div>
        <hr></hr>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '1rem',
          }}
        >
          <Button sx={button} variant="contained" onClick={onClose}>
            確定
          </Button>
        </div>
      </Box>
    </Modal>
  )
}
