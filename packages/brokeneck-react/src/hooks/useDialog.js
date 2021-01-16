import React, { useCallback, useEffect, useRef, useState } from 'react'
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
import { useFormik } from 'formik'

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
  const initialValid = useCallback(() => fields.length === 0, [fields.length])

  const [open, setOpen] = useState(false)
  const [error, setError] = useState()
  const formRef = useRef()
  const [isValid, setIsValid] = useState(initialValid)
  const classes = useStyles()

  const initialValues = fields.reduce(
    (acc, f) => ({ ...acc, [f.name]: f.initialValue }),
    {}
  )

  const handleConfirm = useCallback(
    async values => {
      try {
        await onConfirm(values)
      } catch (err) {
        return setError(err)
      }

      closeDialog()
    },
    [closeDialog, onConfirm]
  )

  const formik = useFormik({
    initialValues,
    onSubmit: handleConfirm,
    enableReinitialize: true
  })

  useEffect(() => {
    if (!formRef.current) {
      return
    }

    setIsValid(formRef.current.checkValidity())
  }, [formik.values])

  const handleClose = useCallback(() => {
    closeDialog()
    onClose()
  }, [closeDialog, onClose])

  const handleChange = useCallback(
    field => (e, value) =>
      formik.setFieldValue(
        field.name,
        field.getValueFromObject
          ? field.getValueFromObject(value)
          : e.target[e.target.type === 'checkbox' ? 'checked' : 'value']
      ),
    [formik]
  )

  const closeDialog = useCallback(() => {
    formik.resetForm()
    setError()
    setIsValid(initialValid)
    setOpen(false)
  }, [formik, initialValid])

  const dialog = (
    <Dialog open={open} onClose={handleClose}>
      <form
        ref={formRef}
        noValidate
        onSubmit={formik.handleSubmit}
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
              formValues={formik.values}
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
