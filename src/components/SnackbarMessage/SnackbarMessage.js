import React from 'react'
import MuiAlert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { useNotificationsContext } from '../../context/NotificationsContext'

const SnackbarMessage = () => {
  const {
    textNotification,
    severityNotification,
    openNotification,
    setOpenNotification
  } = useNotificationsContext()

  const Alert = React.forwardRef(function Alert(
    props,
    ref
  ) {
    return (
      <MuiAlert
        elevation={6}
        ref={ref}
        variant="filled"
        {...props}
      />
    )
  })

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenNotification(false)
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      open={openNotification}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={severityNotification}
        sx={{ width: '100%' }}
      >
        {textNotification}
      </Alert>
    </Snackbar>
  )
}

export default SnackbarMessage
