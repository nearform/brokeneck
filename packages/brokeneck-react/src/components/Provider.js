import React from 'react'
import { Chip, makeStyles } from '@material-ui/core'
import { useQuery } from 'graphql-hooks'

import { LOAD_PROVIDER } from '../graphql'

const useStyles = makeStyles({
  text: {
    textTransform: 'capitalize'
  }
})

export default function Provider() {
  const { data, loading } = useQuery(LOAD_PROVIDER)
  const classes = useStyles()

  if (loading) {
    return null
  }

  return <Chip className={classes.text} label={data.provider}></Chip>
}
