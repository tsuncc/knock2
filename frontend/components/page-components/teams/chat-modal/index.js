import React, { useState, useCallback } from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Button from '@mui/material/Button'

export default function TeamManagerModal({
  modalTitle = 'Modal Title',
  open,
  onClose,
  modalBody,
  modalBody2,
  buttonLabel,
  buttonLabel2,
  // modalW = '840px',
  // modalH = '750px',
  onButtonClick,
}) {
  const [currentContent, setCurrentContent] = useState(1)
  const [contentText, setContentText] = useState(modalBody)

  const handleClick = useCallback(() => {
    if (currentContent === 1) {
      setContentText(modalBody2)
      setCurrentContent(2)
    } else {
      onButtonClick()
      onClose()
    }
  }, [currentContent, modalBody2, buttonLabel2, onClose])
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <h6 style={modalHeader}>{modalTitle}</h6>
        <hr />
        <div style={modalContent}>{contentText}</div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '1rem',
          }}
        >
          <Button sx={button} variant="contained" onClick={handleClick}>
            {currentContent === 1 ? buttonLabel : buttonLabel2}
          </Button>
        </div>
      </Box>
    </Modal>
  )
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // width: modalW,
  // height: modalH,
  bgcolor: '#222222',
  // bgcolor: 'background.paper',
  borderRadius: '1rem',
  boxShadow: 'var(--card-shadow)',
  padding: '1.5rem',
  border: '1px solid #B99755',
  color: '#B99755',
}

const modalHeader = {
  marginBottom: '1.5rem',
  textAlign: 'center',
}

const modalContent = {
  maxHeight: '500px',
  overflowY: 'auto',
  lineHeight: '40px',
}

const button = {
  border: '1px solid black',
  fontFamily: 'Noto Serif JP',
  fontSize: '16px',
  borderRadius: '30px',
  backgroundColor: '#B99755',
  color: 'white',
  padding: '10px 30px',
  margin: '12px 24px',
  '&:hover': {
    backgroundColor: 'white',
    color: '#B99755',
    boxShadow: 'none',
  },
  boxShadow: 'none',
}
