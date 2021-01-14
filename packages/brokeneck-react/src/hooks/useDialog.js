import React, { useEffect, useRef, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText,
  makeStyles
} from '@material-ui/core'

import FormField from '../components/FormField'

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

export default function useDialog({
  onConfirm,
  title,
  text,
  action,
  fields = [],
  onClose = () => {}
}) {
  const [open, setOpen] = useState(false)
  const [formValues, setFormValues] = useState({})
  const [error, setError] = useState()
  const form = useRef()
  const [isValid, setIsValid] = useState()
  const classes = useStyles()

  useEffect(() => {
    if (!form.current) {
      return
    }

    setIsValid(form.current.checkValidity())
  }, [formValues])

  const handleClose = () => {
    closeDialog()
    onClose()
  }

  const handleChange = field => (e, value) => {
    return setFormValues(s => ({
      ...s,
      [field.name]: field.getValueFromObject
        ? field.getValueFromObject(value)
        : e.target[e.target.type === 'checkbox' ? 'checked' : 'value']
    }))
  }

  const handleConfirm = async e => {
    e.preventDefault()

    try {
      await onConfirm(formValues)
    } catch (err) {
      return setError(err)
    }

    closeDialog()
  }

  const closeDialog = () => {
    setFormValues({})
    setError()
    setOpen(false)
  }

  const dialog = (
    <Dialog open={open} onClose={handleClose}>
      <form
        ref={form}
        noValidate
        onSubmit={handleConfirm}
        className={classes.form}
        data-testid="dialog-form"
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {text && <DialogContentText>{text}</DialogContentText>}
          {fields.map(field => (
            <FormField
              key={field.name}
              field={field}
              handleChange={handleChange(field)}
              formValues={formValues}
            />
          ))}
          {error && <FormHelperText error>{error.message}</FormHelperText>}
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button fullWidth variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            disabled={!isValid}
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
          >
            {action}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )

  return [dialog, () => setOpen(true)]
}
