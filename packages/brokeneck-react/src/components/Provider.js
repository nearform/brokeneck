import React from 'react'
import { Chip, makeStyles } from '@material-ui/core'

import useProvider from '../hooks/useProvider'

const useStyles = makeStyles({
  text: {
    textTransform: 'capitalize'
  }
})

export default function Provider() {
  const provider = useProvider()
  const classes = useStyles()

  return <Chip className={classes.text} label={provider.name}></Chip>
}
