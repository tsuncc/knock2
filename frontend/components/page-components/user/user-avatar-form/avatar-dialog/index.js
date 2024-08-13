import { styled } from '@mui/material/styles'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import BlackBtn from '@/components/UI/black-btn'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}))
export default function AvatarDialog({
  children,
  openDialog,
  closeDialog,
  avatarSubmit,
  resetUploader,
}) {
  return (
    <>
      <BootstrapDialog
        onClose={() => {
          closeDialog()
          resetUploader()
        }}
        aria-labelledby="customized-dialog-title"
        open={openDialog}
        fullWidth={true}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          <p>編輯頭像</p>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={closeDialog}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <form>
          <DialogContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            {children}
          </DialogContent>
          <DialogActions>
            <BlackBtn btnText="清除" href={null} onClick={resetUploader} />
            <BlackBtn btnText="確認上傳" href={null} onClick={avatarSubmit} />
          </DialogActions>
        </form>
      </BootstrapDialog>
    </>
  )
}
