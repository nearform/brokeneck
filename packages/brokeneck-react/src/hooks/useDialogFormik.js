import React, { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  makeStyles
} from '@material-ui/core'
import { useFormik } from 'formik'
import startCase from 'lodash.startcase'

const useStyles = makeStyles(theme => ({
  form: {
    padding: theme.spacing(3)
  },
  dialogActions: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingBottom: theme.spacing(2)
  }
}))

export default function useDialogFormik({
  title,
  text,
  action,
  fields = {},
  handleSubmit = () => {},
  onClose = () => {}
}) {
  const [open, setOpen] = useState(false)
  const classes = useStyles()

  const formik = useFormik({
    initialValues: {
      ...fields
    },
    onSubmit: values => {
      handleSubmit(values)
    }
  })

  const fieldList = Object.keys(fields)

  const handleClose = () => {
    closeDialog()
    onClose()
  }

  const closeDialog = () => {
    setOpen(false)
  }

  const dialog = (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={formik.handleSubmit} className={classes.form}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {text && <DialogContentText>{text}</DialogContentText>}
          {fieldList.map(field => (
            <TextField
              key={field}
              label={startCase(field)}
              name={field}
              value={formik.values[field]}
              onChange={formik.handleChange}
              error={
                formik.touched[field.name] && Boolean(formik.errors[field.name])
              }
              fullWidth
              variant="outlined"
              size="small"
            ></TextField>
          ))}
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button fullWidth variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button fullWidth variant="contained" color="primary" type="submit">
            {action}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )

  return [dialog, () => setOpen(true)]
}
