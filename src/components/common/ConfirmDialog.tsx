import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  handleClose: () => void
  handleConfirm: () => void
}

function ConfirmDialog({ open, title, message, handleClose, handleConfirm }: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle color="blue">{title}</DialogTitle>
      <DialogContent>
        {message.split("\n").map((line, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <span key={index}>
            {line}
            <br />
          </span>
        ))}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          color="inherit"
          variant="contained"
          sx={{ fontWeight: "bold" }}
        >
          취소
        </Button>
        <Button
          onClick={handleConfirm}
          color="primary"
          variant="contained"
          sx={{ fontWeight: "bold" }}
          autoFocus
        >
          확인
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
